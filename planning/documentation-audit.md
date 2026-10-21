# Documentation audit: issues list

Status: docs items resolved · Audited 2026-10-21 · Docs at `c78bd5e` · Code at `deployz` `origin/main` `0b77379c` (#575)

> **Update, 2026-10-21.** All high-priority items (H1–H16) are fixed in the docs, and so are the medium and low items. Most were fixed in the app as well, by `deployz` #576–#582. The docs were rechecked against `deployz` `0c21c52e`. The seven missing pages in section 4 now exist. The product issues in section 5 that remain open are still open in the app; the docs describe current behavior for each of them.

`.mintignore` keeps this file off the published site, along with the rest of `planning/`.

## How the audit ran

1. **Seven parallel reviews.** Six reviews covered the page groups:
   - Get started (with the glossary, changelog and `docs.json`)
   - Prepare and Releases
   - Share and Account
   - Operate
   - Troubleshooting and failure codes
   - Customer guide and AWS resources

   The seventh ran checks across every page.
2. **Section-by-section checks.** Each review checked every section of its pages for:
   - Accuracy against the code, with `file:line` evidence.
   - Gaps: behavior the code has that the page doesn't cover.
   - The `AGENTS.md` guidelines.
   - Improvements: clarity, duplication and links.
3. **Special checks:**
   - A full comparison of failure codes against the docs.
   - Verification of each security claim against `packages/cdk/src/bootstrap/`, `packages/relay/`, the pending-secret code, the removal code and `security-details.ts`.
   - A search for links from the app into the docs.
   - A terminology and spelling lint.
   - Mintlify validation.
4. **Code version.** The code was read from `origin/main`. The local `deployz` checkout is three commits behind, at `76a4b779`, before #573–#575. Pull it before any follow-up check.

### Validation results

- `npx mint broken-links`: no broken links found.
- `npx mint validate`: build validation passed.
- A script checked all 278 internal links and all 37 anchor targets. All resolve.
- All 25 failure codes in the code have a section on `reference/failure-codes`, and the docs list no code that doesn't exist.
- No banned words (simply, just, obviously, easy) and no UK spellings.
- Every page has a title and description in sentence case. No heading levels are skipped.
- The app has no links to the docs yet, so no in-app link is broken. **Contact Deployz support** is plain text in the app, not a link.

Severity: **High** means a reader is misled into a wrong action, or a security or billing claim is wrong. **Medium** means a material inaccuracy or gap. **Low** means polish.

---

## 1. High-priority issues

| # | Page › section | Issue | Evidence |
| --- | --- | --- | --- |
| H1 | `customers/security` › Exceptions to tag scoping | The list of permissions that aren't tied to the deployment is incomplete. It's missing write actions on `Resource: *`:<br>• Connector: `ecs:RunTask`/`StopTask`/`DeregisterTaskDefinition`, and `s3:DeleteObject`/`DeleteBucket` on any bucket. Only a check in the connector code protects other buckets.<br>• Execution role: `logs:DeleteLogGroup`, ElastiCache replication-group create, modify and delete, and `iam:CreateServiceLinkedRole`.<br>The in-app text has the same gap. | `bootstrap-stack.ts:345-370,596-608,1089-1094,1186-1220,1461-1466,1636-1646` |
| H2 | `customers/security` › Queues, schedules, `PassRole` | "Limited … to this deployment's application stack" is wrong. The patterns are `deployz-app*`, `DeployzApp*` and `role/deployz/*`, scoped to the whole account and Region. Several deployments can share an account and Region. `PassRole` also allows legacy `role/deployz-app-*`, plus passing roles to CloudFormation and to Scheduler. | `bootstrap-stack.ts:884-894,1231-1252,1472,1523-1547,1618-1630,629-632` |
| H3 | `customers/security` › No inbound access / Data Deployz never receives | The page doesn't say that traffic to the default `d-<id>.deployz.dev` address is proxied through Deployz's Cloudflare zone, where TLS ends. `customers/install` mentions it; the security page and `security-details.ts` don't. Traffic to a custom domain goes directly to the load balancer. | `apps/api/src/cloudflare-records.ts:21,599-600`; `default-https.ts:1-10` |
| H4 | `share/invitations` › Check an invitation's status, **Revoked** row | The dashboard has no way to revoke an invitation; only the API supports it. A leaked invitation stays usable until it's used or expires. | `dashboard/customers/[id]/page.tsx:267-317`; `public-install.ts:1065-1095` |
| H5 | `share/test-deployment`, `share/install-links`, `share/invitations` | A deployment's own install link expires 30 days after the deployment is created, and this isn't documented. **Issue new install link** doesn't extend the expiry, and the dashboard has no control that rotates the link. | `deploy-links.ts:283-286`; `server.ts:2922-2941,6586-6612` |
| H6 | `account/billing` › When a deployment's charge starts and stops | "Counts only while it's live" implies billing pauses when a deployment fails or disconnects. It doesn't: after the first time the deployment is ready, only an accepted removal stops billing. | `billing-domain.ts:30-64` |
| H7 | `quickstart` › Next step | The page sends readers to create an install link, but doesn't say customers can't confirm an install until the organization has an active subscription. The confirm request fails with HTTP 402 `SUBSCRIPTION_REQUIRED`. | `billing-entitlements.ts:25-42`; `public-install.ts:410-421,512` |
| H8 | `concepts` › Application | "Changes here are the defaults for new deployments" is wrong. Runtime variables reach running customer deployments within minutes. Build values apply to new builds. Size presets apply to new links and new deployments. | `environment-variables-section.tsx:831`; `deployment-size.tsx:231` |
| H9 | `prepare/migrations` › Migrations and releases | "Every deployment runs the command from the application's setting" is wrong. An existing deployment keeps the command it was created with unless the vendor sets one explicitly. A re-analysis doesn't reach it, and **Reset to detected** returns to the original command. | `server.ts:1070-1096` (`migrationPolicyFor`, `mode: 'frozen'`) |
| H10 | `prepare/not-supported` › Changing what a deployment contains | It says the port, health check path and migration command don't need a new deployment. The port and health check dialog says "Existing deployments are not modified". A migration command can't be added to a deployment created without one. | `readiness-components.tsx:166`; `server.ts:1088-1093` |
| H11 | `prepare/environment-variables` › Build or runtime | Build values reach the build only as `--build-arg NAME`. The Dockerfile must declare `ARG NAME`; otherwise the value is silently missing. This isn't documented anywhere. | `packages/cdk/src/pipeline/build-pipeline.ts:224-230` |
| H12 | `operate/deploy-update` › What happens during an update | "A migration that already succeeded doesn't run again on retry" is wrong. **Retry update** creates a new job, so a migration that succeeded before a failed rollout runs again. | `server.ts:1023-1041,1223-1253` |
| H13 | `operate/connector` › You issue a new install link | "The new link replaces the old one and the old link stops working" is wrong. The address never changes; the connection code, the credential and the stack name change behind it. The in-app text "A new link invalidates the old one" has the same problem. | `server.ts:6560-6612,6639`; `deployments/[id]/page.tsx:2179` |
| H14 | `reference/failure-codes`, `troubleshooting/startup-and-health`, `troubleshooting/install` | After a failed first install with a code the docs say "can recover on its own" (`DATABASE_CONNECTION_FAILED`, `UNKNOWN`, `RELAY_DISCONNECTED`, `RDS_UNAVAILABLE`, `REDIS_CONNECTION_FAILED`), the docs tell readers to "deploy again", **Retry deployment** or reload. None of these is possible:<br>• The app shows "Check again" as plain text, not a button.<br>• **Deploy update** requires a previous successful run.<br>• Nothing re-runs the failed job. | `retry-eligibility.ts:64-72`; `deployments/[id]/page.tsx:1019-1031` |
| H15 | `troubleshooting/startup-and-health` › The application fails to reach its database | "`RDS_UNAVAILABLE` … often clears on its own" describes a code nothing in the code ever raises. | No producer in relay, API classifier or watchdog |
| H16 | Site config: `AGENTS.md` | `.mintignore` doesn't exclude `AGENTS.md`, and Mintlify serves pages that aren't in the navigation. So `/AGENTS` is probably public and exposes the internal process and code paths. Can't verify without a preview. | `.mintignore` |

---

## 2. Issues by page

Each row is tagged **Acc** (accuracy), **Gap**, **Guide** (guideline) or **Imp** (improvement or link).

### Get started

**`index.mdx`**
- Low · Acc — The limit is "one test deployment at a time", not "one test deployment of each application" (`billing-entitlements.ts:44-77`).
- Low · Guide — Queues and scheduled jobs are called Preview in prose only; use the standard Preview label.
- Low · Guide — "Supports one architecture well" is mildly promotional.

**`how-it-works.mdx`**
- Medium · Gap — The **What runs where** table omits that Deployz stores configuration values, and secrets until they're delivered (`public-install.ts:423-428`). Link to `customers/security`.
- Medium · Gap — Step 5 skips what the customer does on the install page before AWS: choose a Region and size, fill in **Your details** and settings, then **Continue to setup**. A subscription is also required.
- Low · Acc — "Limited to Deployz resources" and "the only part of Deployz that calls AWS" both overstate: read, log and verification actions use `*`, and CloudFormation acts through the execution role.
- Low · Imp — The diagram puts the GitHub repository inside the vendor dashboard and has no text alternative. "Container images" is used as a noun.

**`concepts.mdx`**
- High: H8.
- Medium · Acc — "A deployment owns its own configuration" is wrong. Overrides are stored per customer and application, and apply to all of that customer's deployments of the application, including a test deployment (`server.ts:3488-3508`; `config.ts:315-319`).
- Medium · Gap — Invitation: the 30-day expiry is missing, and revocation is described even though there's no UI for it (H4).
- Medium · Gap — Organization and roles: any member can manage billing, remove deployments and add domains, because these routes have no role check. Users can belong to several organizations. "Admins can change members' roles and remove members" is wrong for other admins; only the owner can (`organizations.ts:620-621,688-689`).
- Low · Gap — Install link: the customer enters their name and email. Links can also be disabled, regenerated and revoked.
- Low · Acc — Test deployment: **Create install link** goes away if you remove the passed test deployment before any customer deployment exists. Invitations aren't gated on a test deployment at all.
- Low · Acc — Tab order is **Overview**, **Releases**, **Configuration**. **Re-analyze application** and **Remove application** are under **Configuration** › **Settings**.
- Low · Gap — A release can later become **Unavailable**.

**`quickstart.mdx`**
- High: H7.
- Medium · Gap — Warn before the reader removes the test deployment: doing so before creating an install link makes the link unavailable again (`application-state.ts:190-196,795-806`).
- Medium · Gap — Deployment checks block the test deployment when a required customer-provided variable has no value ("Missing: …"). The page doesn't say what to do.
- Medium · Imp — A release isn't required first: the test deployment page offers **Build release from commit …**. The page doesn't cover the **Building a release** and **No release to test** states.
- Low · Acc — Exact field labels: **Customer name**, **Customer email**, **Company (optional)**, **Application**. Only sizes at or above the minimum are offered.
- Low · Gap — Sign-up accepts the Terms of Service and Privacy Policy; say so before the action.
- Low · Acc — The progress steps include **Run migrations**. The badge shows **Testing** before AWS connects.

**`reference/glossary.mdx`**
- Medium · Acc — Retained data and Remove a deployment don't match `DELETION_STEPS`:
  - Removal deletes "most of" the networking, not all of it.
  - Application secrets and certificates are retained too.
  - **Delete retained data** needs the connector online.
- Medium · Imp — The Install link entry mixes the reusable link with a deployment's own link, and omits the expiry.
- Medium · Gap — Missing terms:
  - Deployment and application status labels: **Live**, **Waiting for customer**, **Setting up**, **Update available**, **Ready to test**, **Ready to share**, **Analysis failed**, **Lost contact**, and others.
  - Product terms: install page, update, rollback, connector stack, application stack, customer override, health check, installation ID, permissions boundary, Quick Create, worker, size presets and default address.
- Low · Acc — **Deployment details** should be **Technical details** on the review step (`technical-details.tsx:14`).
- Low · Acc — Preview isn't a label in the dashboard. Customer is "a company or person" in `concepts`. The Deployment entry excludes test deployments.
- Low · Imp — Recovery panel is a docs-only term. The failure code example should link to `#missing_secret`. Organization should link to `/concepts#organization-and-roles`.

**`changelog.mdx`**
- Medium · Gap — The page has no entries, although user-visible changes have shipped: #573, #574 (billing wording), and #575 (customers must update the connector stack). The "first entries will appear when Deployz launches" note is close to a roadmap promise.

**`docs.json` and repository**
- Medium: H16.
- Low · Imp — Dashboard and Support appear both as global anchors and in the navbar.
- Low · Imp — Mintlify starter leftovers: `logo/*.svg`, `favicon.svg`, and the `README.md` text. No SEO or `og:image` metadata.
- Low · Imp — Check dark-mode contrast of `colors.dark: #111111` in a preview.

### Prepare your application

**`prepare/requirements.mdx`**
- Medium · Gap — The page doesn't explain how Deployz builds: `docker build` with the Dockerfile's directory as context, on linux/amd64, optionally targeting a multi-stage stage (`build-pipeline.ts:222,233`).
- Medium · Gap — Queue detection reads only JavaScript and TypeScript (`async-detection.ts:8-13`). State the limit.
- Medium · Imp — The three-result table duplicates the one in `troubleshooting/analysis`.
- Low · Acc — "One SQS Standard queue": analysis can create several queues, and several scheduled jobs.
- Low · Gap — The removal warning omits that queues and their messages are deleted on removal.
- Low · Acc — "Set the start command in Deployz": the dashboard has no field for it; it's API only. `troubleshooting/analysis` says the same.
- Low · Acc — Health checks also accept `400` when the app checks the Host header. The default path is `/health`.
- Low · Acc — Workers: Deployz recommends declaring the command in the repository. It doesn't "ask".

**`prepare/not-supported.mdx`**
- High: H10.
- Medium · Acc — "Listed under **Not supported** only when clearly needed, otherwise **Change in your repository**": the downgrade applies only to SQLite next to a PostgreSQL or MySQL driver (`readiness-report.ts:418-428`).
- Medium · Acc — **Get fix instructions** is on rows in **Configuration** › **Resources**, not on the **Overview** item.
- Low · Gap — A localhost-only binding (`localhost-binding`) is missing from the repository-change table.
- Low · Imp — Name the actual detected examples (ParadeDB, TimescaleDB, Citus, HSQLDB, Derby) and the fuller sample-folder list.
- Low · Guide — The procedure has no **Who:** line. Headings contain apostrophes.

**`prepare/environment-variables.mdx`**
- High: H11.
- Medium · Acc — The action is **Review required changes**, not **Review configuration**, and it appears only before any customer deployments exist (`application-state.ts:673-683`).
- Medium · Gap — No page lists the variables Deployz always sets:
  - `NODE_ENV=production` (forced) and `PORT`
  - `APP_API_KEY` and `APP_SIGNING_SECRET`
  - `DATABASE_*`, `MYSQL_*`, `PGSSLROOTCERT`, `NODE_EXTRA_CA_CERTS`
  - Bucket aliases, `AWS_REGION`, `REDIS_*`, `QUEUE_URL` and `QUEUE_ARN`

  A vendor value with the same name replaces the managed one (`compile.ts:768-830`).
- Low · Gap — Build stage is also suggested for Dockerfile `ARG`s. The prefix list is longer: it also includes `NUXT_PUBLIC_`, `EXPO_PUBLIC_`, `GATSBY_` and `PUBLIC_`.
- Low · Gap — Explain the default suggestion rules (`environment-setup.ts:225-241`).
- Low · Gap — Secrets are limited to 4,096 bytes.
- Low · Guide — The page says "brackets", but the table uses parentheses. Missing **Who:** lines.

**`prepare/migrations.mdx`**
- High: H9.
- Medium · Gap — Deployz detects a separate migration command only from Node `package.json` scripts. Django, Rails and Laravel need the command entered, for example `python manage.py migrate`.
- Medium · Gap — The migration tool must be installed in the final image. Dev-only CLIs, monorepo runners and `../` paths are rejected (`detectors.ts:2962-2973,3096-3108`).
- Low · Acc — **Reset to detected** appears only after an override. A deploy without a migration step is refused with HTTP 409; it isn't a failed deploy.
- Low · Acc — When the AI raised the migration doubt, the finding is grouped under **Change in your repository**.
- Low · Imp — Deep-link to `#migration_failed` and the startup troubleshooting section.

### Releases

**`releases/create.mdx`**
- Medium · Acc — The "Infrastructure requirements changed" notice checks only the first deployment. It also fires when a database or cache was dropped, even though that deploy is allowed (`releases/page.tsx:302`; `plan.ts:174-184`).
- Medium · Gap — The first release can be built from the test deployment page. That release's version is a 12-character SHA, so the next suggested version is blank.
- Low · Acc — "Analysis has finished" isn't enforced.
- Low · Gap — The page doesn't mention the "This commit doesn't exist" error. Build limits aren't stated: 60-minute timeout, linux/amd64, and registry rate-limit retries.

**`releases/build-failures.mdx`**
- Medium · Acc — **Explain with AI** always shows; only the coding-agent prompt is swapped for **Copy report for Deployz support** (`release-failure-details.tsx:205-254`).
- Low · Imp — Log excerpt: the last 3,000 lines, with lines capped at 500 characters. Registry rate limits are retried automatically. The missing-commit (404) row isn't covered.
- Low · Guide — Two plain-text "contact support" mentions have no link.

### Test and share

**`share/test-deployment.mdx`**
- High: H5.
- Medium · Gap — Removing a passed test deployment before you have customers takes away **Create install link**.
- Medium · Acc — Deployment checks run when the application is selected, not after **Run free test deployment**.
- Low · Gap — **Build release from commit**; the link is still on the deployment page after you close the dialog; using your own details creates a customer record; the "already has a test deployment" message.

**`share/install-links.mdx`**
- Medium · Gap — **Regenerate** always re-enables a disabled link (`public-install.ts:1119-1124`).
- Medium · Gap — After confirming, the customer continues on the deployment's own link, which expires (H5).
- Low · Acc — Regenerating raises the recommended size to the current minimum. The text the customer sees for a revoked link isn't described. **Copy install link** is disabled while the link is disabled. The Overview shows a **Customer install link** card once customers exist.
- Low · Gap — Confirming also checks for a published release, the required values, and that the plan hasn't changed (`PLAN_CHANGED`). Each confirmation creates a new customer record, even when the email matches an existing customer, so repeat installs create duplicates (`public-install.ts:541-560`). Invitations don't count toward the one-link limit.

**`share/invitations.mdx`**
- High: H4.
- Medium · Gap — No "Before you start" section: the **Invite customer** page needs a built release, but the dialog on the customer page doesn't check for one. Invitations don't need a test deployment.
- Low · Acc/Guide — The customer-page dialog shows a separate **One-time token** field. **Send the invitation** has no **Who:** line. A recommended Region is dropped if it later becomes unavailable.

**`share/sizes-and-cost.mdx`**
- Medium · Gap — Queues and schedules (Preview) aren't priced. The page doesn't explain "+ usage", "Some resources could not be priced" or "Estimate unavailable".
- Low · Gap — Resources the estimate never prices: CloudWatch Logs, Secrets Manager, the NAT Elastic IP, public IPv4, and the connector stack.
- Low · Guide — The heading says "recommended", but the UI says **Default size**. One term per concept.
- Low · Imp — Explain the rounding: each item to whole dollars, the total to $5 steps.
- Low · Guide — "availability zones" should be capitalized.

**`share/regions.mdx`**
- Medium · Acc (can't verify) — The page says "Deployz supports these 17 Regions", but installs need `DEPLOYABLE_AWS_REGIONS`, which defaults to `us-east-1`. The bootstrap template is published only in `us-east-1`. Confirm the production list; the caveat is buried below the table. The same applies to `customers/before-you-install`.

### Account

**`account/billing.mdx`**
- High: H6.
- Medium · Acc — "Or when you add your first customer deployment": the only checkout entry point is **Start subscription** on **Invite customer**.
- Low · Acc — Count changes are prorated and charged right away (`prorated_immediately`), and may lag because a background job reconciles them.
- Low · Acc — For a canceled subscription, the page still shows **Current charges** with a **Canceled** badge, and an app-wide banner appears.
- Low · Gap — Any member can manage billing; there's no role check.

### Operate deployments

**`operate/deployment-status.mdx`**
- Medium · Acc — **Needs attention · Disconnected** can't appear: nothing sets that state (`deployment-status.ts:1183-1188`).
- Medium · Acc — The default **All statuses** view hides removed deployments; they don't "sort last". The **Live** filter includes deployments with **Update available**.
- Medium · Acc — **Applying configuration** never appears, because a configuration change doesn't set Updating; the badge stays **Live**.
- Medium · Gap — The 30-minute verification window, which produces **Application couldn't start**.
- Medium · Gap — The **Retry HTTPS setup** button on **Secure endpoint**.
- Low · Acc/Gap — Health checks apply to the public web service only. "Verifying…" also shows during updates. Missing: the **Not started** next step, the **Unknown** and **Removing** part statuses, and the extra headline variants. The info button is hidden on narrow screens.

**`operate/deploy-update.mdx`**
- High: H12.
- Medium · Guide — The migration warning comes after the steps; it should come before them.
- Low · Imp — **Retry update** opens the release picker again.

**`operate/rollback.mdx`**
- Low · Gap — Rollback is refused if the previous release's build is unavailable.
- Low · Link — The link text "When you can't deploy an update" doesn't match its target, and the link has no anchor. It should point to `#when-an-update-is-unavailable`.

**`operate/restart.mdx`**
- Low · Acc — A restart also waits for load balancer health checks.
- Low · Link — Add the `#when-an-update-is-unavailable` anchor.

**`operate/configuration.mdx`**
- Medium · Acc — Overrides apply to every deployment of the application for that customer, not just one.
- Medium · Acc — "A failed update leaves the previous configuration running" isn't true for secrets: new secret values are already written to AWS and aren't rolled back.
- Low · Link — Add the `#changes-that-need-a-new-deployment` anchor.

**`operate/custom-domains.mdx`**
- Low · Acc — **Check now** shows only while waiting, connecting or removing, and is limited to once every 30 seconds. **Connecting** means Deployz is checking that HTTPS works.
- Low · Gap — "This deployment isn't running" pauses checks.
- Low · Guide — The remove consequences come after the steps.

**`operate/connector.mdx`**
- High: H13.
- Medium · Gap — "Update the existing connector stack" when the connector is offline gives no values. For an installed deployment, the dashboard can't issue new connector values.
- Low · Acc — The **Install link** card is shown only before install. The **Connector update available** button works only for the customer.

**`operate/remove.mdx`**
- Medium · Gap/Acc — "Removal stays available while the connector is offline" is true only after the connector has connected at least once. A **Waiting for customer** deployment can't be removed from the menu (`page.tsx:968-969`).
- Low · Gap — Missing: the cache is deleted, and support can force-complete a removal.
- Low · Acc — The status labels describe the plan, not live progress. **Delete retained data** deletes the database credentials, not "the application secrets".
- Low · Guide — The table lists the connector stack under retained data, but line 86 says it's never deleted. Move it to a note.

### Troubleshooting

**`reference/failure-codes.mdx`**
- High: H14.
- Medium · Acc — The in-app **How to fix it** text for `AWS_SCP_BLOCKED`, `AWS_PERMISSION_DENIED`, `STACK_CREATE_FAILED`, `RDS_AZ_CAPACITY` and `DATABASE_CREATE_FAILED` says "run the install link again". The docs say **Retry deployment**, which matches the button. Fix the app text (`copy-map/src/index.ts:598,643,648,658,663`).
- Medium · Gap — "Failures without a code" doesn't list the connector credential mismatch or Quick Create `AlreadyExists`.
- Low · Acc — No code raises `RDS_UNAVAILABLE`, `REDIS_CONNECTION_FAILED` or `UNSUPPORTED_ARCHITECTURE`. Mark them as rarely or not currently reported.
- Low · Acc — `QUOTA_EXCEEDED` also covers AWS throttling.
- Low · Guide — "The image must be made available again" uses "image" as a noun. The "Contact support" wording varies, and one mention has no link.
- Low · Imp — Deep-link each code to its stage-page section. Remove the duplicate recoverability table; the canonical one is in `troubleshooting/overview#who-needs-to-act`.

**`troubleshooting/overview.mdx`**
- Medium · Guide — The symptom table has no row for 11 sections:
  - analysis: taking longer than usual
  - install: connector lacks permission; AWS limit; database creation failed; cache setup failed; rolled back; Region unavailable
  - startup: wrong port; cache unreachable
  - connector: never connects after a new link
  - domains: domain update timed out
- Medium · Gap — The recovery panel step omits **Rollback failed**, **Restart failed** and **Configuration update failed** (`deployment-hero.ts:140-160`).
- Low · Gap — The list labels **Setting up · Slow to connect**, **Your application is not started** and **Test failed** have no rows.
- Low · Link — The "says the connector is disconnected" row should point to the connector section. **Removal failed** should point to `/operate/remove#if-removal-fails`. The database-or-cache row needs the cache link.
- Low · Acc — **Application couldn't start** covers six codes, not one. AI explanations also cover `UNKNOWN`. **Check again** and **Contact Deployz support** are text, not buttons.

**`troubleshooting/install.mdx`**
- Medium · Acc — For `RDS_AZ_CAPACITY`, `ECS_DEPLOYMENT_FAILED` and `STACK_DELETE_FAILED`, the docs say the customer has nothing to change. Their install page tells them something in the account must change (`deployment-status.ts:1558`).
- Medium · Acc — The **Check again** row ("wait, then reload") leads nowhere on a first install (H14).
- Low · Guide/Imp — Missing **Who:** lines. Name the failure code shown when the template predates the role boundary.

**`troubleshooting/startup-and-health.mdx`**
- High: H14, H15.
- Low · Guide — "The release image must include `sh`" uses "image" as a noun.
- Low · Acc — The database CA bundle is downloaded when the task starts, and the task still starts if the download fails.

**`troubleshooting/https-and-domains.mdx`**
- Medium · Acc — `DOMAIN_OPERATION_TIMEOUT` never fails the deployment. The domain card shows the generic "We couldn't connect this domain" (`worker.ts:866-914`; `server.ts:7068-7086`).
- Medium · Gap — The domain card's specific messages aren't covered:
  - **Verification record not found**
  - **Domain isn't pointing to this deployment**
  - **Deployz couldn't configure HTTPS**
  - **HTTPS isn't reachable yet**
  - **This deployment isn't running**
  - The **Setting up** and **Connecting** states
- Low · Acc — Quote the exact customer text: "Ask the application owner to remove this domain and add it again."

**`troubleshooting/connector.mdx`**
- Low · Acc — `RELAY_DISCONNECTED` is raised after about a day; say so.
- Low · Guide — Plain-text "contact support" with no link.

**`troubleshooting/analysis.mdx`**
- Medium · Acc — The page says **Re-analyze application** is unavailable while an analysis runs, then tells the reader to select it. Say where each one appears: the menu item is disabled, but the **Overview** card offers it after 2 minutes.
- Low · Acc — Question rows can also show **Blocking**. "Set the start command in Deployz" isn't possible in the UI.
- Low · Gap — The worker-command finding is missing.
- Low · Guide — The description says "does not" instead of a contraction.

### Customer guide

**`customers/security.mdx`**
- High: H1, H2, H3.
- Medium · Security — The connector can also delete tagged secrets, and list or describe every secret in the account (metadata only).
- Medium · Security — The application boundary allows ECR pull on `*` and log writes to any group in the Region.
- Medium · Security — "Configuration values … pass through Deployz": they're stored, with secrets encrypted (`install-config.ts:59-66`).
- Medium · Gap — There's no statement that Deployz keeps operational metadata after removal, although the in-app text says it does (`security-details.ts:104`).
- Medium · Acc — Revoke access: the connector's log groups and SSM parameters remain after the stack is deleted. Stack deletion may fail while application roles still use the boundary (can't verify).
- Medium · Can't verify — Whether older application roles pick up the boundary after a connector update.
- Low · Security/Acc — The logs grant is broader than "its own log". "No network creation" holds, but the connector can create caches, certificates, listeners and task definitions. "Only outbound HTTPS" should be "its only connection to Deployz is outbound HTTPS"; it also calls AWS APIs and checks the app's address.
- Low · Gap — Helper roles in the template aren't listed. Link to `reference/aws-resources`.
- Low · Guide — The heading "The connector's credential" contains an apostrophe.

**`customers/before-you-install.mdx`**
- Medium · Acc — The permissions list says "log groups", but the template has none. It omits `iam:PassRole`, `lambda:AddPermission`/`InvokeFunction` and `events:PutRule`/`PutTargets`.
- Medium · Gap — Organization policies that can block setup are missing: the EventBridge rule, SSM Parameter Store, CloudWatch alarms, the cross-account ECR pull from Deployz's registry, the public `amazonlinux` image, and the RDS CA download.
- Medium · Acc — The Regions statement (see `share/regions`).
- Low · Acc — The load balancer is created only for a public web workload.

**`customers/remove.mdx`**
- Medium · Acc — "The database is set to keep its automated backups after deletion" only applies to CloudFormation deletes. In the console, the customer chooses.
- Medium · Gap — Missing from what remains: Deployz's operational metadata, the connector log groups, service-linked roles, and task-definition revisions.
- Low · Security — **Delete retained data** also deletes caches and task-definition revisions.

**`customers/install.mdx`**
- Low · Guide — The UI label **Vendor recommended** conflicts with the customer-guide terminology rule. This needs a product decision.
- Low · Imp — Link the Cloudflare sentence to the new section on the security page (H3).

**`customers/costs.mdx`**
- Medium · Acc — The load balancer is listed as "Always", but it's created only for public workloads. This is a product inconsistency: the estimate always prices one.
- Medium · Dup — The baseline cost table duplicates `share/sizes-and-cost`, and the copies have already drifted.
- Low · Gap — Costs the estimate leaves out: Secrets Manager, CloudWatch Logs, alarms, and the connector's Lambda, EventBridge and SSM.

**`customers/custom-domain-dns.mdx`**
- Low · Imp — "Directly to the load balancer" needs the Cloudflare context (H3) to make sense.

**`customers/overview.mdx`**
- Low · Acc — "The connector only calls out to Deployz".
- Low · Guide — The **Who does what** table has an empty first header cell, which hurts accessibility.

### Reference

**`reference/aws-resources.mdx`**
- Medium · Acc — "All resources are tagged" and "connector limited to tagged resources" both overstate (see H1 and H2).
- Medium · Gap — The connector stack table is missing the Provider and LogRetention functions, their roles, the installation ID role, and the Lambda permission. The log groups it lists are created at run time, not by the stack.
- Medium · Acc — "Each service runs one container" is wrong: with a database, an `amazonlinux` init container is added.
- Medium · Acc — Certificates are listed as "Kept" after removal, but removal deletes the default certificate (`default-https.ts:398-425`).
- Low · Gap — Not mentioned: the secondary CIDR `10.1.0.0/20`, the S3 lifecycle rule for incomplete uploads, and the x86_64 architecture.
- Low · Imp — The page mixes vendor and customer voices.

---

## 3. Cross-cutting issues

**Duplication.** Each of these should have one canonical home:
- **Baseline cost tables:** in `share/sizes-and-cost` and `customers/costs`, already drifted. Use a snippet.
- **The 17-Region table:** in `share/regions` and `customers/before-you-install`. Use a snippet.
- **The retained-data list:** in five pages. `reference/aws-resources` holds the facts; `operate/remove` and `customers/remove` hold the procedures; `customers/costs` should link.
- **The migrations and rollback warning:** in four pages. The canonical home is `/prepare/migrations#keep-migrations-safe-for-rollback`.
- **The connector description:** described four different ways. Make `/how-it-works#the-deployz-connector` canonical.
- **The recoverability table:** in `failure-codes` and `troubleshooting/overview`.

**Terminology.**
- "Image" as a noun appears across `prepare/*`, `releases/*` and troubleshooting. Most uses mean the Docker artifact and are justified. Decide whether `AGENTS.md` allows "container image", and fix "release image" phrasing.
- "Build" as a noun: clarify in `AGENTS.md` whether it's allowed for the act of building.
- "Installation ID" is used in customer pages but never defined. Add a glossary entry.

**Preview labels.** These mentions of queues and schedules have no label: `environment-variables:62`, `not-supported:122`, `releases/create:61`, `requirements:42`, `aws-resources:49,69`, `security:66`. The label format also varies; standardize on one.

**Headings with apostrophes.** About 20 headings contain apostrophes. None is linked yet; rename any that become link targets.

**Support links.** Four mentions of "contact support" have no link: `releases/build-failures:41,42`, `failure-codes:24`, `troubleshooting/connector:68`.

**Verified-commit markers.** Only the three security pages record a commit. Section 9 of the strategy asks for markers on all P0 pages. `failure-codes` and `aws-resources` say "verified against" with no commit.

**Strategy document drift.**
- It plans `customers/index`, but the page is `customers/overview`.
- Section 1 cites "section 8" for in-app links, but section 8 is Terminology.
- Section 11 allows "the vendor" in the customer guide, which conflicts with `AGENTS.md`.
- The bootstrap exception is scoped differently than in `AGENTS.md`.
- Item 10.5 is outdated.

**`AGENTS.md` claim.** It says "Page URLs are linked from the Deployz app", which isn't true yet.

---

## 4. Missing pages from the content strategy

| Planned page | Gap | Recommendation |
| --- | --- | --- |
| `account/organization-and-team` | Roles, team invitations (expire after 7 days; resend and revoke), admin limits, ownership transfer, deleting an organization or account, and multiple organizations. `concepts` already gets admin powers wrong. | **Write now (High)** |
| `prepare/analysis` | The result groups, the **Resources** inventory, required versus recommended findings, the data toggles and re-analyzing. All of it is currently spread over three pages. | Write now (Medium) |
| `prepare/fix-findings` | **Get fix instructions**, the coding-agent dialog, **Copy instructions** and **Regenerate**. | Write now (Medium) |
| `reference/limits` | Link expiry (30 days for install links and invitations, 7 days for team invitations), one test deployment, one link, 17 Regions, storage 20–100 GB, the 200-value limit, the 4,096-byte secret limit, the 60-minute build timeout, and the 30-minute verification window. | Write (Medium) |
| `prepare/data-services` | Injected variable names, TLS and CA handling, and aliases. | Write (Medium); could hold the injected-variables table |
| `prepare/workers-queues-schedules` | JS/TS-only detection, queue bindings and IAM, the dead-letter queue, messages lost on removal, and cron validation. | Write (Medium; Preview) |
| `account/github` | One GitHub App installation per organization; a second organization fails with no explanation. What removing access breaks. | Short page, or a section on the team page |

---

## 5. Product-side issues (code, not docs)

Product owners should decide on these. Many docs fixes depend on the answers.

1. **First-install recovery:** there's no recovery path after a failed first install with a "can recover on its own" code (H14). Also confirm whether `DATABASE_CONNECTION_FAILED` belongs in that class.
2. **Install link expiry:** a deployment's install link expires after 30 days, and the dashboard can't extend or rotate it. **Issue new install link** clears enrollment but not expiry, so reconnecting an old deployment may be refused.
3. **Revoking invitations:** there's no dashboard control for it.
4. **In-app copy:** the following text should change:
   - "A new link invalidates the old one".
   - "Run the install link again" in five fix texts.
   - "Readiness screen".
   - "Retry the disconnect".
   - **Vendor recommended** on customer pages.
   - The billing text "or when you add your first customer deployment".
5. **Security:**
   - Disclosure of the Cloudflare proxy.
   - Name scoping across several deployments in one account and Region.
   - The untagged write actions.
   - Whether deleting the connector stack can fail.
   - Boundary adoption for older roles.
   - How long Deployz retains metadata and secrets.
6. **Status and failure states that never appear:** the **Disconnected** state, **Applying configuration**, and the codes nothing raises (`RDS_UNAVAILABLE`, `REDIS_CONNECTION_FAILED`, `UNSUPPORTED_ARCHITECTURE`).
7. **"Infrastructure requirements changed" notice:** a false alarm when a database or cache was dropped, and it checks only one deployment.
8. **Configuration failure:** after a failed configuration update, new secret values stay in AWS.
9. **Removal before install:** a deployment whose connector never connected can't be removed from the UI.
10. **Load balancer:** the estimate always prices a load balancer, but one is created only for public workloads.
11. **Production Regions:** the value of `DEPLOYABLE_AWS_REGIONS` in production.
12. **Start command:** there's no UI field, although the in-app text tells vendors to set it in Deployz.
13. **Port and health check edits:** decide whether these should reach existing deployments.
14. **Roles:** whether billing, removal and domains should be limited by role.
15. **Docs links:** add docs links and a linked **Contact Deployz support** in the app.
16. **Duplicate customer records:** each install-link confirmation creates a new customer record, even for an email that already exists.

## 6. Open questions

1. What should the docs tell vendors to do after a failed first install with a "can recover on its own" code? (H14)
2. Which Regions are installable in production today?
3. Should the security page disclose the Cloudflare proxy for the default address, and list every untagged write action? Is having several deployments in one account and Region supported?
4. Should the docs keep the **Revoked** invitation status until a revoke control ships?
5. Is the 30-day expiry of a deployment's install link intended?
6. Should any member be able to manage billing, remove deployments and add domains?
7. Should `AGENTS.md` allow "container image" and "build" as nouns in the Docker sense?
8. Should duplicated tables move into Mintlify snippets? That would add a `snippets/` directory.
9. Should the changelog get entries for #573–#575 before launch?
10. How long does Deployz keep operational metadata and secrets the vendor entered after removal?

## 7. Suggested fix order

1. **Security and billing accuracy:** H1–H3, H6, H7, and H16 (add `AGENTS.md` to `.mintignore`).
2. **Wrong-action fixes that don't need product answers:** H8–H13, the `DOMAIN_OPERATION_TIMEOUT` section, the customer-config override scope, **Applying configuration**, the hidden removed deployments, and the **Explain with AI** wording.
3. **After product answers:** H4, H5, H14, H15, Regions, and the in-app copy alignment.
4. **Hub and glossary:** the 11 missing hub rows, the missing recovery-panel headings, the glossary additions, and the deep links.
5. **New pages:** `account/organization-and-team`, then `prepare/analysis` and `prepare/fix-findings`, then `reference/limits`.
6. **Polish:** deduplicate with snippets, standardize Preview labels, add **Who:** lines, the changelog, verified-commit markers, starter-asset cleanup, and the strategy document fixes.
