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

- Use US English and sentence case for page titles, headings, and navigation labels. Preserve official names and exact UI capitalization.
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

