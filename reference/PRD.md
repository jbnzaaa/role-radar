# Product Requirements — RoleRadar (Expo mobile app)

| | |
|---|---|
| Owner | Jay (job seeker, designer and developer) |
| Platform | iOS and Android app built with Expo (React Native), plus a small API on Vercel |
| Status | Draft v1 — informed by low-fidelity reference screens (Oct 2026); final UI is designed in Figma |
| Last updated | 2026-10-31 |

---

## 1. Problem

Job seekers find most postings on their phone. Judging whether a posting really fits their CV — which requirements they meet, what's missing, whether it's worth applying — takes time, and general AI chat tools don't help enough:

- The CV has to be pasted into every chat.
- Judgments drift between conversations, so results can't be compared.
- Answers come as long prose, not a scannable checklist.
- Nothing is remembered: no history, no application tracking, no "which job first?".

## 2. Goal

A phone app that gives every job description a **consistent, explainable match score** against a saved CV, and keeps a record of every job analyzed and its application status.

### Success metrics

| Metric | Target |
|---|---|
| Paste job description → result on screen | < 30 s on 4G |
| Agreement with my own judgment (golden set, same verdict) | ≥ 70%; within one verdict ≥ 90% |
| Score stability (same input, 3 runs) | Spread ≤ 5 points |
| App cold start on a mid-range phone | < 2 s to Home |
| Running cost | $0 for Android personal use (Gemini free tier, Vercel Hobby, EAS free); iOS install outside Expo Go needs the $99/yr Apple Developer Program |

---

## 3. Users

| User | Description | Priority |
|---|---|---|
| **Primary: me** | UI/UX designer job hunting in Metro Manila; checks several postings a day on a phone | Build for this user only |
| Future | Other job seekers with their own CVs | Out of scope (needs real accounts, privacy compliance, paid AI, store publishing) |

---

## 4. Vocabulary (use these exact words in UI and code)

**Verdicts** (computed from the score — AI_MATCHING.md §7)

| Score | Verdict | Code value |
|---|---|---|
| 80–100 | Strong match | `strong` |
| 65–79 | Good match | `good` |
| 45–64 | Partial match | `partial` |
| 0–44 | Low match | `low` |

**Application status** (set by the user)

| Label | Code value | Meaning |
|---|---|---|
| Not applied | `not_applied` | Default after an analysis |
| Saved | `saved` | Bookmarked to apply later |
| Applied | `applied` | Application sent |
| Interviewing | `interviewing` | In interviews |
| Offer | `offer` | Received an offer |
| Rejected | `rejected` | Closed |

"Unapplied" = `not_applied` or `saved`. "Applications" = `applied`, `interviewing`, `offer` or `rejected`.

**Requirement status:** Met · Partial · Missing.

---

## 5. User stories

| ID | As a job seeker, I want to… | So that… | Release |
|---|---|---|---|
| US-00 | sign in with my Google account in one tap | I don't manage another password, and only I can use my quota | MVP |
| US-01 | pick my CV file once and review its text | analyses use accurate content | MVP |
| US-02 | save CV versions with a name and pick the active one | I can compare versions | MVP |
| US-03 | paste a job description and get a score with evidence | I know quickly whether to apply | MVP |
| US-04 | see requirements met / partial / missing, must-haves first | I trust the score | MVP |
| US-05 | see strengths, gaps, tailoring tips and keywords | I can tailor my CV honestly | MVP |
| US-06 | set an application status on each analysis | I track my pipeline | MVP |
| US-07 | browse and search all past analyses | I can come back to them | MVP |
| US-08 | see this week's average, my active CV and recent analyses at a glance | I know where I stand | MVP |
| US-09 | export and import all my data | I don't lose it when I change phones | MVP |
| US-10 | see my unapplied jobs ranked by score | I apply to the best ones first | v1.1 |
| US-11 | share a job post from LinkedIn, a browser or a job app into RoleRadar (iOS and Android) | I skip copy-paste | v1.1 |
| US-12 | see a preview of my CV's first page | I know which file is active | v1.1 |
| US-13 | keep preferred titles, work arrangement and location in my profile | analyses can flag location/arrangement mismatches | v1.2 |
| US-14 | get a reminder to follow up N days after applying | I don't forget | v1.3 |

---

## 6. Features

Screen-level requirements: [SCREENS.md](./SCREENS.md).

### F1. CV (MVP)
- Pick a PDF or DOCX (≤ 4 MB — the hosting platform's request limit) with the system file picker (Files, Google Drive, Downloads…).
- The app sends the file to our API `/api/parse-cv`, which returns the text and page count. **The server stores nothing.** A copy of the file is kept on the phone.
- Editable text (≤ 30,000 characters) with a counter; or paste the CV text directly.
- Name and save as a new version; list of versions; exactly **one** active; rename, set active, delete.
- Contact details are removed from the text before any AI call.

### F2. Quick analyze → Analyzing → Match analysis (MVP)
- Paste a job description (200–20,000 characters); **Paste** button reads the clipboard.
- Analyzing screen with progress text (< 30 s target).
- Match analysis: job title, company, date; summary; score gauge and verdict; CV used; dealbreakers (if any); requirements breakdown (counts + rows with evidence; must-have first, then Missing → Partial → Met); tailoring tips; strengths; gaps; keywords; application status picker; "Analyze another job".
- Score is **computed in code**, never taken from the model.

### F3. History (MVP)
- Overview counts: Analyzed, Applied, Interviews.
- All analyses, newest first: title, company, date, score bar, verdict, status, CV version.
- Search by title or company. Tap opens the stored Match analysis (no AI call).

### F4. Home (MVP: partial; v1.1: complete)
- MVP: greeting, **This week** gauge, **Active CV** card, **Recent analysis** (latest 5).
- v1.1: **Top matches** card.

### F5. Top matches (v1.1)
- Unapplied jobs by verdict (counts + proportional bar); highest-scoring Strong/Good unapplied jobs with score bar, matched-skill chips and verdict.

### F6. Profile & settings (MVP: minimal; v1.2: preferences)
- MVP: name, email and photo from the Google account (name editable), headline, location; Manage CVs; Privacy & data (export, import, delete all); Help; Terms & Privacy; app version; Sign out.
- v1.2: preferred job titles, work arrangement, preferred location — sent with analyses so location/arrangement mismatches can be flagged.

### F7. Share into RoleRadar (v1.1)
- RoleRadar appears in the iOS and Android share sheet for **text and links**. Shared text pre-fills Quick analyze. A shared link is kept as metadata only — **never fetched**.
- Requires a development/production build (not Expo Go).

### F8. Sign in with Google (MVP)
- The Login screen has one action: **Continue with Google** (native Google account picker on Android and iOS).
- The app sends the Google **ID token** to our API, which verifies it with Google, checks the email is verified and on the **allow-list** (`ALLOWED_EMAILS` — just me for now), and returns RoleRadar's own session token (30 days) stored in secure storage.
- Name, email and profile photo from Google pre-fill the Profile and the Home greeting.
- **Sign out** signs out of Google in the app and deletes the session token. Local data stays on the phone (Privacy & data has "Delete all data").
- Data is still stored only on the phone; the Google account is the gate, not a cloud sync (sync is a separate later decision).
- Requires a development build (not Expo Go). For UI work in Expo Go, a **dev sign-in** button exists only in development, against a local API with `ALLOW_DEV_LOGIN=true`.

### F9. Offline (MVP)
- Without a connection, History, past results and the CV screen work; Analyze and CV parsing explain they need a connection.

---

## 7. MVP boundaries

### In the MVP
F1, F2, F3, F4 (partial), F6 (minimal), F8, F9; API deployed on Vercel; app installed on my Android phone (EAS preview APK). iPhone needs the Apple Developer Program for an installed build — Google Sign-In doesn't work in Expo Go.

### Later
| Release | Scope |
|---|---|
| v1.1 | Top matches, share into RoleRadar, CV page preview (development build from here on) |
| v1.2 | Profile preferences in analysis |
| v1.3 | Local follow-up reminders (`expo-notifications`), tailored CV bullets / cover letter |
| v2 | Store publishing (App Store / Play Store) and multi-user — separate decision |

### Never
- Scraping job sites or fetching job URLs.
- Auto-applying.
- Inventing experience in tips or tailoring.

---

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Devices | iOS (current and previous major version), Android 10+; small (iPhone SE / 360 dp) to large (Pro Max) phones; portrait only |
| Touch | Targets ≥ 44 × 44 pt; primary actions at the bottom |
| Text | Supports system text size up to the largest accessibility size without clipped content |
| Keyboard | Never hides the primary button or the field being edited |
| Performance | Cold start < 2 s; History scrolls smoothly with 500 analyses |
| Security | Gemini key server-only; Google ID tokens verified on the server (signature, audience, expiry, verified email, allow-list); session token in secure storage; every API route authenticated; inputs validated with Zod |
| Privacy | CV file never stored on the server; contact details redacted before AI; no content in logs |
| Reliability | 429 retried with back-off then a clear message; input preserved on every error; works offline for stored data |
| Accessibility | WCAG 2.2 AA principles applied to native: VoiceOver/TalkBack labels, contrast, no colour-only meaning (DESIGN_SYSTEM.md §8) |

---

## 9. Acceptance criteria (MVP)

### F1 — CV
- [ ] PDF and DOCX ≤ 4 MB can be picked; other types or larger files show an error before upload.
- [ ] After picking: a file card (name, type, pages) and the editable text appear within 10 s on 4G.
- [ ] Text under 300 characters shows "This file has little readable text — paste your CV instead."
- [ ] The API keeps no copy: no file or text is written to disk or logs (checked in code review and Vercel logs).
- [ ] Saving requires a version name; the new version becomes active; exactly one version shows "Active".
- [ ] Past analyses keep showing the CV version they used.

### F2 — Analyze
- [ ] Analyze is disabled until the job description has ≥ 200 characters and an active CV exists (with a link to the CV tab if not).
- [ ] Analyze → Analyzing → Match analysis within 30 s.
- [ ] The score equals the formula in AI_MATCHING.md §7 applied to the breakdown shown.
- [ ] Requirements ordered must-have first, then Missing → Partial → Met; count chips match the rows.
- [ ] Any dealbreaker caps the score at 40 and is shown at the top of the breakdown.
- [ ] Same CV version + same job description → stored result, no API call.
- [ ] On 429 after retries: "Free-tier limit reached — try again in a minute", text still there.
- [ ] Offline: "You're offline — analysis needs a connection", text kept.

### F3 — History
- [ ] Analyzed = all; Applied = applied + interviewing + offer + rejected; Interviews = interviewing + offer.
- [ ] Search filters by title or company as you type.
- [ ] Status changes on Match analysis show immediately in History and Home.

### F4 — Home (MVP)
- [ ] This week = average score of analyses dated Monday–Sunday of the current week (phone's time zone); empty state when none.
- [ ] Active CV shows average score, file name, number of analyses that used it, save date.
- [ ] Recent analysis lists the latest 5.

### F6 / F8 / F9
- [ ] Export writes a JSON file and opens the share sheet (save to Files/Drive); import restores it after confirmation; delete all asks for confirmation.
- [ ] **Continue with Google** opens the native account picker; choosing an allow-listed account lands on Home with the Google name and photo.
- [ ] A Google account not on the allow-list sees "This account doesn't have access to RoleRadar" and stays on Login.
- [ ] Cancelling the Google picker returns to Login with no error message.
- [ ] Without a valid session token the app shows Login; every API route returns 401 without one; an expired token sends the user to Login and back to where they were after signing in.
- [ ] Sign out returns to Login; signing in again with the same account shows the same local data.
- [ ] The dev sign-in button doesn't exist in preview/production builds, and the production API rejects dev sign-in.
- [ ] The Gemini key and token secret are not in the app bundle (no `EXPO_PUBLIC_` secrets).
- [ ] Airplane mode: app opens, History and results readable.

---

## 10. Open questions

- [ ] App name: the reference Profile screen says "CareerSniper" — confirm RoleRadar everywhere (app name, bundle ID `com.<you>.roleradar`, icon).
- [ ] "4 interview scheduled" on Home needs interview dates we don't store — use "4 in interviews" unless dates are added.
- [ ] iPhone: pay for the Apple Developer Program? Without it, RoleRadar runs only on Android (Google Sign-In and share-into-app both need an installed build).
- [ ] Should signing in on a new phone restore data? Today data is per phone (use export/import). Cloud sync tied to the Google account would be a separate project decision.
