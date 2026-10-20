# Documentation project instructions

## About this project

- This is the public documentation site for Deployz, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- The content plan is in `planning/content-strategy.md` (excluded from publishing by `.mintignore`)
- For Mintlify product knowledge (components, configuration, writing standards), install the Mintlify skill: `npx skills add https://mintlify.com/docs`
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Source of truth

- The Deployz application code is the source of truth. When the code and the app repository's internal docs disagree, follow the code.
- Verify UI labels, statuses, limits, and prices against the code before you publish them.

## Customer security content

- An AI coding agent checks customer security content against the Deployz code on every relevant app change and before each release. This covers the customer guide's security, before-you-install, and removal pages, and must stay consistent with the in-app text in `apps/web/src/lib/security-details.ts`.
- Verify each claim against its source: `packages/cdk/src/bootstrap/` (IAM permissions and tag conditions), `packages/relay/` (outbound-only connection, data sent to Deployz), the pending-secret code (secret deletion and backup periods), and the removal code (what is retained).
- Report each claim as still true, changed, or can't verify, with the file and line as evidence. Don't publish a changed claim until both the docs and the in-app text are updated.
- Record on each security page the `deployz` commit it was last checked against.

## Spelling

- Use US English spelling everywhere, including when you refer to a UI label that the product spells differently. For example, write **Analyze application**, **Re-analyze**, and **Not analyzed**, and write "organization", "behavior", and "canceled".
- Keep the label's wording and capitalization otherwise unchanged.

## Terminology

| Use | Don't use |
| --- | --- |
| application | app (as a noun in headings), product |
| release (the version is its label) | build, image (as a noun) |
| deployment; "install" as the verb for the first deployment | installation, environment |
| test deployment | test install |
| install link | deploy link, installation link |
| invitation, invite a customer | create installation |
| Deployz connector | relay, bootstrap (name the CloudFormation stack only where the reader works in the AWS console) |
| remove a deployment | disconnect, uninstall |
| delete retained data | purge |
| Needs input, Needs attention, Failed | issue, problem, error (as a status) |
| Technical details | Advanced details |
| organization; owner, admin, member | workspace |
| vendor (the software company using Deployz); customer (the vendor's customer) | client, end user |
| your software provider (in the customer guide, for the vendor) | vendor, publisher (in customer guide pages) |

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Start each procedure by saying who does it: the vendor in the Deployz dashboard, or the customer on the install page or in their AWS console
- State consequences before the action, especially for rollback, removal, Region, and size choices
- Mark features at Preview maturity with a Preview label

## Content boundaries

- Document what vendors and their customers see and do.
- Don't document Deployz-internal operations: Team Admin, control-plane deploys, CI, configuration keys, or test harnesses.
- Don't document internal API routes. Deployz has no public API.
- Don't document the legacy deploy link.
- Keep the customer guide (`customers/*`) vendor-neutral until vendor branding is added.
- Page URLs are linked from the Deployz app. Don't rename or move a page without adding a redirect in `docs.json`.
- Send every "contact support" link to `https://share.hsforms.com/1dOsn_DJtRhq47DXIaRjeLw5auur`.
