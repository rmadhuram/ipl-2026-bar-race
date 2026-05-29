# IPL 2026 Bar Chart Race — Next.js App

## Context
Build a Next.js bar chart race visualization showing IPL 2026 team standings (points + NRR) evolving over 70 matches. Data is 70 Cricsheet JSON files in `/data/`. No code exists yet; create the entire app in the project root.

---

## File Structure

```
/
├── data/                          # existing — 70 Cricsheet JSON files
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Server Component — calls processData(), passes to client
│   └── globals.css
├── lib/
│   ├── processData.ts             # server-only data pipeline (uses fs)
│   └── types.ts                   # shared TS types
├── components/
│   ├── BarChartRace.tsx           # 'use client' — state machine, renders frames
│   ├── RaceBar.tsx                # single Framer Motion bar
│   ├── Controls.tsx               # play/pause, speed, scrubber
│   └── MatchLabel.tsx             # animated match header
├── constants/
│   └── teams.ts                   # colors, abbreviations
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data Processing (`lib/processData.ts`)

### Key data facts (from analysis of all 70 files)
- 10 teams, match numbers 1–70, dates 2026-03-28 to 2026-05-24
- 68 clean wins, 1 no-result (match #12 KKR vs PBKS), 1 tie+Super Over (match #38 KKR wins vs LSG)
- 1 D/L match (match #50, LSG vs RCB, both 19 overs) — detected by `'method' in outcome`
- 15 all-out innings before 20 overs (detected implicitly by "lost" logic below)
- 27 early-chase wins (target reached before 20 overs)
- Super Over: 4 innings in the file — innings[2] and [3] are Super Over, skip for NRR

### Legal ball counting
A legal ball is any delivery **without** `extras.wides` or `extras.noballs`. Leg-byes and byes ARE legal deliveries.

### NRR balls logic (critical)
```
innings[0] (bats first):
  D/L match → use actual legal balls
  all other → always 120 (even if all-out: standard IPL rule)

innings[1] (chases):
  D/L match → use actual legal balls
  winner === inn1.team (won chasing) → actual legal balls
  otherwise (lost or all-out) → 120
```

No-result match: skip entirely for NRR, award 1 pt each.
Super Over innings: skip entirely (use only innings[0] and [1] for NRR).

Points: Win=2, Loss=0, No-result=1 each, Tie→Super Over: `outcome.eliminator` team gets 2.

### Cumulative NRR formula
```
nrr = (runsScored / ballsFaced * 6) - (runsConceded / ballsBowled * 6)
Guard: ballsFaced > 0, else nrr = 0
```

### Output types
```typescript
// lib/types.ts
export interface TeamStanding {
  team: string;
  abbrev: string;
  pts: number;
  nrr: number;
  rank: number;  // 1–10, sorted by (-pts, -nrr)
}
export interface MatchSnapshot {
  matchNumber: number;
  label: string;  // "Match 15: CSK vs MI | 2026-04-10"
  date: string;
  standings: TeamStanding[];  // length always 10, pre-sorted
}
```

### Expected final standings (smoke test)
```
1. RCB  18 pts  +0.794
2. GT   18 pts  +0.695
3. SRH  18 pts  +0.524
4. RR   16 pts  +0.173
5. PBKS 15 pts  +0.309
6. DC   14 pts  -0.651
7. KKR  13 pts  -0.147
8. CSK  12 pts  -0.345
9. MI    8 pts  -0.556
10. LSG  8 pts  -0.751
```

---

## Team Config (`constants/teams.ts`)

```typescript
{ abbrev, primary, secondary, text, logo }  // text = '#000' for light bg, '#fff' for dark bg

CSK  → #F9CD1F / #1B4B8A / #000000
DC   → #0078BC / #EF1C25 / #FFFFFF
GT   → #1C1C1C / #B5B5B5 / #FFFFFF
KKR  → #3B215A / #F5A818 / #FFFFFF
LSG  → #A9E4FF / #031636 / #000000
MI   → #004BA0 / #D1AB3E / #FFFFFF
PBKS → #DD1F2D / #84898C / #FFFFFF
RR   → #2D4EA2 / #FF69B4 / #FFFFFF
RCB  → #D4173A / #000000 / #FFFFFF
SRH  → #F7621E / #000000 / #FFFFFF
```

Team logos are SVG files from Wikimedia (`upload.wikimedia.org/wikipedia/en/...`), rendered via `next/image` with `unoptimized` (required for SVG). The `upload.wikimedia.org` hostname is whitelisted in `next.config.ts` remotePatterns.

---

## Animation (`components/BarChartRace.tsx` + `RaceBar.tsx`)

### Layout
- Container: `position: relative`, `height = 10 * (BAR_HEIGHT + GAP)` (56px bar, 8px gap = 640px)
- Each bar: `position: absolute`, keyed by **team name** (not rank/index — critical for Framer Motion reorder animation)

### RaceBar motion
```tsx
<motion.div
  layout
  key={standing.team}
  animate={{ y: (standing.rank - 1) * (BAR_HEIGHT + GAP) }}
  transition={{ duration: 0.5, ease: 'easeInOut' }}
>
  {/* logo | color bar (width animates) | pts | NRR */}
</motion.div>
```
Width of the colored fill bar: `animate={{ width: \`${(pts / MAX_PTS) * 100}%\`` }}` — `MAX_PTS = 18`.

### Frame playback
```typescript
const SPEEDS = { 1: 1200, 2: 700, 4: 350 };  // ms per frame
useEffect with setInterval, clears on pause/unmount
Stops at frame 69 (last match)
```

### Controls
- Play/Pause button
- Speed toggle: 1× / 2× / 4×
- Range slider (0–69) for manual scrubbing
- Current match label with date

---

## Dependencies
```json
"next": "^15", "react": "^19", "framer-motion": "^12",
"tailwindcss": "^4", "typescript": "^5", "@types/node", "@types/react"
```

---

## Verification
1. Run `npm run dev`, open `http://localhost:3000`
2. Press Play — bars should animate smoothly across 70 frames
3. At frame 70 (match 70), final standings must match the expected table above
4. Pause at frame 1 — only 2 teams have points (the two who played match 1)
5. Check match #38 frame — KKR should gain 2 pts (Super Over win)
6. Check match #12 frame — both KKR and PBKS gain 1 pt each (no-result)
