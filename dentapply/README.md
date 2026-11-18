# DentPath – dental school planner for Canadian pre-dental students

| Folder | What it is | State |
|---|---|---|
| `web/` | The app (PWA): `index.html`, `logic.js`, `schools.json` (schema v2) | Beta. Canada: 10 schools as *draft* (unverified). US/UK/AU/IE: coming soon |
| `web/schema/` | JSON Schema for school records | v2 |
| `tests/` | Unit tests (`logic.test.js`) and UI tests (`ui.test.mjs`) | 21 + 16 passing |
| `tools/` | Data validator, v1→v2 migration | — |
| `ios/DentPath/` | SwiftUI source | Not compiled; still on schema v1, update after beta |
| `docs/` | Master prompt, G0 charter, G1 plan, G2 report, legal drafts | — |

## Commands (from `dentapply/`)

```bash
npm test              # unit tests
npm run test:ui       # UI tests (Playwright + Chromium)
npm run validate      # schools.json vs schema
npm run serve         # http://localhost:8000
```

## Deploy on Vercel

1. Vercel → Add New Project → import `gribismailai-cmd/smile.ai`.
2. **Root Directory: `dentapply/web`**. Framework preset: Other. No build command, no output directory.
3. Deploy. `web/vercel.json` sets no-cache on data and the service worker plus security headers.
4. On iPhone: open the URL in Safari → Share → Add to Home Screen.

## Releasing data

1. Update `web/schools.json`; set a school's `status` to `verified` only when every Must field was checked on the official page this cycle.
2. Run `npm run validate && npm test && npm run test:ui`.
3. Bump `VERSION` in `web/sw.js` so installed copies fetch the new data.
4. For launch, set `RELEASE_MODE = "launch"` in `web/index.html`: draft schools then show as "Coming soon".

Independent project. Not affiliated with any university or dental faculty.
