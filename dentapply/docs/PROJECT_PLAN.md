# DentPath – MVP project plan (PMI-aligned)

Structure follows PMI's PMBOK process groups (Initiating → Planning → Executing → Monitoring & Controlling → Closing) and PMI's CPMAI phases for the AI part (Business understanding → Data understanding → Data preparation → Model development → Evaluation → Operationalization).

## 1. Charter (Initiating)

| Item | Value |
|---|---|
| Problem | uOttawa has no dental school. Students applying to Canadian DDS/DMD programs must piece together requirements from 10 faculty sites with different deadlines, tests and residency rules. |
| Goal | One iPhone-first app that shows every school's requirements with sources, checks a student's numbers against published minimums, and tracks an application cycle. |
| MVP scope | Schools directory (10), Fit check, GPA calculator, Checklist, Timeline, Resources. Offline-capable web app plus SwiftUI source. |
| Out of scope (MVP) | Admission probability prediction, accounts/sync, AI advisor, US/international schools, French UI. |
| Sponsor / owner | You (product owner) |
| Success criteria | (1) Every displayed figure has a source and confidence tag. (2) Usable at 390 px iPhone width with no horizontal scroll. (3) 5 uOttawa students complete the checklist flow in testing. |

## 2. WBS (Planning)

| ID | Work package | MVP status |
|---|---|---|
| 1.1 | Research: requirements for 10 Canadian faculties | Done (search extracts; official pages not directly opened) |
| 1.2 | Data model `schools.json` with confidence tags | Done |
| 2.1 | Web app (PWA): Home, Schools, Fit, Plan | Done, tested headless at iPhone 13 size, light + dark |
| 2.2 | Offline cache (service worker), home-screen icon | Done |
| 3.1 | SwiftUI source, same data and rules | Written, **not compiled** |
| 4.1 | Verify every "unverified" / "prior cycle" field on official sites | Open |
| 4.2 | User testing with uOttawa students | Open |
| 5.1 | Phase 2: AI advisor grounded in `schools.json` (RAG) | Not started |

## 3. Requirements traceability

| Requirement | Where it is met |
|---|---|
| Help uOttawa students apply to dental school | All tabs; uOttawa note on Home; uOttawa Pre-Dental Club in Resources |
| "Deep search" of requirements | `web/schools.json`, 10 schools, ~35 sources |
| Apple touch format | PWA with `apple-touch-icon`, standalone mode, bottom tab bar, 44 px+ targets, safe-area insets; SwiftUI source |
| No hallucinations | Confidence tag on every value; blanks left blank; Fit check refuses to predict admission |
| Tables / dashboards / graphs | Home dashboard, results table, GPA and DAT scale charts |

## 4. Risk register (Monitoring & Controlling)

| # | Risk | Prob. | Impact | Response |
|---|---|---|---|---|
| R1 | Requirement data is out of date or wrong | High | High | Confidence tags; "researchedOn" date; verify task 4.1 before any student launch |
| R2 | Fall 2027 deadlines already passed (today 2026-11-18) | Certain | Medium | App projects dates to Fall 2028 and labels them "projected" |
| R3 | OMSAS conversion for uOttawa grades unverified | Medium | High | Calculator shows a warning; confirm against OUAC table |
| R4 | Users read "Meets minimums" as "will be admitted" | Medium | High | Copy states the tool does not predict admission |
| R5 | Implied university endorsement | Low | High | "Not affiliated" notice; no uOttawa logo or colours |
| R6 | SwiftUI build errors | Medium | Low | Build in Xcode; web app is the working reference |
| R7 | Student data privacy | Low | Medium | All data stays on the device (localStorage / UserDefaults); no server |

## 5. Data gaps to close (RAID: issues)

| School | Missing / weak |
|---|---|
| U of T | Current-cycle deadline (Nov 1 from 2021-22 calendar); interview format; seat count is 3rd-party |
| McGill | Out-of-province deadline; whether DAT is used |
| UdeM | DAT, CASPer, minimums, full eligibility |
| UBC | Out-of-province minimum average; CASPer status (FAQ undated) |
| Alberta | 2027 out-of-province seat quota; CASPer |
| USask | Application deadline |
| Manitoba | Deadline; current DAT cut-offs (only 2018-2020 third-party) |
| Dalhousie | Fall 2027/2028 dates |
| All | Tuition (not included: sources conflicted) |

## 6. Phase 2 backlog (after your feedback)

1. AI advisor: retrieval over `schools.json` + official pages, answers must cite a source row (RAG). Reuse the repo's existing `chat.js` Claude endpoint.
2. Admin screen to update `schools.json` without code.
3. Reminders/notifications for deadlines.
4. French UI.
5. Compile, test and ship SwiftUI build via TestFlight.
