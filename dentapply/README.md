# DentPath – dental school planner for uOttawa students (MVP)

| Folder | What it is | State |
|---|---|---|
| `web/` | Touch-first web app (PWA). Add to iPhone home screen from Safari. | Working; tested at iPhone 13 size, light and dark |
| `web/schools.json` | Requirements for all 10 Canadian DDS/DMD programs, each value tagged official / 3rd-party / prior cycle / unverified | Researched 2026-11-18 |
| `ios/DentPath/` | Native SwiftUI source using the same JSON | Not compiled (no Xcode in build environment) |
| `docs/PROJECT_PLAN.md` | PMI-style charter, WBS, risks, data gaps, phase 2 | — |

Run locally:

```bash
cd dentapply/web && python3 -m http.server 8000
# open http://localhost:8000 (schools.json must be served, not opened as a file)
```

Install on iPhone: deploy `web/` to any HTTPS host, open in Safari → Share → Add to Home Screen.

Not affiliated with the University of Ottawa or any dental faculty. Confirm every requirement on the school's own site.
