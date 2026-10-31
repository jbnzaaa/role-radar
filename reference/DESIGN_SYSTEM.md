# Design System — RoleRadar (Expo)

Source of truth for visuals: the **Figma file** (variables, text styles, components). Source of truth for code: `apps/mobile/src/theme/` and `apps/mobile/src/components/ui/`. **Token names are identical in both.**

The low-fidelity screens are a **reference only**. Colours, type scale, spacing, layout values and the component list below are a **starting proposal** drawn from that reference — decide the real values in Figma, then update this doc so code and Figma match. Not optional: the accessibility rules (§8) and the mobile rules in CLAUDE.md §3.

**Units:** React Native uses density-independent units — **pt** on iOS, **dp** on Android. Figma px at 1x = pt/dp. All numbers here are in those units.

**Principles**
1. **One glance, one answer.** Each card answers one question; the big number comes first.
2. **Thumb-first.** Primary action full width at the bottom; navigation in the tab bar.
3. **Calm and honest.** Neutral surfaces; colour only for meaning (verdict, requirement status).
4. **Never colour alone.** Every verdict and status also has a text label.
5. **Native feel.** Platform back gestures, system sheets and pickers where they exist.

---

## 1. Token layers and code shape

| Layer | Example | Used by |
|---|---|---|
| Primitive | `neutral[100]`, `accent[600]` | Semantic tokens only |
| Semantic | `color.surfaceCard`, `color.verdictStrong` | Components |

Figma: collections `Primitives` (1 mode) and `Semantic` (modes `Light`, `Dark` — dark after MVP).

```ts
// apps/mobile/src/theme/tokens.ts  (generated from Figma variables — don't hand-edit values)
export const primitives = { neutral: { 0: "#FFFFFF", 50: "#FAFAFA", /* … */ }, accent: { /* … */ } } as const;
export const color = {
  bgPage: primitives.neutral[50],
  surfaceCard: primitives.neutral[0],
  textPrimary: primitives.neutral[900],
  // …
} as const;
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 20, full: 999 } as const;
```

Components use `useTheme()` → `{ color, space, radius, text }` so dark mode later is a token switch, not a rewrite.

---

## 2. Colour (proposal)

### 2.1 Primitives
| Neutral | Hex | | Accent / status | Hex |
|---|---|---|---|---|
| `neutral.0` | #FFFFFF | | `accent.50` | #EEF2FF |
| `neutral.50` | #FAFAFA | | `accent.600` | #4F46E5 |
| `neutral.100` | #F4F4F5 | | `accent.700` | #4338CA |
| `neutral.200` | #E4E4E7 | | `green.50` / `green.700` | #F0FDF4 / #15803D |
| `neutral.300` | #D4D4D8 | | `blue.50` / `blue.700` | #EFF6FF / #1D4ED8 |
| `neutral.500` | #71717A | | `amber.50` / `amber.700` | #FFFBEB / #B45309 |
| `neutral.600` | #52525B | | `red.50` / `red.700` | #FEF2F2 / #B91C1C |
| `neutral.700` | #3F3F46 | | | |
| `neutral.900` | #18181B | | | |

### 2.2 Semantic
| Token | Light | Use |
|---|---|---|
| `bgPage` | neutral.50 | Screen background |
| `surfaceCard` | neutral.0 | Cards, tab bar |
| `surfaceSunken` | neutral.100 | Stat tiles, chips, progress tracks, file card |
| `border` | neutral.200 | Dividers, inputs |
| `borderStrong` | neutral.300 | Dashed file picker area |
| `textPrimary` | neutral.900 | Titles, values |
| `textSecondary` | neutral.600 | Descriptions, meta (≥ 4.5:1 on white and neutral.100) |
| `textDisplay` | neutral.700 | Big page titles |
| `actionPrimary` / `actionPrimaryText` | neutral.900 / neutral.0 | Primary button |
| `accent` / `accentSubtle` | accent.700 / accent.50 | Active tab, links, focus, score fill |
| `verdictStrong` / `…Bg` | green.700 / green.50 | Strong match, Met |
| `verdictGood` / `…Bg` | blue.700 / blue.50 | Good match |
| `verdictPartial` / `…Bg` | amber.700 / amber.50 | Partial match, Partial |
| `verdictLow` / `…Bg` | red.700 / red.50 | Low match, Missing, dealbreaker |

**Gauge:** four bands (Low 0–44, Partial 45–64, Good 65–79, Strong 80–100) in the verdict colours at reduced strength, a marker at the score, the number + verdict in the centre. Drawn with `react-native-svg`.

**Status bar:** dark content on the light page background (`expo-status-bar` `style="dark"`).

---

## 3. Typography (proposal)

Fonts loaded with `expo-font` (e.g. `@expo-google-fonts/inter` for body; the display face chosen in Figma). Numbers use `fontVariant: ['tabular-nums']`.

| Token | Size / line height | Weight | Use (as in the reference) |
|---|---|---|---|
| `text.display` | 40 / 44 | 700 | Page titles: "Your CV", "History", "Hello, Jay" |
| `text.scoreXl` | 48 / 52 | 600 | Gauge centre |
| `text.scoreLg` | 40 / 44 | 600 | Active CV score |
| `text.stat` | 24 / 30 | 600 | History overview numbers |
| `text.title` | 16 / 22 | 600 | Card titles |
| `text.body` | 15 / 22 | 400 | Summaries, body |
| `text.bodyStrong` | 15 / 22 | 600 | Row titles |
| `text.small` | 13 / 18 | 400 | Descriptions, meta |
| `text.caption` | 12 / 16 | 500 | Chips, legends |
| `text.input` | 16 / 22 | 400 | Text inputs |

- Minimum 12; the reference uses ~11 for some meta and chips — raise it.
- **Dynamic Type:** text scales with the system setting. Layouts must wrap, not clip. Only `display` and score numbers get `maxFontSizeMultiplier={1.3}`.
- On Android, set `includeFontPadding: false` on display text for consistent vertical alignment.

---

## 4. Spacing, radius, elevation, layout

**Spacing (4-unit base):** `space[1]` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48
**Radius:** `sm` 8 · `md` 12 · `lg` 20 (cards) · `full` (buttons, chips, back button, tab pill)
**Elevation:** cards flat on `bgPage`. Tab bar and sheets: iOS `shadowColor/Opacity/Radius`, Android `elevation: 8` — wrap in one `shadow.raised` token.

**Layout (proposal, from the reference)**
| Element | Value |
|---|---|
| Screen side padding | 20 |
| Gap between cards | 8 |
| Card padding | 16 |
| Back button | 40 circle (44 hit area via `hitSlop`), below the safe-area top |
| Page title block | display title + small description, 24 below |
| Bottom action bar | full-width pill button, height 52, 20 side padding, above the bottom safe area |
| Tab bar | 64 + bottom safe area; 4 tabs + 52 centre (+) |

**Screen sizes to check in Figma and on devices:** 375 × 667 (iPhone SE), 390 × 844 (design frame), 440 × 956 (Pro Max), 360 × 800 (small Android).

---

## 5. Motion and feedback

- Durations: fast 120 ms, base 200 ms; native stack transitions (don't customise in MVP).
- **Analyzing dot matrix:** Reanimated wave (~1.6 s loop); with Reduce Motion → static dots + progress text.
- Gauge marker animates 0 → score once (skipped with Reduce Motion).
- Haptics (`expo-haptics`): `selectionAsync` on status change, `notificationAsync(Success)` on save/analysis done.
- Pressed state on every `Pressable`: opacity 0.7 or a darker surface — never no feedback.

---

## 6. Components (starting list — add, merge or drop in Figma)

Each is a Figma component (with variants) and `apps/mobile/src/components/ui/<Name>.tsx`. **Figma variant properties = React props.**

| Component | Props / variants | States | Seen in the reference on |
|---|---|---|---|
| `Button` | `variant`: primary · secondary · ghost; `size`: lg (52) · md (44); `icon?`; `fullWidth` | pressed, disabled, loading | Bottom actions |
| `IconButton` | `variant`: surface · plain; `accessibilityLabel` (required) | pressed, disabled | Back, bell, pencil |
| `GoogleSignInButton` | `loading` | pressed, disabled, loading | Login (follow Google's branding guidelines: official "G" mark, approved light/neutral styles, "Continue with Google") |
| `TabBar` + `TabBarButton` | `active`; centre `AddButton` | pressed | Home, CV, History, Profile |
| `PageHeader` | `title`, `description?`, `back?` | — | Detail screens |
| `HomeHeader` | `name`, `subtitle`, `avatar` | — | Home |
| `Card` | `title?`, `description?`, `onPress?` | pressed (if pressable) | Everywhere |
| `Gauge` | `value`, `label`, `size` | empty | This week, Match analysis |
| `StatTile` | `value`, `label` | — | History overview |
| `KeyValueRow` | `label`, `value` | — | Active CV, Match analysis |
| `Chip` | `tone`: neutral · strong · good · partial · low · met · missing · accent | — | Verdicts, statuses, keywords |
| `ScoreBar` | `value`, `tone` | — | History, Top matches |
| `StackedBar` + `LegendRow` | `segments` / `label`, `value`, `tone` | — | Top matches |
| `AnalysisRow` / `HistoryRow` / `MatchRow` | job, score, verdict, status (+ CV name / skills) | pressed | Home, History, Top matches |
| `RequirementRow` | `title`, `evidence`, `status`, `importance` | — | Match analysis |
| `CheckList` | `items`, `icon` | — | Tips, strengths, gaps |
| `SearchField` | `placeholder` | focused, filled (clear) | History |
| `TextArea` | `label`, `count`, `max` | focused, error, disabled | Quick analyze, CV text |
| `StatusPicker` | `value`, `onChange` (opens a bottom sheet / ActionSheetIOS) | — | Application tracking |
| `FilePickerCard` | `accept`, `maxMb` | idle, picking, uploading, error | CV empty |
| `FileCard` | `name`, `type`, `pages`, `onReplace` | — | CV uploaded (preview image in v1.1) |
| `VersionRow` | `name`, `active`, `savedAt` | pressed | Saved versions |
| `SettingsRow` | `title`, `description?`, `trailing`: chevron · value | pressed | Profile |
| `ProfileCard` | `name`, `headline`, `location`, `avatar` | — | Profile |
| `DotMatrixLoader` | `rows`, `cols` | animating, reduced motion | Analyzing |
| `Banner` | `tone`: info · warning | — | Offline |
| `BottomSheet` | `title` | open/closed | Status picker, confirms |
| `Toast` | `tone` | enter/exit | Saved, status updated |
| `EmptyState` | `title`, `body`, `action?` | — | Home, History, CV |
| `Avatar` | `name`, `uri?` (Google photo; initials fallback when missing or offline) | — | Home, Profile |

Icons: `lucide-react-native` — tabs `House`, `FileText`, `History`, `CircleUser`; add `Plus`; analyze `Sparkles`; back `ArrowLeft`; edit `Pencil`; upload `CloudUpload`; met `CircleCheck`, partial `CircleDot`, missing `CircleX`.

---

## 7. Copy and labels

- Verdicts: Strong match · Good match · Partial match · Low match. Statuses: Not applied · Saved · Applied · Interviewing · Offer · Rejected. (Exported from `packages/core/labels.ts` — never retype them.)
- File picking on phones: "Choose a file" (no "drag and drop").
- Scores: "71%" in big numbers, "71" in compact rows — one style per surface.

---

## 8. Accessibility

- [ ] Contrast ≥ 4.5:1 for text (≥ 3:1 for ≥ 24 pt / bold ≥ 18.66 pt, icons and control borders) — including grey chips on grey cards.
- [ ] Every `Pressable` has `accessibilityRole` and `accessibilityLabel` (icon-only buttons especially); selected tab `accessibilityState={{ selected: true }}`.
- [ ] Verdict/status/requirement chips carry text, not just colour.
- [ ] `Gauge` is one accessible element: "Average match score 71 percent, Good match".
- [ ] Charts have text equivalents (legend with counts).
- [ ] Analyzing progress text uses `accessibilityLiveRegion="polite"` (Android) and `AccessibilityInfo.announceForAccessibility` (iOS).
- [ ] Targets ≥ 44 × 44 pt (`hitSlop` for pencils and small icons).
- [ ] Works at the largest Dynamic Type / Android font size: nothing clipped, rows wrap.
- [ ] Logical reading order for VoiceOver and TalkBack; headings marked `accessibilityRole="header"`.
- [ ] Reduce Motion respected.
- [ ] Recommended: labels visible on all four tabs (the reference shows a label only on the active one).

---

## 9. Figma workflow (Claude × Figma MCP)

### 9.1 Setup
- [ ] Create **"RoleRadar — Mobile"** (Claude loads `figma-create-new-file`).
- [ ] Pages: `00 Cover`, `01 Foundations`, `02 Components`, `03 Reference` (paste the reference frames), `04 Screens`, `99 Playground`.

### 9.2 Build order (Claude loads `figma-use` + `figma-generate-library`)
| Step | Example prompt |
|---|---|
| 1 | "Create a `Primitives` variable collection with the colours, spacing and radii in DESIGN_SYSTEM.md §2.1 and §4." |
| 2 | "Create a `Semantic` collection (Light mode) aliasing primitives as in §2.2, using the camelCase names." |
| 3 | "Create text styles from §3." |
| 4 | "Build a Foundations page: swatches with token names, type scale, spacing." |
| 5 | Components smallest first: Chip → IconButton → Button → TabBar → Card → KeyValueRow → StatTile → ScoreBar → StackedBar/LegendRow → Gauge → rows → RequirementRow → CheckList → SearchField → TextArea → StatusPicker sheet → FilePickerCard → FileCard → VersionRow → SettingsRow → ProfileCard → PageHeader → HomeHeader → DotMatrixLoader → Banner → BottomSheet → Toast → EmptyState. |
| 6 | "Design the Home screen at 390 × 844 in `04 Screens`, using the Home reference frame as a starting point and only components from `02 Components`. Include every required item in SCREENS.md §2." Repeat per screen with empty/loading/error/offline states. |
| 7 | "Screenshot each screen at 375, 390 and 440 widths and list unbound values, text below 12 and targets below 44." |

Rules: all values bound to variables; auto layout everywhere; component property names = React prop names; frames include the iOS status bar and home indicator areas so safe areas are designed, not discovered.

### 9.3 Figma → code
- Generate `src/theme/tokens.ts` from Figma variables (`get_variable_defs`) and diff against this doc.
- Build each `ui/` component from its Figma node (`figma-design-to-code` → `get_design_context`). The output is web-oriented: translate `div`→`View`, text→`Text`, CSS→`StyleSheet` with tokens, flexbox defaults (`flexDirection: 'column'` in RN).
