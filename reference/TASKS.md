# Tasks — RoleRadar (Expo)

Work top to bottom; finish a phase's **exit criteria** before the next. Priority: **P0** required · **P1** should · **P2** nice to have. Tick `[x]` and add a Progress log line when done. Claude Code follows [CLAUDE.md](./CLAUDE.md) §1–2 for every task.

## Milestones

| Milestone | Phases | Outcome | Status |
|---|---|---|---|
| M0 Foundation | 0–2 | Monorepo, tooling, design system, app shell running in Expo Go | ☐ |
| M1 Core | 3–5 | Google Sign-In + development build, API (CV parsing, AI), CV screen, analyze flow | ☐ |
| **M2 MVP live** | 6–7 | History, Home, Profile basics, deployed API, installed build on your phone | ☐ |
| M3 v1.1 | 8 | Share into app, Top matches, CV preview | ☐ |
| M4 v1.2 | 9 | Profile preferences in analysis | ☐ |
| M5 Hardened | 10 | Eval-tuned scoring, accessibility and device pass | ☐ |

Suggested pace (part-time): Phases 0–2 week 1–2 · 3–5 weeks 3–4 · 6–7 week 5 · then one phase per week.

---

## Phase 0 — Monorepo and tooling

- [x] **P0-01 (P0)** Create the monorepo (README → Setup): root `package.json` with `"workspaces": ["apps/*", "packages/*"]`; `apps/mobile` via `create-expo-app` (default Expo Router + TypeScript template); `apps/api` via `create-next-app` (no Tailwind); `packages/core` named `@roleradar/core`.
- [x] **P0-02 (P0)** Copy the 9 docs into `reference/` (root `CLAUDE.md` points there); commit.
- [x] **P0-03 (P0)** Make Metro resolve the workspace package (check Expo's monorepo guide for your SDK; recent SDKs detect workspaces automatically). *Done when:* the app imports a constant from `@roleradar/core` and runs in Expo Go.
- [x] **P0-04 (P0)** TypeScript `strict` everywhere; shared base `tsconfig`; ESLint + Prettier.
- [ ] **P0-05 (P0)** Root scripts: `dev:api` (`next dev -H 0.0.0.0 -p 3001`), `dev:mobile` (`expo start`), `typecheck`, `lint`, `test`, `e2e`, `eval`, `check`.
- [ ] **P0-06 (P0)** Env files: `apps/api/.env.local` (secrets), `apps/mobile/.env` (`EXPO_PUBLIC_API_URL` only); both git-ignored; `.env.example` for each.
- [ ] **P0-07 (P0)** Testing setup: `jest-expo` + `@testing-library/react-native` in mobile; Vitest in api and core.
- [ ] **P0-08 (P0)** `app.json`: name "RoleRadar", slug, `scheme: "roleradar"`, `ios.bundleIdentifier` and `android.package` (`com.<you>.roleradar`), portrait only, `userInterfaceStyle: "light"` (dark later).
- [ ] **P0-09 (P0)** GitHub repo + first push; connect `apps/api` to Vercel (root directory `apps/api`); `eas init` for the mobile app.

**Exit:** `npm run check` passes; the app opens in Expo Go on your phone; the API responds at `/api/health` locally and on Vercel.

---

## Phase 1 — Design system (Figma via MCP → theme)

Follow [DESIGN_SYSTEM.md §9](./DESIGN_SYSTEM.md#9-figma-workflow-claude--figma-mcp).

### 1A. Figma
- [ ] **P1-01 (P0)** Create "RoleRadar — Mobile"; pages; paste the reference frames into `03 Reference`.
- [ ] **P1-02 (P0)** Decide final palette, fonts, type scale and spacing (DESIGN_SYSTEM.md §2–4 are proposals); update the doc.
- [ ] **P1-03 (P0)** Variables (Primitives + Semantic) and text styles.
- [ ] **P1-04 (P0)** Components (§6 order), all states.
- [ ] **P1-05 (P0)** Final screens at 390 × 844 for every screen in SCREENS.md — every **required** item present, **notes on the reference** applied; empty, loading, error, offline states. If a final screen adds/drops content, update SCREENS.md.
- [ ] **P1-06 (P0)** Check at 375, 390, 440 widths; contrast; no text < 12; targets ≥ 44.
- [ ] **P1-07 (P0)** App icon (1024 px), Android adaptive icon (foreground + background), splash screen.

### 1B. Code
- [ ] **P1-08 (P0)** `src/theme/tokens.ts` + `typography.ts` from Figma variables; `useTheme()`; fonts via `expo-font`.
- [ ] **P1-09 (P0)** `ui/` primitives, one commit each, matching Figma (`react-native-svg` for Gauge/bars, `lucide-react-native` icons).
- [ ] **P1-10 (P1)** A dev-only "Components" screen showing every primitive and state, to check on a real phone.

**Exit:** primitives match Figma on a real phone; no raw hex/number styles in components (`grep -rnE "#[0-9a-fA-F]{3,6}" apps/mobile/src/components` returns nothing).

---

## Phase 2 — App shell

- [ ] **P2-01 (P0)** Expo Router structure (ARCHITECTURE.md §3): root Stack, `(tabs)` with Home, CV, History, Profile + centre (+) button, detail screens as stack routes; placeholder content.
- [ ] **P2-02 (P0)** Layout components: `Screen` (safe areas + background), `KeyboardScreen`, `PageHeader` (back button), `BottomActionBar`.
- [ ] **P2-03 (P0)** `lib/storage`: SQLite schema + migrations (ARCHITECTURE.md §6), `Repository` interface and implementation, file helpers; unit tests.
- [ ] **P2-04 (P0)** `useOnline` (NetInfo) + offline `Banner`.
- [ ] **P2-05 (P0)** `packages/core`: `labels.ts`, `redact.ts` + tests (TESTING.md §2.1).
- [ ] **P2-06 (P1)** Toast and BottomSheet primitives wired at the root.

**Exit:** on a real phone in Expo Go, tabs and back navigation work, safe areas are right on a notched iPhone and an Android with gesture navigation, and the database initialises.

---

## Phase 3 — Google Sign-In, development build, API core

### 3A. Google Sign-In (see ARCHITECTURE.md §7.1)
- [ ] **P3-01 (P0)** Google Cloud: project, OAuth consent screen (Testing, you as test user, scopes `openid email profile`), Web + iOS client IDs; Android client ID after P3-03 gives you the SHA-1.
- [ ] **P3-02 (P0)** API auth: `lib/auth/google.ts` (`verifyIdToken`, audiences, `email_verified`), `allowlist.ts`, `session.ts` (HMAC, 30 days, allow-list re-checked per request), `POST /api/auth/google`, `POST /api/auth/dev` (404 unless `ALLOW_DEV_LOGIN=true` and non-production), `requireSession()` helper, throttle; tests.
- [ ] **P3-03 (P0)** Install `expo-dev-client` and `@react-native-google-signin/google-signin`; add its config plugin (`iosUrlScheme`); `eas build --profile development --platform android` (and iOS if you have the Apple Developer Program); get the Android SHA-1 with `eas credentials`; create the Android OAuth client.
- [ ] **P3-04 (P0)** App: `lib/auth/google.ts` (`configure({ webClientId, iosClientId })`, `signIn`, `signOut`), `session.ts` (SecureStore), `lib/api/client.ts` (base URL, Bearer, 60 s timeout, 401 → Login), Login screen (SCREENS.md §1) with all states, dev sign-in in `__DEV__`, auth gate + return-to route, Google name/photo saved to `profile`.
- [ ] **P3-05 (P0)** Sign out (Profile) → Google `signOut()` + delete session token → Login.
  *Done when:* on the dev build, an allow-listed Google account signs in; another account is refused; cancel is silent.

### 3B. API core
- [ ] **P3-06 (P0)** Core: `schema.ts` (incl. `label`), `scoring.ts` (`computeScore`, `verdictFor`, counts) + tests incl. the worked example.
- [ ] **P3-07 (P0)** `POST /api/parse-cv`: session, multipart, magic bytes, ≤ 4 MB, `unpdf` / `mammoth` in memory, `normalizeCvText`, warnings; Node runtime.
- [ ] **P3-08 (P0)** Gemini: `client.ts` (`server-only`), `prompts.ts` (`analyze-v1`), `call.ts` (structured output, retries, timeout, typed errors), `mock.ts` (strong, partial, dealbreaker).
- [ ] **P3-09 (P0)** `POST /api/analyze` (session, Zod, limits, redact again, orchestration, sanity checks, error mapping); `maxDuration` set.
- [ ] **P3-10 (P0)** Fixtures: 2 fictional CVs (one UI/UX designer) as TXT/PDF/DOCX, 5 fictional job descriptions.
- [ ] **P3-11 (P1)** `scripts/try-analyze.ts` — one real call. *Done when:* a valid result prints.

**Exit:** sign in with Google on the development build against the local API; one real analysis succeeds from the script.

---

## Phase 4 — Your CV screen

- [ ] **P4-01 (P0)** Empty state (SCREENS.md §8a): file picker (`expo-document-picker`), size/type checks, "Or paste your CV text".
- [ ] **P4-02 (P0)** Upload → `/api/parse-cv` with "Reading your CV…"; errors (no text, too big, offline).
- [ ] **P4-03 (P0)** Editing state (§8b): `FileCard`, editable text with counter, version name, Save as New Version (copies file into app storage, sets active), Go to Quick Analyze.
- [ ] **P4-04 (P0)** Saved versions; exactly one active; `/cv-version/[id]` rename / set active / delete (confirm).
- [ ] **P4-05 (P1)** Unsaved-changes confirm on leaving.
- [ ] **P4-06 (P0)** Component tests + a Maestro flow for paste-CV → save (file picking is hard to automate; test it by hand).

**Exit:** PRD §9 F1 criteria pass on a real phone.

---

## Phase 5 — Analyze flow

- [ ] **P5-01 (P0)** Quick analyze (§3): `KeyboardScreen`, text area + counter, Paste (`expo-clipboard`), "Using: CV · Change", validation, no-CV and offline states.
- [ ] **P5-02 (P0)** Cache check (`expo-crypto` hash) → API call → insert `Analysis` + status history → `router.replace`.
- [ ] **P5-03 (P0)** Analyzing (§4): `DotMatrixLoader` (Reanimated, Reduce Motion), announced progress text, cancel via back, retry/error states.
- [ ] **P5-04 (P0)** Match analysis (§5): summary + gauge, dealbreakers, sorted breakdown with counts, improve section, `StatusPicker` (sheet + haptic + toast), Analyze another job.
- [ ] **P5-05 (P0)** Tests: component tests for breakdown sorting and counts; Maestro flow paste → analyze → result (API with `MOCK_GEMINI=true`).

**Exit:** PRD §9 F2 criteria pass on a real phone with real Gemini.

---

## Phase 6 — History, Home (MVP), Profile basics

- [ ] **P6-01 (P0)** Core `stats.ts` + tests (week bounds in local time, averages, counts).
- [ ] **P6-02 (P0)** History (§7): overview tiles as `FlatList` header, search, rows, empty states.
- [ ] **P6-03 (P0)** Home (§2) MVP: header, This week gauge, Active CV, Recent analysis, first-run states.
- [ ] **P6-04 (P0)** Profile (§9) MVP (Google photo, name, email) + `/profile-edit` (name, headline, location).
- [ ] **P6-05 (P0)** `/privacy`: export (JSON → `expo-sharing`), import (`expo-document-picker` + Zod + confirm), delete all; "Last backup".
- [ ] **P6-06 (P1)** `/help`, `/terms`.

**Exit:** PRD §9 F3, F4 (MVP), F6 criteria pass.

---

## Phase 7 — Deploy and MVP release

- [ ] **P7-01 (P0)** Vercel production env vars (`GEMINI_API_KEY`, `GEMINI_MODEL`, `GOOGLE_WEB_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`, `ALLOWED_EMAILS`, `TOKEN_SECRET`; **not** `ALLOW_DEV_LOGIN`); deploy; check a 20 s analysis doesn't hit the function time limit.
- [ ] **P7-02 (P0)** `eas.json` profiles (ARCHITECTURE.md §9) with `EXPO_PUBLIC_API_URL` per profile.
- [ ] **P7-03 (P0)** Security checklist (TESTING.md §5).
- [ ] **P7-04 (P0)** `eas build --profile preview --platform android` → install the APK; if the preview keystore differs from the development one, add its SHA-1 to the Android OAuth client first. iPhone (Apple Developer Program): `preview` build or TestFlight.
- [ ] **P7-05 (P0)** Set up EAS Update on the `preview` channel for JS-only fixes.
- [ ] **P7-06 (P0)** Release checklist on real devices (TESTING.md §7). Tag `v1.0.0`.

**Exit:** 🎉 **M2 MVP live** — installed on your phone, used for real job posts.

---

## Phase 8 — v1.1: share into app, Top matches, CV preview

- [ ] **P8-01 (P0)** `expo-share-intent` (check its compatibility with your SDK; config plugin, scheme, text + URL only); root layout routes shared content to `/analyze` pre-filled. Test sharing from Chrome, LinkedIn and a job app on Android, Safari/LinkedIn on iOS.
- [ ] **P8-02 (P0)** Top matches screen (§6) + Home Top matches card; "Mark applied" quick action.
- [ ] **P8-03 (P1)** CV page-1 preview (`react-native-pdf` from the stored file copy) above the `FileCard`.
- [ ] **P8-04 (P1)** Switch `KeyboardScreen` to `react-native-keyboard-controller` if keyboard behaviour needs it.
- [ ] **P8-05 (P0)** New preview builds; update PRD acceptance criteria for F5 and F7.

## Phase 9 — v1.2: Profile preferences

- [ ] **P9-01 (P0)** `/profile-edit` preferences (titles chip input, arrangement chips, location) + Preferences card on Profile.
- [ ] **P9-02 (P0)** Send `profile` with analyses; prompt block; `PROMPT_VERSION` → `analyze-v2`; eval before/after.

## Phase 10 — Hardening

- [ ] **P10-01 (P0)** Golden set (20 labelled jobs) → `npm run eval`; record in AI_MATCHING.md.
- [ ] **P10-02 (P1)** Tune scoring only with a clear eval gain.
- [ ] **P10-03 (P0)** Accessibility: VoiceOver + TalkBack walkthrough of the analyze flow; largest text size on every screen; Reduce Motion.
- [ ] **P10-04 (P0)** Performance: cold start < 2 s on a mid-range Android; History smooth with 500 seeded analyses.
- [ ] **P10-05 (P0)** Re-run the security checklist.

---

## Blockers

| Date | Blocker | Impact | Resolution |
|---|---|---|---|
| | | | |

## Ideas (not in scope yet)

- Follow-up reminders with local notifications (`expo-notifications`) N days after "Applied" (v1.3).
- Tailored CV bullets / cover letter (v1.3).
- Rank several pasted jobs at once.
- Dark mode (tokens are ready for it).
- Store publishing (App Store / Play Store) — v2 decision.

## Progress log

| Date | Task | Change |
|---|---|---|
| 2026-10-31 | — | Expo project docs created (reference screens used as a guide, not a spec) |
| 2026-10-31 | P0-01 | Monorepo created: root npm workspaces, `apps/mobile` (create-expo-app, SDK 58, Expo Router + TS), `apps/api` (create-next-app 16.4, TS, ESLint, no Tailwind, src/, App Router), `packages/core` (`@roleradar/core`); `git init` (no commit yet) |
| 2026-10-31 | P0-02 | 9 docs moved to `reference/` (dropped " (1)" from file names, `AI_MATCHING.md` extracted from the zip); root `CLAUDE.md` points to `reference/CLAUDE.md`; first commits |
| 2026-10-31 | P0-03 | `APP_NAME` exported from `@roleradar/core`, shown on the mobile home screen; Metro (SDK 58) resolves the workspace with no `metro.config.js`; checked in Expo Go on a phone |
| 2026-10-31 | P0-04 | Root `tsconfig.base.json` (strict + safety flags) extended by mobile, api, core; ESLint flat configs (eslint-config-expo, eslint-config-next, typescript-eslint strict) + `eslint-config-prettier`, `no-explicit-any` as error; root Prettier (`printWidth` 100), code formatted; fixed 2 Expo template errors in web-only files |
