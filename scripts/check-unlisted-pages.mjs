// Fails when a .md/.mdx file that Mintlify would publish is not in docs.json navigation.
// Mintlify serves any page file that .mintignore does not exclude, even if it is not in navigation.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Mintlify's default ignores: https://mintlify.com/docs/organize/mintignore
const DEFAULT_IGNORES = [
  ".git/", ".github/", ".claude/", ".agents/", ".idea/", ".vscode/", ".cursor/",
  ".mintlify/", "node_modules/",
  "README.md", "LICENSE.md", "CHANGELOG.md", "CONTRIBUTING.md",
];

const git = (args) =>
  execFileSync("git", args, { encoding: "utf8" }).split("\n").filter(Boolean);

const pageFiles = git(["ls-files", "--cached", "--others", "--exclude-standard", "--", "*.md", "*.mdx"]);
const ignored = new Set(
  git([
    "ls-files", "--cached", "--others", "--ignored",
    "--exclude-from=.mintignore",
    ...DEFAULT_IGNORES.map((p) => `--exclude=${p}`),
    "--", "*.md", "*.mdx",
  ]),
);

// Collect every page path from docs.json (strings in "pages" arrays and "root" keys).
const navPages = new Set();
(function walk(node, key) {
  if (typeof node === "string") {
    if (key === "pages" || key === "root") navPages.add(node.replace(/^\//, ""));
  } else if (Array.isArray(node)) {
    node.forEach((child) => walk(child, key));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) walk(v, k);
  }
})(JSON.parse(readFileSync("docs.json", "utf8")).navigation);

// Files imported into other files are snippets, not standalone pages.
const imported = new Set();
for (const file of pageFiles.filter((f) => !ignored.has(f))) {
  for (const [, spec] of readFileSync(file, "utf8").matchAll(/^import\s.*?from\s+["']([^"']+\.mdx?)["']/gm)) {
    imported.add(spec.replace(/^\//, ""));
  }
}

const unlisted = pageFiles.filter((file) => {
  if (ignored.has(file) || imported.has(file) || file.startsWith("snippets/")) return false;
  return !navPages.has(file.replace(/\.mdx?$/, ""));
});

if (unlisted.length) {
  console.error("These files are published but are not in docs.json navigation:");
  for (const file of unlisted) console.error(`  ${file}`);
  console.error("Add each file to docs.json navigation, or add it to .mintignore.");
  process.exit(1);
}
console.log(`OK: all ${navPages.size} navigation pages checked; no unlisted published files.`);
