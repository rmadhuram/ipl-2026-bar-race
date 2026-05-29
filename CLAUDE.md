# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A bar chart race visualization for the IPL 2026 season. The goal is to animate teams arranged by points. If there is a tie, using a Net run rate method.

## Data

All match data lives in `data/` as 70 JSON files, one per match, named by match ID (e.g., `1527676.json`). These follow the [Cricsheet](https://cricsheet.org) format (data_version `1.1.0`).

### JSON structure

```
{
  "meta": { "data_version", "created", "revision" },
  "info": {
    "event": { "name", "match_number" },
    "dates": ["YYYY-MM-DD"],
    "teams": [...],
    "players": { "<team>": ["player names"] },
    "outcome": { "winner", "by": { "wickets" | "runs" } },
    "season": "2026",
    ...
  },
  "innings": [
    {
      "team": "<batting team>",
      "overs": [
        {
          "over": 0,
          "deliveries": [
            {
              "batter": "...",
              "bowler": "...",
              "non_striker": "...",
              "runs": { "batter": N, "extras": N, "total": N },
              "extras": { "wides" | "noballs" | "legbyes" | "byes" },  // optional
              "wickets": [{ "player_out": "...", "kind": "...", "fielders": [...] }],  // optional
              "replacements": { "match": [{ "in", "out", "team", "reason" }] }  // impact player sub, optional
            }
          ]
        }
      ],
      "powerplays": [...],
      "target": { "overs": 20, "runs": N }  // second innings only
    }
  ]
}
```

### Key data nuances

- **Player names** use initials + surname (e.g., `"YBK Jaiswal"`, `"V Suryavanshi"`). The `registry.people` map in `info` gives each player a unique ID.
- **Batter runs** (`runs.batter`) excludes extras. Total runs scored off the delivery is `runs.total`.
- **Extras** (wides, no-balls, leg-byes, byes) don't count toward the batter's score and may or may not count against the bowler depending on the stat being tracked.
- **Impact player substitutions** appear as `replacements.match` on the first delivery after the sub. The incoming player (`in`) replaces the outgoing player (`out`).
- **Match date and number** are in `info.dates[0]` and `info.event.match_number`. Sort files by match number or date to get chronological order.
- Files are **not** sorted by match number — sort programmatically.
