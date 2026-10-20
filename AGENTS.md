# AGENTS.md — Deployz documentation

## Purpose

This is the master editorial and maintenance guideline for all Deployz documentation. Apply it when planning, writing, editing, organizing, or reviewing content.

Keep this file stable and feature-independent. Product behavior, setup instructions, limits, and other changing facts belong in their relevant documentation pages.

## Project setup

- This documentation site is built on [Mintlify](https://mintlify.com).
- Pages are MDX files with YAML frontmatter.
- Site configuration lives in `docs.json`.
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings.
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to look up how Mintlify works.
- For Mintlify product knowledge (components, configuration, writing standards), install the Mintlify skill: `npx skills add https://mintlify.com/docs`.

## Audience and approach

Write for software vendors and their customers, including founders, developers, and technical beginners. Assume basic software knowledge, but do not assume infrastructure expertise.

- Help readers understand, complete a task, or resolve a problem.
- Identify the intended reader when a page applies to a specific audience.
- Lead with the useful answer. Add context only where it helps the reader act.
- Prefer progressive disclosure: explain the common path first and link to advanced detail.
- Keep documentation useful on its own; do not require readers to follow a long chain of links for essential steps.

## Voice and tone

Sound like a knowledgeable, approachable engineer: clear, calm, practical, and respectful.

- Address the reader as “you.” Use “Deployz” when referring to the product.
- Use active voice, present tense, familiar words, and short sentences.
- Use natural contractions when they improve readability.
- Be concise without omitting prerequisites, consequences, or necessary explanations.
- Explain unfamiliar terms and acronyms on first use.
- Avoid hype, sales language, jokes, excessive enthusiasm, and claims of effortless success.
- Avoid “simply,” “just,” “obviously,” and “easy” when describing a task.
- Describe problems neutrally. Explain the next action without blaming the reader.

Examples:

| Avoid | Prefer |
| --- | --- |
| Utilize the following procedure to proceed. | Follow these steps. |
| Simply configure the required settings. | Enter the required values, then save your changes. |
| This powerful feature seamlessly enhances your workflow. | Explain what the reader can do and why it is useful. |
| You entered an invalid value. | Enter a value in the required format. |

## Language and formatting

- Use US English and sentence case for page titles, headings, and navigation labels. Preserve official names and exact UI capitalization, but spell UI labels in US English (see Deployz project rules).
- Use descriptive, specific headings. Prefer action-led titles for procedures.
- Use **bold** for exact UI labels and backticks for commands, paths, filenames, identifiers, and literal values.
- Use numbered lists for ordered steps and bullets for parallel items. Keep each step focused on one action.
- Prefer short paragraphs. Use tables for structured comparisons, not ordinary prose.
- Use descriptive link text; avoid “click here.” Link to the canonical explanation instead of repeating it.
- Use one term per concept. Follow established product terminology and explain unavoidable synonyms.
- Make units, dates, time zones, and placeholders unambiguous where relevant.

## Content structure

Give each page one clear purpose. Choose a structure that fits:

- **Quickstart:** the shortest complete path to a useful result.
- **Guide:** goal, prerequisites, steps, expected result, and relevant next action.
- **Concept:** what something means, why it matters, and how it relates to other concepts.
- **Reference:** precise, consistently organized facts.
- **Troubleshooting:** symptom, checks, likely causes, resolution, and escalation when needed.

Do not force every page into the same template. Avoid duplicate pages, empty sections, repeated introductions, and unnecessary FAQs.

## Accuracy and examples

- Verify factual claims against authoritative, current sources. Never invent behavior, UI labels, commands, or guarantees.
- Flag uncertainty and conflicting sources. Keep unresolved assumptions out of published content.
- Keep examples realistic, internally consistent, and complete enough to follow.
- Clearly mark placeholders and illustrative output. Never include real secrets or private customer information.
- Explain consequential actions before the reader takes them.
- Keep internal implementation details only when they help the reader make a decision or finish the task.

## Presentation and maintenance

- Follow existing Mintlify configuration, metadata, components, navigation, and asset conventions.
- Use built-in components consistently. Reserve callouts for information readers must notice.
- Add diagrams or screenshots only when they explain something more clearly than text.
- Use accessible heading order, descriptive links, alt text, and language-tagged code blocks.
- Preserve published URLs where possible. Maintain redirects and related links when moving content.
- Update affected navigation, examples, and related pages together. Keep one canonical home for each explanation.

## Review before completion

Check that the intended reader can understand the page and take the next action without guessing.

- Review clarity, accuracy, terminology, duplication, and completeness.
- Run available documentation checks and preview affected pages.
- Check links, navigation, rendering, assets, and mobile readability.
- Report changed pages, validation performed, and unresolved questions. Do not claim checks passed unless they ran.

## Deployz project rules

The content plan is in `planning/content-strategy.md`, which `.mintignore` keeps off the published site.

### Source of truth

- The Deployz application code is the source of truth. When the code and the app repository's internal docs disagree, follow the code.
- Verify UI labels, statuses, limits, and prices against the code before you publish them.

### Spelling

- Use US English spelling everywhere, including when you refer to a UI label that the product spells differently. For example, write **Analyze application**, **Re-analyze**, and **Not analyzed**, and write "organization", "behavior", and "canceled".
- Keep the label's wording and capitalization otherwise unchanged.

### Terminology

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

### Page conventions

- Start each procedure by saying who does it: the vendor in the Deployz dashboard, or the customer on the install page or in their AWS console.
- State consequences before the action, especially for rollback, removal, Region, and size choices.
- Mark features at Preview maturity with a Preview label.

### Content boundaries

- Document what vendors and their customers see and do.
- Don't document Deployz-internal operations: Team Admin, control-plane deploys, CI, configuration keys, or test harnesses.
- Don't document internal API routes. Deployz has no public API.
- Don't document the legacy deploy link.
- Keep the customer guide (`customers/*`) vendor-neutral until vendor branding is added.
- Page URLs are linked from the Deployz app. Don't rename or move a page without adding a redirect in `docs.json`.
- Send every "contact support" link to the support form linked in `docs.json`.

### Customer security content

- An AI coding agent checks customer security content against the Deployz code on every relevant app change and before each release. This covers the customer guide's security, before-you-install, and removal pages, and must stay consistent with the in-app text in `apps/web/src/lib/security-details.ts`.
- Verify each claim against its source: `packages/cdk/src/bootstrap/` (IAM permissions and tag conditions), `packages/relay/` (outbound-only connection, data sent to Deployz), the pending-secret code (secret deletion and backup periods), and the removal code (what is retained).
- Report each claim as still true, changed, or can't verify, with the file and line as evidence. Don't publish a changed claim until both the docs and the in-app text are updated.
- Record on each security page the `deployz` commit it was last checked against.
