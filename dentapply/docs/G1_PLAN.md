# DentPath – Gate G1: Plan

Prepared 2026-11-18. Status: **awaiting product-owner approval.**

## 0. G0 decisions recorded

| Decision | Value |
|---|---|
| Charter | Approved |
| Owner hours for data | Not fixed. Any country not verified by Jul 1, 2027 ships as "coming soon" |
| Blocked official sites | Owner checks pages by hand in the Verification Tracker |
| Name | DentPath |

## 1. Status

| Workstream | Done | Next | Blocked |
|---|---|---|---|
| Data | Verification Tracker live (56 Canada rows, 5 country-list tasks); schema v2 drafted | Owner fills tracker; I import results into `schools.json` | Official pages unreachable from this environment |
| Product | Personas, MoSCoW, acceptance criteria (below) | Build G2 features | — |
| Engineering | Architecture decided (below) | Self-host fonts, "coming soon" state, country filter, tests, CI | — |
| Legal | Terms, privacy, disclaimer drafts in `docs/legal/` | Owner review | Not reviewed by a lawyer |
| Business | Model chosen (below) | Finance sheet at G2 if you want revenue scenarios | — |
| Marketing | Positioning (below) | Content calendar at G3 | — |
| Deployment | Plan (below) | Owner creates hosting project | Needs your Vercel/GitHub login |

## 2. Architecture decision record

| Option | Cost yr 1 | Time to launch | Offline | App Store | Android | Fit |
|---|---|---|---|---|---|---|
| **PWA (vanilla HTML/JS, no build step)** | $0 | Already working | Yes (service worker) | No | Yes (browser) | **Chosen for launch** |
| Native SwiftUI | 99 USD | +6–10 weeks incl. review (estimate) | Yes | Yes | No | **Chosen for after beta** |
| React Native / Flutter | 99 USD + Google Play fee (verify) | +8–12 weeks (estimate) | Yes | Yes | Yes | Rejected: rewrite of working code; no Android need until later |

Decision: launch as PWA; one data file (`schools.json`) shared by PWA and SwiftUI so the data is verified once.

## 3. Personas

| Persona | Situation | Main job | Biggest risk for them |
|---|---|---|---|
| P1 "Planner" | 2nd-year BSc, any Canadian university | Know prerequisites and tests before it's too late | Missing a prerequisite course |
| P2 "Applicant" | Final year, applying this cycle | Track deadlines and documents across 5–10 schools | Missing a deadline or a document |
| P3 "Wider net" | Re-applicant or low acceptance odds in home province | Compare out-of-province, US, UK, AU and IE options | Wrong eligibility info for international applicants |

## 4. Features (MoSCoW)

| Priority | Feature | Acceptance criteria (Given / When / Then) |
|---|---|---|
| Must | Schools directory, 5 countries, filter by country | Given the Schools tab, when I pick "UK", then only UK schools show, verified ones with data and the rest as "Coming soon" |
| Must | Per-field source, date checked, confidence | Given any school, when I open it, then every value shows a source link and a "checked" date |
| Must | "Coming soon" state | Given a school with unverified data, then no requirement values are shown for it |
| Must | Fit check vs published minimums | Given my GPA is below a published minimum, then that school shows "Below minimum" with the reason |
| Must | Deadline timeline with countdown | Given today's date, then deadlines show sorted, with "projected" when the year is not confirmed |
| Must | Checklist saved on device | Given I tick a step and reload, then it is still ticked |
| Must | Disclaimer, terms, privacy pages | Given any screen, then links to all three are reachable within 2 taps |
| Must | "Report a data error" | Given a school page, when I tap Report, then I get a pre-filled message I can copy (no server) |
| Should | GPA calculator per country (OMSAS 4.0 now) | Given grades, then GPA matches a hand calculation |
| Should | Deadline reminders (iOS app) | Given a deadline 14 days away, then a local notification fires |
| Should | Test guides (CDA DAT, US DAT, UCAT, UCAT ANZ, GAMSAT, CASPer) | Given a test, then which schools need it is listed with sources |
| Could | Export plan as text | — |
| Won't (v1) | Accounts, AI advisor, admission prediction, French UI | — |

## 5. Data plan

- Schema v2: `web/schema/school.schema.json`. Each requirement is a `field` object: `value`, `source_url`, `checked_on`, `confidence`, `cycle`.
- Migration of the current Canadian data to v2 happens at G2, after the tracker is filled.
- Workflow: you fill the tracker, I read it, update `schools.json`, and you approve the diff.
- Release rule: a school shows data only when its Must fields (deadline, eligibility for Canadians, tests, minimums or "none published") are verified in the current cycle.

## 6. Business model

| Model | Revenue | Student trust | Effort | Risk | Score (1–5, higher better) |
|---|---|---|---|---|---|
| **Free, no ads (launch)** | None | High | Low | Owner funds 99 USD/yr | **4.0** |
| Freemium: core free, paid AI advisor (phase 2) | Low–medium | Medium–high if core stays free | Medium | AI cost must stay under price | 3.5 |
| One-time purchase | Low | Medium | Low | Kills adoption by students | 2.0 |
| Licence to clubs / career centres | Low–medium | High | High (sales) | Long sales cycle | 3.0 |
| Test-prep sponsorship | Medium | Low (conflict of interest) | Medium | Biased-advice perception | 1.5 |

Scores are my judgement, not data.
Recommendation: **free at launch**. Revisit freemium at phase 2 when the AI advisor exists. I have not produced revenue projections because I have no verified data on conversion or willingness to pay; a market-size estimate needs verified applicant counts per country, which come out of the tracker work.

## 7. Positioning (organic marketing, $0)

- Statement: "DentPath shows every dental school a Canadian can apply to, with sourced requirements and your deadlines in one place. Free, no account, nothing leaves your phone."
- Proof points: source link on every number; "coming soon" instead of guesses; privacy.
- Channels for G3/G4: university pre-dental clubs (outreach email template at G3), r/predental, Instagram/TikTok short videos ("3 deadlines Ontario applicants miss"), App Store keywords at iOS launch.

## 8. Deployment plan

| Step | Owner | Notes |
|---|---|---|
| Create a new hosting project with root folder `dentapply/web` | You | Vercel Hobby (check its terms for non-commercial use) or GitHub Pages; no build step |
| Leave the existing smile.ai `vercel.json` alone | — | It points to `public/` and `api/`, which don't exist; fix separately if you still use that app |
| HTTPS + free subdomain | Host | Custom domain optional |
| Bump `sw.js` VERSION on each data release | Me | So students get new data |
| Self-host fonts | Me (G2) | Removes the Google Fonts request, so the privacy policy can say no third parties are contacted except the host |

## 9. Risks added at G1

| # | Risk | Response |
|---|---|---|
| R6 | Hosting free tier terms change | Static site moves to any host in minutes |
| R7 | Host logs visitor IP addresses | Disclosed in privacy policy |
| R8 | Legal drafts not lawyer-reviewed | Marked as drafts; review before G4 if budget allows (it currently does not) |

## 10. Questions for G1 approval

1. Approve the architecture (PWA now, SwiftUI after beta)?
2. Approve "free at launch" as the business model?
3. Which host: Vercel (you already use it) or GitHub Pages?
4. Review the legal drafts in `docs/legal/`: anything to change (owner name/contact email shown publicly)?
