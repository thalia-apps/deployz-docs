# Deployz documentation

This repository holds the public Deployz documentation, built with [Mintlify](https://mintlify.com). It covers two audiences: software vendors who use Deployz (the **Documentation** tab), and their customers, who install a vendor's application in their own AWS account (the **Customer guide** tab).

## Where things are

- Pages are MDX files with YAML frontmatter, grouped by folder: `prepare/`, `releases/`, `share/`, `operate/`, `account/`, `troubleshooting/`, `reference/`, and `customers/`.
- `docs.json` holds the site configuration and navigation. Every published page must be listed there.
- `snippets/` holds tables that several pages import.
- `AGENTS.md` holds the editorial and maintenance rules. Read it before you write or review a page.
- `planning/` holds the content plan and audits. `.mintignore` keeps it, `AGENTS.md`, and `scripts/` off the published site.

## Preview locally

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm i -g mint
```

Run the preview from the repository root:

```bash
mint dev
```

The preview opens at `http://localhost:3000`.

## Check before you open a pull request

```bash
mint broken-links
```

```bash
mint validate
```

```bash
node scripts/check-unlisted-pages.mjs
```

The last check also runs in CI. It fails when a page file would be published but isn't in `docs.json` navigation.

## Publishing

Changes merged to `main` deploy automatically through the Mintlify GitHub app.
