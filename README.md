# KRAFTED BRAND OS™

Brand strategy, guidelines, website build briefs, and Brandie chat.

## Development

Use Node.js 22+ and install dependencies with `pnpm install`. Run `pnpm test`, `pnpm build`, and `pnpm dev` (Netlify CLI). The build copies only `index.html` and `assets/` into `dist/`.

## Brandie

`assets/brandie-live.js` sends selected brand context and recent messages to `/api/brandie`. The Netlify function uses the OpenAI Responses API and streams replies. Instructions are adapted from the installed BRANDIE plugin. Brandie advises on strategy and identity; it cannot modify approved brand decisions or perform actions.

Configure `OPENAI_API_KEY` in Netlify private environment variables, then deploy. The current plan uses default scopes because Functions-only scoping requires an upgrade. The optional `BRANDIE_MODEL` defaults to `gpt-5-mini`. The API project must have sufficient credit. Local testing can load `.env.local`; never upload or publish that file. Never use the repository root as the publish directory; publish `dist/` using the provided Netlify config.

The endpoint validates input size, limits output and runtime, rejects cross-origin browser requests, and applies a site-wide Netlify limit of 10 requests per minute. It is a public prototype endpoint, not an authenticated membership service. The existing browser login is not server-side authentication. Origin checks and rate limits do not replace authentication. Add real access control before offering private client accounts or broader paid use.

Brand data and conversation history remain in each browser's localStorage. Only selected context and recent conversation messages are sent to OpenAI on Send; asset names and colors are included, not uploaded image bytes. No shared accounts or cloud sync are implemented. Existing local-preview messages remain labeled and are not sent back as AI history.

## Verification

`pnpm test` covers streaming, input rejection, context, safe errors and script syntax. `node --env-file=.env.local scripts/check-brandie.mjs` makes a small live API request with synthetic data; it requires network access and API credits.

## Deployment status

Published on 2026-10-07 to https://kraftedbrandos.netlify.app (deploy `6ac5c717ac9a7dcdf6d64fba`). The live page and chat endpoint were verified, and `/.env.local` returned 404. After API credits were added, a live synthetic test completed successfully on 2026-10-07: Brandie correctly identified the supplied audience as independent designers. This was a manual deployment; these local changes must be committed to the linked GitHub main branch before a future Git-based deploy, or that deploy may replace the integration.

## Chat attachments

Brandie and Kraftie accept up to 3 PNG/JPG/WEBP images, PDFs, or TXT/MD/CSV files per message (2 MB total; text files up to 100 KB each). Attachments are sent to OpenAI only on Send and can increase API token usage. File contents live only in page memory; localStorage keeps names and metadata. A retry can reuse files while the page stays open. Reattach files after a refresh or for another review. Backend validation enforces file signatures, types, counts, and payload limits.

### AI generators and conversation deletion

`/api/generate` powers Brand DNA, Brand Guidelines (including selected-section proposals), Website Prompt, Content Multiplier calendars and actual content-format drafts. It uses the existing server-only `OPENAI_API_KEY` and optional `BRAND_OS_MODEL` (default `gpt-5-mini`). Responses use strict task-specific JSON schemas, server validation, a 55-second timeout and Netlify rate limiting. No automatic API calls happen just by opening a page.

Generators use saved Brand Clarity, DNA approval/version, archetype, Funnel Clarity, guideline approval/sections, and asset metadata. Asset image bytes and chat histories are excluded. Generation consumes the owner's OpenAI API credits. Results remain browser-local review drafts; previous DNA/Guidelines and website prompts can be restored, and manually protected guideline sections remain unchanged. Errors, canceled jobs, changed source inputs and storage failures retain prior content. Calendars honor duration and posting frequency; Multiply generates editable, saved copy instead of a placeholder queue notification.

Both chat histories have per-conversation delete controls with confirmation. Deletion removes the browser-local conversation, cancels an active response and clears its in-memory attachments; it is not an OpenAI account data-deletion request.

Tests: `node --test tests/*.test.mjs`. The production build copies only `index.html` and `assets/`; server code, tests and environment files stay out of the public bundle.

### Founder Mode and Client Workspaces

The workspace dropdown offers Founder Mode, each client, and Add client. The header also opens workspace management when the sidebar is collapsed. Client deletion requires typing its name; Founder Mode cannot be deleted through client management.

Existing personal data stays at `krafted_brand_os_phase3` (with the legacy fallback). The small `_workspaces` registry stores client IDs/names and the last selected workspace; each client has its own independent storage key and starts from empty defaults. Clients share only the owner's display profile, not strategy, assets, generations or chats. Switching reloads the app to clear ephemeral attachments, drafts and request state; unsaved field edits prompt before switching. Saves target the workspace loaded by that tab, and deleted clients cannot be recreated by late saves from stale tabs.

This is browser-local organization, not cloud accounts or client sharing. The same configured OpenAI connection is used for generation in the active workspace. Browser storage limits still apply.

## Standalone email accounts

The standalone build uses Netlify Identity for verified email accounts and Netlify Database for account-owned Founder and client workspaces. Configure `BRAND_OS_OWNER_EMAIL` in the production function environment for the verified owner. Login, signup, email callbacks and password recovery run through Identity. Enable Identity in the Netlify dashboard before publishing.

Workspace and AI endpoints enforce account access on the server. All verified email accounts have access without payment. Checkout and subscription enforcement are disabled; unverified and anonymous requests remain blocked.

Existing browser-only work is retained. After signing in, use Account → import to explicitly copy local work into cloud client workspaces. Failed cloud saves retain a per-account local recovery draft; conflicting revisions are rejected rather than overwriting newer work.

Run `node --test tests/*.test.mjs` for the suite (account tests start a temporary local database). Deploy applies the SQL migration in `netlify/database/migrations` automatically. `/api/health` verifies the deployed database schema without returning account data. End-to-end verified-owner login requires the owner to create their password and verify their email.
