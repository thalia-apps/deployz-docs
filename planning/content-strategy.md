# Deployz documentation content strategy

Status: draft for review · Prepared 2026-10-20 · Based on the `deployz` monorepo at commit `76a4b779`

This plan covers what the public Deployz documentation site (this Mintlify repository) should contain, who it serves, how it is organized, and how it stays accurate. Editorial rules live in `AGENTS.md`; this document does not repeat them.

## 1. Where things stand

**The docs site is an unedited Mintlify starter.** It has two placeholder pages (`index.mdx`, `quickstart.mdx`). `docs.json` still points the global anchors at Mintlify's own docs and blog, and the navbar links to a `/changelog` page that doesn't exist.

**The product is well documented internally, but not for users.** The app repository has about 8,400 lines of internal docs under `deployz/docs/`. They describe the product as built, were checked against the code on 2026-09-24, and say where the code falls short. They are written for engineers and operators, though. They use internal vocabulary (relay, purge, compiler-v2, `NOT_INSTALLED`) that the UI deliberately hides. These internal docs are the main source material. Treat them as raw input, not as copy to reuse.

**The app has no links to documentation.** `apps/web` links to no docs or help pages, and the deployment page has a **Contact Deployz support** action with no support URL behind it. Nothing in the product sends users to the docs yet. That's an opportunity: failure-code anchors and page URLs are ready for the app to link to.

**There is no public API.** Sign-in uses session cookies only. There are no API keys, no personal access tokens and no OpenAPI spec. The only bearer-token routes belong to the connector. **Don't add an API reference section.** Routes such as `PATCH /api/applications/:id` and bulk deploy exist, but the dashboard uses them internally. Documenting them would create an unsupported public contract.

## 2. What Deployz is, in the reader's terms

Deployz lets a B2B software vendor run its web application inside each customer's own AWS account. The vendor connects a GitHub repository. Deployz analyzes it, builds releases, and gives the vendor an install link for each customer. The customer reviews the plan and its estimated cost, then approves one CloudFormation Quick Create stack in their account. From then on, the vendor operates every customer deployment from one dashboard. Deployz never holds the customer's AWS credentials.

Three properties set the docs' agenda:

1. **It's opinionated.** Deployz supports one architecture: a Dockerfile-built web service on ECS Fargate behind a load balancer, with optional workers, PostgreSQL or MySQL, Valkey/Redis, an S3 bucket, and in Preview, an SQS queue and scheduled jobs. Anything else is rejected at analysis time with evidence. So the docs' main pre-sales job is to tell vendors clearly whether their app fits and what to change if it doesn't.
2. **Two parties act, and only one has an account.** The vendor uses the dashboard. The customer never signs in to Deployz and acts only on public install pages and in their own AWS console. Every procedure has to say who does it.
3. **AWS work happens in someone else's account.** Install failures often come from the customer's account: SCPs, quotas, permissions, Availability Zone capacity. Vendors need material they can forward to their customer's cloud or security team.

## 3. Audiences

| Audience | Who they are | What they need from the docs | Where they arrive from |
| --- | --- | --- | --- |
| **Vendor: evaluator** (primary) | A founder or lead developer at a SaaS company of about 5–20 people. Their customers ask "can this run in our AWS account?" They know Docker and their own stack, but may not know AWS well. | Whether their app fits, what it will cost them and their customers, and the shortest path to a working test deployment. | The marketing site, search, AI assistants |
| **Vendor: operator** | The same person or a teammate, after the first production deployment | Day-2 tasks: deploy, roll back, change configuration, add domains, remove deployments, and recover from failures | Failure panels in the app (once linked), search |
| **Vendor team member** | Someone invited to the organization (Admin or Member role) | What each role can do and how to get started | The invitation email |
| **Customer: approver** (secondary but critical) | The vendor's customer: an IT, cloud or security person who approves the stack | What gets created, what access Deployz has, what it costs, how to revoke access and how to remove it | A link the vendor sends; the install page's **Security details** |

Out of scope for the public site: the Deployz team's operator material. That includes Team Admin, control-plane deploys, CI, configuration keys, Region enablement, test harnesses and billing internals. It stays in the app repository.

## 4. Goals and measures

| Goal | Signal |
| --- | --- |
| Vendors find out whether their app fits **before** they sign up | Traffic to the requirements page; fewer applications ending in **Not compatible** |
| Vendors reach a working test deployment without contacting support | Quickstart completion (Mintlify analytics plus the product funnel in `product-telemetry.md`) |
| Customers approve installs without a long security back-and-forth | Vendors linking the customer guide; fewer support questions about permissions |
| Failures are resolved from the docs | One troubleshooting entry per failure code, linked from the in-app recovery panel |
| Support load stays low | The product's north star: human support minutes per active deployment per month |

Review Mintlify search queries with no results every month. They're the cheapest gap detector you have.

## 5. Information architecture

Use two Mintlify **tabs**. Vendors and customers have different jobs, and the customer pages need a clean, shareable home that has no vendor tasks in it.

### Tab 1: Documentation (vendors)

| Group | Pages (proposed slug · page type) |
| --- | --- |
| **Get started** | `index` What is Deployz (concept) · `how-it-works` How Deployz works: vendor, customer and AWS account (concept, one diagram) · `quickstart` Deploy your first test deployment (quickstart) · `concepts` Applications, releases, deployments and customers (concept) |
| **Prepare your application** | `prepare/requirements` Application requirements (reference: supported architecture) · `prepare/not-supported` What Deployz doesn't support (reference) · `prepare/analysis` Analyze your application and read the results (guide) · `prepare/fix-findings` Fix findings with a coding agent (guide) · `prepare/environment-variables` Configure environment variables (guide) · `prepare/data-services` Databases, cache and file storage (concept) · `prepare/migrations` Database migrations (guide) · `prepare/workers-queues-schedules` Workers, queues and scheduled jobs (concept, queues and schedules marked **Preview**) |
| **Releases** | `releases/create` Create a release (guide) · `releases/build-failures` Fix a failed build (troubleshooting) |
| **Test and share** | `share/test-deployment` Run a test deployment (guide) · `share/install-links` Share an install link (guide) · `share/invitations` Invite a specific customer (guide) · `share/sizes-and-cost` Sizes and AWS cost (concept and reference) · `share/regions` AWS Regions (reference) |
| **Operate deployments** | `operate/deployment-status` Deployment status and health (reference) · `operate/deploy-update` Deploy an update (guide) · `operate/rollback` Roll back a deployment (guide, with the migrations warning) · `operate/restart` Restart a deployment · `operate/configuration` Change a customer's configuration (guide) · `operate/custom-domains` Add a custom domain (guide) · `operate/connector` Reconnect or update the Deployz connector (guide) · `operate/remove` Remove a deployment and delete retained data (guide) |
| **Account** | `account/organization-and-team` Organization, team and roles · `account/github` Connect GitHub · `account/billing` Pricing and billing |
| **Troubleshooting** | `troubleshooting/overview` Troubleshooting hub: a symptom table and stage cards, plus how to read the recovery panel · `reference/failure-codes` Failure codes (one section per code; the URL stays under `reference/`) · a **By stage** group, collapsed by default: `troubleshooting/analysis` · `troubleshooting/install` · `troubleshooting/startup-and-health` · `troubleshooting/connector` · `troubleshooting/https-and-domains`. Issues are sections on stage pages, never menu items, so the menu doesn't grow as issues are added. Split a stage page into sub-pages in the group only when it has more than about 10 issues. |
| **Reference** | `reference/aws-resources` AWS resources Deployz creates · `reference/limits` Limits and fixed settings · `reference/glossary` Glossary |

### Tab 2: Customer guide (customers; vendors link to it)

| Page | Purpose |
| --- | --- |
| `customers/overview` Install an application with Deployz | What's happening, who the vendor is, and what to expect. Sets a neutral tone, since the reader didn't choose Deployz. |
| `customers/before-you-install` | AWS account checks: who can run Quick Create, SCPs, Elastic IP/NAT quotas, Region choice |
| `customers/install` | The steps on the install page and in the AWS console, with progress steps as they're named in the UI |
| `customers/security` | **Security & AWS access**: the connector, IAM scope and permissions boundary, outbound-only design, the data Deployz receives and never receives, secrets handling, how to revoke access. This is the page a security reviewer reads. |
| `customers/costs` | What runs in their account and the estimated monthly AWS cost. Retained resources keep costing money. |
| `customers/custom-domain-dns` | Create the two CNAME records and use **Check now** |
| `customers/remove` | What removal deletes, what remains, and how to delete the connector stack |

The in-product security page (`/install/<id>/security`) is specific to each installation. The docs page is the general, pre-sales version a vendor can send before any link exists. Keep the two consistent by working from the same source (`apps/web/src/lib/security-details.ts`).

### `docs.json` changes

- Replace the Mintlify anchors with real destinations: the dashboard, a status page if there is one, and support.
- Create `changelog.mdx` (Mintlify `Update` components) or remove the navbar link.
- Set the `description` and SEO metadata to describe Deployz, not "Documentation Site for Deployz.dev".
- Exclude `planning/` from publishing (done with `.mintignore`).

## 6. Launch priorities

**P0: needed before public launch.** Chosen as the launch scope with P1 on 2026-10-20. Placeholder pages exist for both.

1. `index`, `how-it-works`, `concepts`
2. `quickstart`: sign up → connect GitHub → add application → review analysis → create release → test deployment → open the app. It should cover the free evaluation path end to end.
3. `prepare/requirements` and `prepare/not-supported`: the fit check
4. `customers/security`, `customers/install`, `customers/before-you-install`, `customers/costs`
5. `account/billing`: what's free, what starts the $49/month platform fee, and when $19/month per live production deployment starts and stops. Payment problems never affect running deployments.
6. `reference/failure-codes` and `troubleshooting/install`, `troubleshooting/startup-and-health`
7. `operate/remove` and `customers/remove`: retained data costs money, so this must be correct at launch.

**P1: the first month after launch.** The rest of Operate, Releases, Test and share, environment variables, migrations, custom domains, connector, the other troubleshooting pages, `reference/aws-resources`, the glossary.

**P2: when there's demand.** Framework guides that have been verified on real AWS. The detectors recognize Node (Nest, Express, Fastify, Next, Nuxt, Koa, Hapi, Restify), Python, Ruby, Go, JVM, .NET, PHP, Elixir and Rust, but "recognized" doesn't mean "documented as supported". Write a guide only after it has been deployed for real, starting with whatever the evaluation funnel shows vendors bring. P2 also covers a "send this to your customer" email template and a security questionnaire pack.

## 7. Content principles specific to Deployz

These add to `AGENTS.md`.

1. **Say who acts.** Start every procedure with a role line, such as "**Who:** the vendor, in the dashboard" or "**Who:** your customer, in their AWS console". Many problems come from the wrong party trying an action. For example, customers can't redeploy or remove anything in Deployz.
2. **Lead with fit.** Put the requirements and the not-supported list near the top of navigation, and say plainly what isn't supported. That matches the product's own principle: "we don't support that" beats "we can probably make that work".
3. **Use product language, not infrastructure language.** The UI hides CloudFormation and ECS states on purpose. Use AWS service names only where the reader needs them: the customer guide, the AWS resources reference, and IAM.
4. **Name consequences before the action.** This matters most for these: rollback doesn't reverse database migrations; removal keeps the database, its credentials and the bucket, which keep costing money; a deployment's Region and size can't be changed later; adding a database, cache, worker, queue or schedule needs a new deployment.
5. **Mark Preview features.** Show SQS queues and scheduled jobs with a Preview badge until they're qualified on real AWS.
6. **Publish the Region list, and keep it in step with the product.** Decided: `share/regions` and `customers/before-you-install` list all 17 supported Regions by display name and code, for example "US East (N. Virginia) · `us-east-1`". The full list is: US East (N. Virginia), US East (Ohio), US West (N. California), US West (Oregon), Canada (Central), South America (São Paulo), Europe (Ireland), Europe (London), Europe (Paris), Europe (Frankfurt), Europe (Stockholm), Asia Pacific (Tokyo), Asia Pacific (Seoul), Asia Pacific (Osaka), Asia Pacific (Mumbai), Asia Pacific (Singapore), Asia Pacific (Sydney). The code source is `SUPPORTED_AWS_REGIONS` in `packages/contracts/src/regions.ts`. Production installs are limited by the `DEPLOYABLE_AWS_REGIONS` operator setting, so any change to that setting needs a docs update and a Changelog entry.
7. **Write for a public, pre-launch site.** Decided: the docs go public before launch. Publish prices, limits, and Preview labels as they are now. Leave out roadmap promises and dates. When a feature is missing, say it isn't supported, not that it's coming soon.

## 8. Terminology

Take terms from the product's UX guidelines (`deployz/docs/product/ux-guidelines.md` §10) and from the labels in the UI.

| Use | Don't use |
| --- | --- |
| application | app (as a noun in headings), product |
| release (version is its label) | build, image (as a noun) |
| deployment; *install* for the first deployment | installation, environment |
| test deployment | test install |
| install link | deploy link, installation link |
| invitation, invite a customer | create installation |
| Deployz connector | relay, bootstrap stack (name the CloudFormation stack only where the reader works in the AWS console) |
| remove a deployment | disconnect, uninstall |
| delete retained data | purge |
| Needs input · Needs attention · Failed | issue, problem, error (as a status) |
| organization, owner, admin, member | workspace, team (except the **Team** nav item) |

**Spelling: decided.** Use US spelling everywhere, including UI labels the product spells the British way. For example, the UI's **Analyse application**, **Re-analyse** and **Not analysed** become **Analyze application**, **Re-analyze** and **Not analyzed** in the docs. The rule is in `AGENTS.md`. Ask the product team to move the UI to US spelling too, so that labels match exactly.

**Two status vocabularies.** The deployments list and customer views show grouped labels (Waiting for customer, Setting up, Live, Install failed, Needs attention · reason). The canonical deployment states are Not installed, Waiting for AWS, Installing, Healthy, Updating, Update available, Failed, Disconnected, Deleting and Deleted. `operate/deployment-status` should document what the reader sees on each screen and map the two sets, not invent a third.

## 9. Sources of truth and maintenance

| Docs area | Authoritative source in `deployz` |
| --- | --- |
| Scope, supported architecture, non-goals | `docs/product/mvp-scope.md` |
| Journeys, who configures what | `docs/product/user-flows.md` (check labels against `apps/web`, see section 10) |
| Labels and statuses | `apps/web/src`, `apps/web/src/lib/deployment-vocabulary.ts`, `packages/copy-map` |
| Failure codes, recoverability, remediation text | `packages/copy-map/src/index.ts`, `docs/operations/troubleshooting.md` |
| Analysis findings | `packages/analysis/src/rejection.ts`, `readiness-report.ts`, `docs/ai-analysis.md` |
| Environment variables | `docs/environment-variables.md` |
| Sizes and cost estimates | `packages/contracts/src/profile.ts`, `pricing.ts`, `docs/infrastructure-profiles.md` |
| Networking, HTTPS, domains | `docs/networking-and-https.md` |
| Customer security content | `apps/web/src/lib/security-details.ts`, `packages/cdk/src/bootstrap/bootstrap-stack.ts` |
| Pricing and billing | `docs/billing/paddle-billing.md`, `apps/web` billing and pricing pages |

Maintenance rules:

- **Tie the docs to code changes.** When a pull request in `deployz` changes `packages/copy-map`, `packages/contracts` (pricing, profiles, Regions), `security-details.ts`, the bootstrap stack or the billing pages, it needs a matching docs update. Add it to the app repository's PR checklist, or have `scripts/test-affected.mjs` flag those paths.
- **Give each failure code a stable anchor** (`/reference/failure-codes#missing_secret`). Then the in-app recovery panel and **Contact Deployz support** can link to the exact entry, so the docs get traffic at the moment a vendor needs them.
- **Use the Changelog for anything a user would notice**: new Regions, features leaving Preview, pricing changes, removed flows such as the legacy deploy link.
- **An AI coding agent checks the customer security content.** Decided 2026-10-20. The content in question is `customers/security`, the security parts of `customers/before-you-install` and `customers/remove`, and the in-app page text in `apps/web/src/lib/security-details.ts`.
  - **When it runs:** on every `deployz` pull request that changes `packages/cdk/src/bootstrap/`, `packages/relay/`, `apps/web/src/lib/security-details.ts` or the pending-secret code, and once before each release.
  - **What it checks:** each claim against the code. That means the IAM actions and their tag conditions, the outbound-only design, the data the connector sends, the secret deletion and backup periods, how to revoke access, and what removal keeps.
  - **Output:** a pull request comment listing each claim as *still true*, *changed* or *can't verify*, with the file and line as evidence, plus the suggested text change. A *changed* claim blocks the release until the docs and the in-app text are updated.
  - **Record:** each security page notes the `deployz` commit it was last checked against.
  - **Setup:** keep the list of claims with their source files in the docs repo (for example `planning/security-claims.md`), so the agent checks a fixed list instead of rereading everything.
- **Review the P0 pages every quarter** against the code, and record the commit you verified against in a comment at the top of each page.

## 10. Where the code and the internal docs disagree

These came up while reading the code. **Decided: follow the code in every case.** The docs describe what the code does, and the internal docs in `deployz/docs/` should be corrected to match. Each item below shows what the docs will say.

1. **Failure-code count.** `packages/copy-map` defines 25 codes. `troubleshooting.md` says 24, and a code comment says "twenty". Some failures sit outside the 25: `DEFAULT_DNS_TIMEOUT`, `RELAY_CREDENTIAL_MISMATCH`, Quick Create `AlreadyExists`, build failures (which have summaries instead of codes) and billing `402`. The reference page needs to cover those too.
2. **Sign-up methods.** `user-flows.md` says email and password "or GitHub OAuth". The sign-up page offers email and password only.
3. **"Copy prompt for coding agent".** `user-flows.md` places it on analysis readiness. In the code it appears on release build failures, and the related dialog elsewhere is titled "Fix deployment issues with your coding agent". The docs document it on failed builds, as the code has it. `prepare/fix-findings` covers the "Fix deployment issues with your coding agent" dialog only after its trigger has been checked in the code.
4. **"Create installation" on customer detail.** It doesn't exist. The page has **Invite customer** only.
5. **Release infrastructure line.** Resolved: the text "No infrastructure changes" is now in `packages/copy-map`.
6. **Home vs Overview.** The sidebar says **Home** and the page heading says **Overview**. Pick one name for the docs, preferably the sidebar label for navigation steps.
7. **Support destination.** **Contact Deployz support** has no URL in the app. Decided: the HubSpot form is the support channel everywhere (section 11).
8. **Pricing wording.** `mvp-scope.md` says the $49/month fee starts with the first *production* deployment. `paddle-billing.md` says it starts with the first *customer* deployment. The billing page says what starts billing. Use that wording.

**Update 2026-10-21.** `deployz` #574 removed the release migration command field, changed the billing wording to "The platform fee starts when you subscribe", and aligned failure fix text and refusal messages with the UI (item 8 is resolved). #575 added a required permissions boundary on application IAM roles, and the customer security pages were rechecked against commit `0b77379c`. #573 changed analysis to one deployability outcome per repository.

## 11. Decisions on the open questions

All answered on 2026-10-20.

| Question | Decision | Effect on the docs |
| --- | --- | --- |
| Region list | All 17 supported Regions | Listed on `share/regions` and `customers/before-you-install` |
| Public before launch? | Yes | Section 7, item 7 |
| Security content review | An AI coding agent checks it | Section 9 |
| Support channel | The HubSpot form: `https://share.hsforms.com/1dOsn_DJtRhq47DXIaRjeLw5auur` | Every "contact support" link in the docs points here. Ask the product team to use it for **Contact Deployz support** in the app. |
| Will the app link to the docs? | Yes. The docs home is `https://deployz.dev/docs`. | The slugs in section 5 are frozen. Changing one needs a redirect in `docs.json`. The `/docs` subpath is set up in the Mintlify dashboard and on the host serving `deployz.dev` (reverse proxy), not in this repository. |
| Legacy deploy link | Leave it out | Not documented anywhere |
| Customer guide branding | Neutral for now; vendor branding comes later | Write the customer guide vendor-neutral, and say "your software provider" (see `AGENTS.md`) |

## 12. Next steps

1. Agree on this plan and the answers to sections 10 and 11.
2. ~~Update `docs.json` (tabs, groups, anchors, changelog, metadata) and add placeholder pages.~~ Done 2026-10-20 for the 40 P0 and P1 pages. The remaining section 5 pages (`prepare/analysis`, `prepare/fix-findings`, `prepare/data-services`, `prepare/workers-queues-schedules`, `account/organization-and-team`, `account/github`, `reference/limits`) get added when they are scheduled.
3. Write the P0 pages in the order in section 6, verifying each against the code, and preview with `mint dev` and `mint broken-links`.
4. Add the docs-impact check to the `deployz` PR process.
