# RoleRadar

A mobile app for job seekers: save your CV once, paste or share a job description, and get a consistent 0–100 match score with evidence for every requirement — then track what you apply to.

Built with **Expo (React Native)** for iOS and Android, plus a small **API server** that keeps the Gemini key safe.

> **Status:** Pre-development. Start with [TASKS.md](./TASKS.md), Phase 0.

---

## What it does

1. **CV** — pick a PDF or DOCX once, review the extracted text, save it as a named version.
2. **Quick analyze** — paste a job description, or share it from another app (v1.1).
3. **Match analysis** — score and verdict (Strong / Good / Partial / Low match), a requirement-by-requirement breakdown with evidence, strengths, gaps, tailoring tips and keywords.
4. **Track** — set an application status on each job; everything is in **History**.
5. **Home** — this week's average score, your active CV, top unapplied matches and recent analyses.

---

## Repository layout (monorepo, npm workspaces)

```
roleradar/
├── apps/
│   ├── mobile/      # Expo app (Expo Router, TypeScript)
│   └── api/         # Next.js (API routes only) on Vercel — Gemini + CV parsing
└── packages/
    └── core/        # Shared TypeScript: Zod schemas, scoring, redaction, labels
```

Why a separate API? The Gemini key must never be inside the app (anyone can extract it from an app bundle), and CV files are easiest to parse in Node. The API is stateless: it stores nothing.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Mobile framework | **Expo** (latest stable SDK) + React Native, TypeScript strict | Expo Router for navigation |
| Styling | React Native `StyleSheet` + typed theme tokens (`apps/mobile/src/theme`) | Tokens generated from Figma variables |
| Graphics | `react-native-svg` (gauge, bars), `react-native-reanimated` (Analyzing animation), `lucide-react-native` icons | |
| Sign-in | **Google Sign-In** with `@react-native-google-signin/google-signin` (free "Original" API); the API verifies the Google ID token and only lets in allow-listed emails | Native code → needs a **development build** (not Expo Go) |
| Device APIs | `expo-document-picker`, `expo-file-system`, `expo-clipboard`, `expo-sqlite`, `expo-secure-store`, `expo-sharing`, `expo-haptics`, `@react-native-community/netinfo` | All work in Expo Go |
| Share from other apps (v1.1) | `expo-share-intent` (community package) | Needs a **development build**, not Expo Go |
| API | Next.js route handlers on Vercel (Node runtime) | `apps/api` |
| AI | Google Gemini API (free tier) via `@google/genai` | Server-side only |
| CV parsing | `unpdf` (PDF), `mammoth` (DOCX) | On the API, in memory, never stored |
| Validation | Zod (in `packages/core`, shared by app and API) | |
| Builds & updates | EAS Build, EAS Update | Free plan is enough for personal use |
| Testing | Jest (`jest-expo`) + React Native Testing Library, Vitest for API/core, Maestro for end-to-end | See [TESTING.md](./TESTING.md) |
| Design | Figma, via Claude × Figma MCP | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [SCREENS.md](./SCREENS.md) |

---

## Prerequisites

- **Node.js** LTS (20+), **npm**, **Git**, **GitHub** account
- **Expo account** (free) and the EAS CLI: `npm i -g eas-cli`
- A phone with **Expo Go** for the first phases; a **development build** of RoleRadar from Phase 3 (Google Sign-In needs native code)
- A **Google Cloud project** with an OAuth consent screen and three OAuth client IDs: Web, Android, iOS (ARCHITECTURE.md §7.1)
- Optional: Android Studio (emulator) and, on a Mac, Xcode (iOS simulator)
- **Gemini API key** from [Google AI Studio](https://aistudio.google.com/) (don't link billing to stay free)
- **Vercel** account (API hosting)
- **Figma** + the Figma connector in Claude

### Costs to know
| Item | Cost | When you need it |
|---|---|---|
| Expo Go, EAS free plan, Vercel Hobby, Gemini free tier | $0 | Always |
| Android install on your own phone (EAS "preview" APK) | $0 | MVP |
| Google Cloud OAuth (consent screen in "Testing" with you as a test user) | $0 | Phase 3 |
| Apple Developer Program | $99 / year | To install any build on an iPhone — and so to **sign in with Google on iPhone** (Expo Go can't) |
| Google Play publishing | $25 one-time + a 14-day closed test with 12 testers for new personal accounts | Only if you publish to the Play Store |

---

## Setup

```bash
# 1. Monorepo
mkdir roleradar && cd roleradar && git init
npm init -y            # then add "workspaces": ["apps/*", "packages/*"] to package.json

# 2. Mobile app
npx create-expo-app@latest apps/mobile        # default template = Expo Router + TypeScript

# 3. API
npx create-next-app@latest apps/api           # TypeScript yes, ESLint yes, Tailwind no, src/ yes, App Router yes

# 4. Shared package
mkdir -p packages/core/src && cd packages/core && npm init -y && cd ../..

npm install
```

`apps/api/.env.local` (server secrets — never in the app):
```bash
GEMINI_API_KEY=your-key-from-ai-studio
GEMINI_MODEL=gemini-3.6-flash
GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com    # accepted ID-token audience
GOOGLE_IOS_CLIENT_ID=yyyy.apps.googleusercontent.com    # accepted ID-token audience
ALLOWED_EMAILS=you@gmail.com                            # comma-separated; only these can sign in
TOKEN_SECRET=at-least-32-random-characters
MOCK_GEMINI=false
ALLOW_DEV_LOGIN=false   # true only on your local API, to use Expo Go without Google (never on Vercel)
```

`apps/mobile/.env` (public config only — anything `EXPO_PUBLIC_*` ends up inside the app; OAuth client IDs are not secrets):
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:3001   # your computer's LAN IP while developing
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=yyyy.apps.googleusercontent.com
```

> Model names change every few months. If you get "model not found", pick a current Flash model from the [Gemini models page](https://ai.google.dev/gemini-api/docs/models) and update `GEMINI_MODEL`.

---

## Development commands

| Command (from repo root) | What it does |
|---|---|
| `npm run dev:api` | API at `http://0.0.0.0:3001` (reachable from your phone on the same Wi-Fi) |
| `npm run dev:mobile` | `expo start` — scan the QR code with Expo Go |
| `npm run typecheck` | `tsc --noEmit` in every workspace |
| `npm run lint` | ESLint everywhere |
| `npm run test` | Jest (mobile) + Vitest (api, core) |
| `npm run e2e` | Maestro flows against a running app (`MOCK_GEMINI=true` on the API) |
| `npm run eval` | AI accuracy evaluation (real Gemini quota) |
| `npm run check` | typecheck + lint + test — before every commit |

Builds:
| Command | Result |
|---|---|
| `eas build --profile development --platform android` | Dev build APK — your daily app from Phase 3 (Google Sign-In), later also share intent |
| `eas build --profile preview --platform android` | Installable APK for your own phone |
| `eas build --profile preview --platform ios` | Needs the Apple Developer Program |
| `eas update --branch preview` | Push JS changes to installed builds without rebuilding |

---

## Project documents

| # | File | Purpose |
|---|---|---|
| 01 | [README.md](./README.md) | Overview, setup, commands |
| 02 | [PRD.md](./PRD.md) | Requirements, features, MVP boundaries, acceptance criteria |
| 03 | [CLAUDE.md](./CLAUDE.md) | Rules Claude Code follows |
| 04 | [ARCHITECTURE.md](./ARCHITECTURE.md) | Monorepo, navigation, storage, API, security, builds |
| 05 | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens, components, Figma workflow, accessibility |
| 06 | [SCREENS.md](./SCREENS.md) | Required content, data, states and actions per screen |
| 07 | [AI_MATCHING.md](./AI_MATCHING.md) | CV parsing, prompt, schema, scoring |
| 08 | [TASKS.md](./TASKS.md) | Phased plan and progress |
| 09 | [TESTING.md](./TESTING.md) | Unit, component, E2E, device, AI eval, release checks |

---

## Privacy note

The CV file is sent to your own API only to extract its text; it is processed in memory and never stored. Everything else lives on your phone. Only CV text (with emails, phone numbers and links removed) and the job description go to Gemini. On the free tier, Google may use inputs and outputs to improve its models and human reviewers may read them — keep your home address and ID numbers out of the CV text.
