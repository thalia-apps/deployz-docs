// Copy the vendor API OpenAPI document from the Deployz app repository.
//
// Usage: node scripts/sync-openapi.mjs <path-to-deployz-checkout> [commit]
//
// The app generates apps/api/openapi.json from apps/api/src/public-api-spec.ts.
// This script reads that file at the given commit (default HEAD), writes it to
// api-reference/openapi.json, and prints the commit to record in the pull request
// and in the verification markers of the api/ pages.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [appRepo, ref = 'HEAD'] = process.argv.slice(2);
if (!appRepo) {
  console.error('Usage: node scripts/sync-openapi.mjs <path-to-deployz-checkout> [commit]');
  process.exit(1);
}

const git = (...args) => execFileSync('git', ['-C', appRepo, ...args], { encoding: 'utf8' });
const commit = git('rev-parse', `${ref}^{commit}`).trim();
const spec = git('show', `${commit}:apps/api/openapi.json`);
JSON.parse(spec); // Fail before writing if the file is not valid JSON.

const target = fileURLToPath(new URL('../api-reference/openapi.json', import.meta.url));
writeFileSync(target, spec.replace(/\r\n/g, '\n'));
console.log(`Wrote api-reference/openapi.json from deployz ${commit}`);
