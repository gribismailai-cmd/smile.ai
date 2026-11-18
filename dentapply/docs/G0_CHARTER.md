# DentPath – Gate G0: Project charter

Prepared 2026-11-18. Status: **awaiting product-owner approval.**

## 1. Status

| Workstream | Done | Next | Blocked |
|---|---|---|---|
| Product & UX | MVP PWA (4 screens) | Personas, MoSCoW list (G1) | — |
| Data | Canada: 10 schools, partial | Verification tracker; extend schema for US/UK/AU/IE | Official faculty sites cannot be opened from this environment (network allowlist) |
| Engineering | PWA + uncompiled SwiftUI | Architecture decision record (G1) | No Mac/Xcode in this environment |
| Legal | Disclaimer in app | Terms, privacy policy, name check (G1) | — |
| Business & finance | Budget ceiling set | Business-model comparison, 3-yr model (G1) | — |
| Marketing | — | Positioning, channel plan (G1) | — |
| Deployment | Code on branch | Fix `vercel.json`, deploy PWA to free tier (G1) | — |
| PM | Charter (this doc) | Approval, then G1 plan | Your answers in §9 |

## 2. Charter

| Item | Value |
|---|---|
| Project | DentPath |
| Purpose | Help Canadian pre-dental students find, compare and track dental school applications in Canada, the US, the UK, Australia and Ireland, using verified, sourced requirements only |
| Origin | Built first for uOttawa students (uOttawa has no dental faculty) |
| Sponsor / product owner | You |
| Builder | Claude Code, with your review at each gate |
| Users | Canadian pre-dental students, any university |
| Platform | PWA first; native iOS App Store after beta; Android later |
| Language | English |
| Affiliation | Independent. "Not affiliated with any university or dental faculty" |
| AI advisor | Phase 2 (after launch): RAG + GAG (graph-augmented generation), citations required |
| User data | On the device only. No accounts, no server storing student data |
| Budget, year 1 | Under CAD $500 cash, owner's time excluded |
| Public launch | By **Aug 1, 2027**, 256 days from today |
| Out of scope (v1) | Admission prediction, accounts/sync, paid ads, French UI, Android native app, AI advisor |

### Success criteria (measured 30 days after launch)

| # | Criterion | Target |
|---|---|---|
| S1 | Schools shown with every field sourced and dated | 100% of shown schools |
| S2 | Data errors reported by users and confirmed | 0 open High-severity |
| S3 | Usability test with Canadian pre-dental students | 5 students, ≥ 80% task success |
| S4 | Year-1 cash spend | < CAD $500 |
| S5 | Crash-free sessions (iOS) | ≥ 99.5% |

## 3. Scope: schools per country

| Country | Schools | Source | Confidence | Main admissions system for a Canadian applicant |
|---|---|---|---|---|
| Canada | 10 | ADA Health Policy Institute ("10 in Canada") | official (ADA) | Each school directly; CDA DAT; CASPer at some |
| United States | 79 | ADA HPI page, Aug 2026 update ("79 accredited dental schools") | official (ADA); another ADA page still says 77 | AADSAS (ADEA); US DAT (ADA) |
| United Kingdom | 18 | Admissions guides citing GDC list (16 established + UEA and Portsmouth provisional) | third-party; GDC list not opened | UCAS, international quota; UCAT |
| Australia | 7–9 | Aggregators and Wikipedia; Adelaide, Melbourne, Sydney, UWA, JCU, UQ, Charles Sturt; Griffith and La Trobe unconfirmed | **unverified**; ADC accredited list not opened | Varies: undergraduate (UCAT ANZ) or graduate entry (GAMSAT/DAT); international seats |
| Ireland | 2 | Trinity College Dublin, University College Cork | official (school pages) + press | Direct non-EU application to each school |
| **Total** | **116–118** | | | |

## 4. Data-verification workload

Hours per school are **my estimates**, not measured. They cover about 15 fields per school (deadlines, prerequisites, GPA/grades, tests, residency/international rules, seats, tuition, interview, language, application route, sources).

| Country | Schools | Hours / school (est.) | Hours | Why |
|---|---|---|---|---|
| Canada | 10 | 2.0 | 20 | Gaps listed in PROJECT_PLAN.md; French-language pages |
| United States | 79 | 1.5 | 118.5 | Common AADSAS structure; but 79 separate school pages |
| United Kingdom | 18 | 1.5 | 27 | UCAS structure; international quotas differ |
| Australia | 9 | 2.0 | 18 | Two entry routes; international fees and seats |
| Ireland | 2 | 2.0 | 4 | Non-EU routes differ by school |
| Schema extension (UCAT, GAMSAT, A-level equivalents, AADSAS) | — | — | 20 | One-time |
| **Total initial** | **118** | | **≈ 208 h** | |
| Annual refresh (assumed 40% of initial) | | | ≈ 75 h / year | Every cycle, before July 1 |

### Can it be done by launch?

| Milestone | Date | Weeks from today | Hours / week needed for data alone |
|---|---|---|---|
| Data verification complete | Jul 1, 2027 | 32.1 | **6.5 h/week** |
| Public launch | Aug 1, 2027 | 36.6 | — |

Build, testing and marketing time comes on top of this. If your available time is under about 6.5 h/week for data, the 5-country launch will slip. The control from the master prompt applies: any country not verified by Jul 1 ships as "coming soon".

## 5. Budget baseline (year 1)

| Item | Cost | Source / confidence | Needed when |
|---|---|---|---|
| Apple Developer Program | 99 USD / year (shown in local currency at enrolment) | Apple enrolment page, official | Before TestFlight (after PWA beta) |
| PWA hosting | $0 on a free tier (Vercel Hobby or GitHub Pages) | Free-tier terms to verify at G1 | G1 |
| Domain | $0 using the free host subdomain; a custom domain is optional | — | Optional |
| Code hosting, CI | $0 (GitHub free tier, verify Actions minutes at G1) | to verify | G1 |
| Paid ads | $0 | Decision | — |
| ADEA Official Guide / paid data sources | $0 (not purchased) | Decision: free official sources only | — |
| AI API usage | $0 in v1 (advisor is phase 2) | Decision | Phase 2 |
| **Total committed** | **99 USD** | | Leaves the rest of the CAD $500 as contingency |

## 6. Milestones

| Gate | Target date | Exit criteria |
|---|---|---|
| G0 Initiate | Nov 2026 | This charter approved |
| G1 Plan | Dec 15, 2026 | Architecture chosen; schema v2; verification tracker live; legal drafts; business model chosen |
| G2 Build | Mar 31, 2027 | Must-have features pass acceptance tests; CI green; Canada data 100% verified |
| G3 Beta | May 1, 2027 | PWA beta with ≥ 20 students; US/UK/AU/IE verification ≥ 60% |
| G4 Launch | Aug 1, 2027 | All shipped schools verified; legal pages live; App Store submission started |
| G5 Operate | Sep 1, 2027 | 30-day KPI review; refresh scheduled before Jul 1, 2028 |

## 7. Stakeholders and RACI

| Activity | Product owner (you) | Claude Code | Student testers | Pre-dental clubs (outreach only) |
|---|---|---|---|---|
| Scope, budget, gate approval | A/R | C | — | — |
| Data verification | A | R (where the network allows) | C (error reports) | — |
| Engineering, tests, deployment | A | R | — | — |
| Usability testing | A | R (scripts) | R | C |
| Marketing outreach | A/R | R (content) | — | C |
| Apple account, App Store submission | R/A | C | — | — |

R = responsible, A = accountable, C = consulted.

## 8. Top risks at G0

| # | Risk | Prob. | Impact | Response | Owner |
|---|---|---|---|---|---|
| R1 | 5-country data not verified by Jul 1, 2027 | High | High | Weekly burn-down; "coming soon" fallback | You |
| R2 | This environment cannot open official school sites | Certain (today) | High | Allow faculty and regulator domains in the environment's network settings, or you verify manually with links I prepare | You |
| R3 | Australia list unconfirmed (7 vs 9 schools) | Medium | Low | Get ADC accredited list at G1 | Claude |
| R4 | Requirements change mid-cycle | Medium | High | "Last verified" date per school; in-app error report | You |
| R5 | Native iOS build issues (no Mac here) | Medium | Medium | PWA is the launch product; iOS follows | You |

## 9. Sources

| Claim | URL | Checked | Confidence |
|---|---|---|---|
| 79 US / 10 Canadian accredited dental schools | https://www.ada.org/en/resources/research/health-policy-institute/dental-education | 2026-11-18 | official |
| Older ADA page says 77 US | https://www.ada.org/resources/research/health-policy-institute/dental-education | 2026-11-18 | official, dated |
| 18 UK dental schools (16 + UEA, Portsmouth provisional) | https://www.leadingtuition.co.uk/dental-schools/ | 2026-11-18 | third-party |
| UK count corroboration | https://www.theukcatpeople.co.uk/guide/dental-school/dentistry-university-uk | 2026-11-18 | third-party |
| ADC keeps the accredited-program list | https://www.adc.org.au/australian-program-accreditation/processes/accreditation-process/ | 2026-11-18 | official |
| Australian schools named | https://www.wikipedia.org/wiki/List_of_dental_schools_in_Australia | 2026-11-18 | third-party |
| Adelaide BDS | https://adelaide.edu.au/study/degrees/bachelor-of-dental-surgery/ | 2026-11-18 | official |
| Trinity College Dublin Dental Science | https://www.tcd.ie/courses/undergraduate/courses/dental-science | 2026-11-18 | official |
| UCC Dentistry (CK702) | https://www.ucc.ie/en/CK702 | 2026-11-18 | official |
| Apple Developer Program 99 USD | https://developer-rno.apple.com/support/enrollment | 2026-11-18 | official |
