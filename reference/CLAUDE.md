# CLAUDE.md — Rules for Claude Code in RoleRadar

Read this at the start of every session. When a rule here conflicts with a habit or default, this file wins.

RoleRadar is an **Expo (React Native) app** for iOS and Android in a monorepo:
`apps/mobile` (Expo Router app) · `apps/api` (Next.js API routes on Vercel) · `packages/core` (shared schemas, scoring, redaction).

---

## 1. Before writing code

1. Open [TASKS.md](./TASKS.md); find the current phase and next unchecked task. Work on that task only.
2. Read what the task depends on:
   - Behaviour and acceptance criteria → [PRD.md](./PRD.md)
   - The screen's required content, data, states and actions → [SCREENS.md](./SCREENS.md)
   - The screen's **layout and visuals** → the final Figma frame (not the reference screens). No final frame yet → ask before building the UI.
   - Navigation, storage, API, builds → [ARCHITECTURE.md](./ARCHITECTURE.md)
   - Tokens and components → [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
   - Prompt, schema, scoring → [AI_MATCHING.md](./AI_MATCHING.md)
   - Tests to add → [TESTING.md](./TESTING.md)
3. Ambiguous, or conflicts with a doc → **stop and ask**. No features outside the PRD; put ideas in TASKS.md → Ideas.
4. Before adding a native library, check it works in **Expo Go**. If it needs a development build, say so and ask first (see ARCHITECTURE.md §9).

## 2. After finishing a task

1. `npm run check` passes.
2. UI tasks: run it on a real phone (the development build from Phase 3 on; Expo Go with dev sign-in is fine for pure UI) **and** check a small screen (iPhone SE size / 360 dp Android) and a large one; check with the largest system text size.
3. Tick the task in TASKS.md and add a Progress log line.
4. Changed a route, type, token, prompt, label or scoring rule → update the matching doc in the same change.
5. Summarize: what changed, files, how to verify, what's open.

---

## 3. Mobile rules (every screen)

- **Expo Router** for all navigation. Tab screens live in `app/(tabs)/`; detail screens are stack screens with a back button.
- **Safe areas:** use `react-native-safe-area-context` (`useSafeAreaInsets` / `SafeAreaView`) — never hard-code notch or home-indicator padding.
- **Keyboard:** screens with text inputs use the shared `KeyboardScreen` wrapper so the bottom action button stays above the keyboard on iOS and Android.
- **Touch targets:** ≥ 44 × 44 pt. Use `hitSlop` for small icons.
- **Lists:** `FlatList` / `SectionList` for any list that can grow (History, versions). `ScrollView` only for short fixed content.
- **Primary action at the bottom**, full width, thumb-reachable.
- **Pressed states:** every `Pressable` has a visible pressed style; add `expo-haptics` light feedback on status changes and saves.
- **Text scaling:** support Dynamic Type / Android font scale; cap with `maxFontSizeMultiplier` only on big display numbers (≈ 1.3).
- **Motion:** respect "Reduce Motion" (`AccessibilityInfo.isReduceMotionEnabled` / Reanimated `useReducedMotion`).
- **Platform differences** go through `Platform.select` in one place, not scattered `if (Platform.OS…)`.
- **Icons:** `lucide-react-native` only.

## 4. Tech rules

- TypeScript `strict`, no `any`. Zod schemas in `packages/core` are the source of truth; types via `z.infer`. App and API import from `@roleradar/core`.
- Styling: `StyleSheet.create` + theme tokens from `apps/mobile/src/theme`. **Never** a raw hex, number spacing or font size in a component — use `theme.color.*`, `theme.space.*`, `theme.text.*`.
- No styling libraries (NativeWind, styled-components, etc.) unless agreed.
- UI primitives in `apps/mobile/src/components/ui/` mirror Figma components one-to-one (same names, same variant props).
- Data access only through `apps/mobile/src/lib/storage/repository.ts`. Screens never touch SQLite or the file system directly.
- Server calls only through `apps/mobile/src/lib/api/client.ts` (adds the auth token, timeouts, error mapping).
- Business logic in `packages/core` or `src/lib/`, never inside screen components.

## 5. Security and privacy (non-negotiable)

- The Gemini key exists **only** in `apps/api` env vars, read in `apps/api/src/lib/gemini/client.ts` (`import "server-only";`).
- **Anything named `EXPO_PUBLIC_*` is shipped inside the app and readable by anyone.** Only the API URL and the Google OAuth **client IDs** (public by design) go there — never a key, password, client secret or token secret.
- **Sign-in is Google only.** The app sends the Google ID token to `/api/auth/google`; the API verifies it with `google-auth-library` (audience, expiry, `email_verified`) and checks `ALLOWED_EMAILS`. Never trust an email the app sends without a verified token. Never request scopes beyond `openid email profile`. Never store the Google ID token.
- The RoleRadar session token is stored with `expo-secure-store`, never in SQLite, AsyncStorage or logs.
- Dev sign-in exists only behind `__DEV__` in the app and `ALLOW_DEV_LOGIN=true` + non-production on the API. Never enable it on Vercel.
- CV files are sent only to our `/api/parse-cv`, processed in memory and **never stored** on the server.
- Redact CV text with `redactContactInfo()` (from core) before `/api/analyze`; the API redacts again.
- Never log CV text, job text or AI output — only IDs, lengths, durations, error codes. This includes `console.log` in the app.
- Every API route: token check → Zod validation → size limits.
- Job descriptions are untrusted: they stay inside their delimited block in the prompt.
- Fixtures are fictional. Never commit a real CV.

## 6. AI rules

- Prompts in `apps/api/src/lib/gemini/prompts.ts` with `PROMPT_VERSION`. Changing wording → bump version + AI_MATCHING.md changelog.
- Validate every AI response with Zod; never render unvalidated output.
- Score and verdict come from `computeScore()` / `verdictFor()` in core, never from the model.
- After a prompt/schema/scoring change, run `npm run eval` and log the result.
- `MOCK_GEMINI=true` on the API for UI work and tests.

## 7. Figma workflow

Screens and components live in Figma (DESIGN_SYSTEM.md §9).
- **Figma → code:** load `figma-design-to-code` before `get_design_context`. Its output is web-flavoured — translate it to React Native components, `StyleSheet` and our tokens; never paste CSS.
- **Building in Figma:** load `figma-use` (+ `figma-generate-library`) before `use_figma`.
- Token names in Figma variables and `src/theme/tokens.ts` match exactly.
- A value that isn't a token → ask before adding one.

## 8. Git

- One task = one commit. `<type>(<scope>): <summary>` — e.g. `feat(cv): pick and parse PDF`.
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`, `build`. Never commit with a failing `npm run check`.

## 9. Don'ts

- Don't add dependencies without saying why (and whether they need a dev build).
- Don't scrape or fetch job URLs.
- Don't silence TypeScript/ESLint.
- Don't ship a screen not checked on a real phone and with large text.
- Don't let the AI invent experience.
