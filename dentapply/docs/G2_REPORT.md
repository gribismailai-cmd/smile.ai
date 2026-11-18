# DentPath – Gate G2: Build report

Prepared 2026-11-18. Status: **build complete; 1 exit criterion open (Canada data verification).**

## 1. Exit criteria

| Criterion (from master prompt) | Result | Evidence |
|---|---|---|
| All Must-have features pass acceptance criteria | **Met** | Table §2 |
| Tests green | **Met locally** | 21/21 unit, 16/16 UI (iPhone 13, light + dark), 10/10 schools valid against schema |
| CI green | **Not yet observed** | Workflow added; runs on the next push. Result not seen from this session |
| Security checklist | **Partly met** | §4 |
| Canada data 100% verified | **Not met** | Tracker untouched (revision 3, 0 of 56 rows checked). All 10 Canadian schools are `draft` |

## 2. Must-have features

| Feature | Acceptance test | Result |
|---|---|---|
| Schools directory, 5 countries | US tab shows "Coming soon" with 79 schools and no requirement values | Pass |
| Per-field source, date, confidence | Western detail shows a `source` link and "checked" date on each field | Pass |
| "Coming soon" state | `launch` mode hides draft schools (unit test) | Pass |
| Fit check | GPA 2.9 → Western "Below minimum"; province QC → Laval eligible | Pass |
| Deadline timeline | Sorted ascending; ineligible schools excluded; passed dates projected | Pass |
| Checklist saved on device | Tick persists after reload | Pass |
| Disclaimer, terms, privacy | Reachable in 2 taps from Home and Plan | Pass |
| Report a data error | Pre-filled report with school, field, value, source; Copy button | Pass. Contact address still blank |

## 3. What changed since the MVP

| Change | Why |
|---|---|
| Data moved to schema v2 (per-field `source_url`, `checked_on`, `confidence`, `cycle`) | Every value traceable |
| School `status`: `verified` / `draft` / `coming-soon`; `RELEASE_MODE` switch | Beta shows drafts labelled "Unverified"; launch hides them |
| Province of residence in profile; residency rules per school | App now serves all Canadian students, not only Ontario |
| Country tabs and coverage card (CA 10, US 79, UK 18, AU 7–9, IE 2) | 5-country scope; non-Canadian countries "Coming soon" |
| Logic moved to `web/logic.js` (pure functions) | Testable; one place for rules |
| Google Fonts removed; system fonts (SF Pro on iPhone) | No third-party requests (UI test asserts zero) |
| `web/vercel.json` with no-cache for data and security headers (CSP) | Fresh data; safer page |
| GitHub Actions workflow `.github/workflows/dentpath.yml` | Tests on every push |

## 4. Security checklist (OWASP MASVS-style, web scope)

| Check | Status |
|---|---|
| No secrets in code | Pass (no keys used) |
| No user data leaves the device | Pass (no server, no analytics; UI test checks zero external requests) |
| Output escaping for all data rendered as HTML | Pass (`esc()` on every interpolated value) |
| Content-Security-Policy | Added in `vercel.json`; not yet tested on a live Vercel deploy |
| Dependency audit | Runtime has no dependencies; dev-only Playwright |
| HTTPS only | Provided by Vercel |

## 5. Known gaps

| # | Gap | Next step |
|---|---|---|
| 1 | Canada data unverified | You fill the tracker; I import and mark schools `verified` |
| 2 | Report contact address blank | You choose an email to publish |
| 3 | SwiftUI source still on schema v1 | Update after beta (planned) |
| 4 | Legal drafts not lawyer-reviewed; province for governing law not set | Your choice |
| 5 | Not deployed | You create the Vercel project (README steps) |

## 6. Next gate (G3 beta, target May 1, 2027)

PWA live on Vercel, ≥ 20 student testers, US/UK/AU/IE verification ≥ 60%.
