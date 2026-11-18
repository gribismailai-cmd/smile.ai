// UI tests: the 4 main flows on an iPhone-size screen, light and dark.
// Run: node tests/ui.test.mjs   (serves web/ on a local port; needs Playwright with Chromium)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const WEB = fileURLToPath(new URL("../web/", import.meta.url));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const server = createServer(async (req, res) => {
  const p = normalize(join(WEB, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(WEB)) { res.writeHead(403).end(); return; }
  try { const f = p.endsWith("/") ? join(p, "index.html") : p; res.writeHead(200, { "content-type": TYPES[extname(f)] || "application/octet-stream" }).end(await readFile(f)); }
  catch { res.writeHead(404).end(); }
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

const results = []; let failed = 0;
async function check(name, fn) {
  try { await fn(); results.push(`ok   ${name}`); } catch (e) { failed++; results.push(`FAIL ${name}\n     ${e.message.split("\n")[0]}`); }
}

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ ...devices["iPhone 13"], colorScheme: scheme });
  const page = await ctx.newPage();
  const errors = []; const external = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => m.type() === "error" && errors.push(m.text()));
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1")) external.push(r.url()); });
  const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, "horizontal overflow");

  await check(`${scheme}: Home loads with deadlines, readiness and coverage`, async () => {
    await page.goto(BASE + "#home");
    await page.waitForSelector("#nextList .row");
    assert.ok(await page.isVisible("[data-view=home]"));
    assert.ok(!(await page.isVisible("[data-view=schools]")), "other views hidden");
    assert.equal(await page.locator("#coverage .row").count(), 5);
    await noOverflow();
  });
  await check(`${scheme}: Schools – Canada list, school detail with sources, report an error`, async () => {
    await page.click(".tab[data-go=schools]");
    assert.equal(await page.locator("#schoolGrid .school").count(), 10);
    await page.click('.school[data-id="western"]');
    await page.waitForSelector("#sheet.open");
    assert.ok(await page.locator("#sheetIn a", { hasText: "source" }).count() > 0, "source links shown");
    await page.locator("#sheetIn [data-report]").first().click();
    const txt = await page.inputValue("#reportText");
    assert.match(txt, /School: Western University/);
    await page.click("#closeSheet");
    await noOverflow();
  });
  await check(`${scheme}: Schools – US shows Coming soon, no requirement values`, async () => {
    await page.click('[data-country="US"]');
    await page.waitForSelector(".cs-card");
    assert.match(await page.textContent(".cs-card"), /Coming soon/);
    assert.match(await page.textContent(".cs-card"), /79 schools/);
    await page.click('[data-country="CA"]');
  });
  await check(`${scheme}: Fit – lowering GPA below 3.00 marks Western Below minimum`, async () => {
    await page.click(".tab[data-go=fit]");
    await page.fill("#f-gpa", "2.9"); await page.dispatchEvent("#f-gpa", "change");
    const row = page.locator(".fitrow", { hasText: "Western" });
    assert.match(await row.textContent(), /Below minimum/);
    await page.fill("#f-gpa", "3.8"); await page.dispatchEvent("#f-gpa", "change");
    await noOverflow();
  });
  await check(`${scheme}: Fit – province change makes Laval eligible for Quebec`, async () => {
    await page.selectOption("#f-prov", "QC");
    assert.doesNotMatch(await page.locator(".fitrow", { hasText: "Laval" }).textContent(), /Not eligible/);
    await page.selectOption("#f-prov", "ON");
    assert.match(await page.locator(".fitrow", { hasText: "Laval" }).textContent(), /Not eligible/);
  });
  await check(`${scheme}: Plan – checklist tick persists after reload`, async () => {
    await page.click(".tab[data-go=plan]");
    await page.check("#c-casper");
    await page.reload(); await page.waitForSelector("#checklist .check");
    assert.ok(await page.isChecked("#c-casper"));
    assert.ok(await page.locator("#timeline .row").count() > 5);
    await noOverflow();
  });
  await check(`${scheme}: Legal pages reachable within 2 taps`, async () => {
    await page.click(".tab[data-go=home]");
    await page.locator("[data-view=home] [data-legal=privacy]").click();
    assert.match(await page.textContent("#sheetIn"), /What we collect/);
    await page.click("#closeSheet");
  });
  await check(`${scheme}: no console errors and no third-party requests`, async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  });
  await page.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/${scheme}-home.png` : "/dev/null" }).catch(() => {});
  await ctx.close();
}
await browser.close(); server.close();
console.log(results.join("\n"));
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
