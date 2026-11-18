# DentPath launch-mode dry run – 2026-11-18

A copy of the app was run with `RELEASE_MODE = "launch"` (nothing published) in two scenarios:
**A** today's data (0 verified schools) and **B** U of T and Western marked verified.

## What students would see

| Screen | A: 0 verified (before fix) | A: after fix | B: 2 verified |
|---|---|---|---|
| Home banner | none | "0 of 10 Canadian schools verified so far…" | "2 of 10 … verified so far" + "applications have closed at both Canadian schools…" |
| Next deadlines | "No dated deadlines yet." | same | U of T, Western: Nov 1, 2027, 348 days |
| Fit snapshot | 0 / 0 / 0 (misleading) | "No schools are verified yet…" | 0 meets / 2 action / 0 below |
| Coverage, Canada | "0 listed" | "0 of 10 verified" | "2 of 10 verified" |
| Schools | 10 × Coming soon | same | 2 with data, 8 Coming soon |
| Fit results | **blank card** | explanation shown | 2 schools rated |
| Beta feedback link | shown | hidden at launch | hidden |
| Console errors | 0 | 0 | 0 |

## Problems found and fixed

| # | Problem | Fix |
|---|---|---|
| 1 | Fit results card blank with 0 verified schools | Empty-state message |
| 2 | Fit snapshot showed 0/0/0 as if evaluated | Empty-state message |
| 3 | No explanation why Canada is all Coming soon | Launch banner: "X of 10 verified so far" |
| 4 | "closed at all 2 schools" | "both" / "the one" / "all N" |
| 5 | Beta feedback link visible at launch | Hidden unless beta |
| 6 | A school could be marked `verified` while still holding search-extract or prior-cycle data (U of T deadline "prior cycle") | Validator now fails the build unless every Must field is `official`, current cycle, and checked by a person. Proven: forcing U of T to `verified` gives 6 errors |

## Result

- Tests: 21/21 unit, 19/19 UI (new launch-mode test), schema + release-rule check passing.
- **Launching today would show students no requirement data**: all 10 Canadian schools are unverified. The tracker is the blocker.
