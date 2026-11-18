# DentPath – Gate G3: Beta kit and status

Prepared 2026-11-18. Target gate date: **May 1, 2027** (164 days).

## 1. Exit criteria

| Criterion | Target | Now | Owner |
|---|---|---|---|
| PWA live on Vercel | Public HTTPS URL | **Not deployed** (needs your Vercel login) | You |
| Student testers | ≥ 20 sessions logged | 0 | You + Adnane |
| Non-Canadian schools verified | ≥ 60% (≈ 65 of ≈ 108) | 0 | You + Adnane |
| Canadian schools verified (carried from G2) | 10 of 10 | 0 | You + Adnane |
| CI green | Every push | **Green**: runs #1 and #2 passed on GitHub | Claude |
| Zero open High-severity data errors | 0 | 0 reported (no testers yet) | All |

## 2. Done in this step

| Item | Where |
|---|---|
| Confirmed GitHub test runs pass | Actions runs #1 and #2, both `success` |
| "International schools" tab: 31 rows (18 UK + 1 to confirm, 9 AU, 2 IE, 1 US task for 79 schools) with course links where found | Verification tracker |
| "Beta testers" tab: one row per session, 5 tasks scored Done unaided / Done with help / Failed | Verification tracker |
| In-app "Beta feedback" (copyable template, nothing sent automatically) | Home screen footer |
| UI tests: 18 passing (feedback flow added) | `tests/ui.test.mjs` |

## 3. Verification workload to reach 60%

| Country | Schools | Rows ready in tracker | Needed for 60% |
|---|---|---|---|
| United States | 79 (ADA) | 1 task: export list from ADEA Dental School Explorer | ≈ 47 |
| United Kingdom | 18 (+ Teesside to confirm) | 19 | ≈ 11 |
| Australia | 7–9 | 9 | ≈ 6 |
| Ireland | 2 | 2 | 2 |
| **Total** | **≈ 108** | | **≈ 65** |

At about 1.5–2 h per school (G0 estimate), 65 schools is roughly 100–130 hours. Split between two people over 23 weeks, that is about 2–3 hours per person per week.

Note on counts: ADA says 79 US + 10 Canadian schools; ADEA says its members are "all 87 U.S. and Canadian dental schools". The two disagree; record which list you use.

## 4. Recruiting testers ($0)

Message for pre-dental clubs, class group chats and r/predental (edit before posting):

> **Testing a free dental-school planner for Canadian students**
> DentPath shows every Canadian dental school's deadlines and requirements, with a source link on every number, plus a fit check and a deadline plan. Free, no account, nothing leaves your phone.
> We need 20 pre-dental students for a 20-minute test on your phone. You'll try 5 short tasks and tell us what was confusing.
> Interested? Reply here and we'll send the link.

Targets: 20 sessions, at least 5 universities, at least 3 provinces, at least 5 iPhone and 5 Android users.

## 5. Test session script (20 minutes)

1. **Intro (2 min).** "We're testing the app, not you. Think aloud. Nothing you type leaves your phone."
2. **Tasks (12 min)**, no hints; log each in the Beta testers tab:

| # | Task | Success means |
|---|---|---|
| T1 | "When is the next dental school deadline you could apply to?" | Reads it from Home → Next deadlines |
| T2 | "What is Western's minimum GPA, and where does that number come from?" | Opens Western, finds 3.00 and taps `source` |
| T3 | "Enter your own numbers. Which schools are you below the minimum for?" | Uses Fit; reads results |
| T4 | "Mark two steps of your application as done." | Ticks 2 checklist items in Plan |
| T5 | "You think a number is wrong. Report it." | Opens a school, taps Report an error, copies the report |

3. **Debrief (6 min):** What was confusing? What's missing? Would you recommend it (1–5)? Ask them to send the in-app Beta feedback.

## 6. Privacy for testers

Testers use the app normally; DentPath collects nothing. The Beta testers tab stores only a first name or alias, university, province and device. Don't record emails or grades in the tracker.

## 7. What I need from you to close G3

1. Deploy on Vercel (steps in `dentapply/README.md`) and send me the URL. I'll check the live security headers.
2. Share the tracker with Adnane (edit) so you can split the data checks.
3. Post the recruiting message and book sessions.
4. Tell me when tracker rows are filled. I import verified rows into `schools.json` and switch those schools to `verified`.
