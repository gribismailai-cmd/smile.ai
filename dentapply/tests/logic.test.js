// Unit tests for web/logic.js. Run: node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../web/logic.js");
const DATA = require("../web/schools.json");

const S = id => DATA.schools.find(s => s.id === id);
const base = { province: "ON", gpa: 3.8, aa: 20, pat: 20, casper: true, french: false, c120: true };
const d = (y, m, day) => new Date(y, m - 1, day);

test("nextOccurrence: future explicit date is not projected", () => {
  const r = L.nextOccurrence({ value: "2026-12-01", recurring: false }, d(2026, 11, 18));
  assert.equal(r.date.getTime(), d(2026, 12, 1).getTime());
  assert.equal(r.projected, false);
  assert.equal(r.days, 13);
});
test("nextOccurrence: passed date rolls one year and is projected", () => {
  const r = L.nextOccurrence({ value: "2026-10-10" }, d(2026, 11, 18));
  assert.equal(r.date.getTime(), d(2027, 10, 10).getTime());
  assert.equal(r.projected, true);
});
test("nextOccurrence: deadline today counts as 0 days, not passed", () => {
  const r = L.nextOccurrence({ value: "2026-11-01" }, new Date(2026, 10, 1, 15, 30));
  assert.equal(r.days, 0);
  assert.equal(r.projected, false);
});
test("nextOccurrence: null value returns null", () => {
  assert.equal(L.nextOccurrence({ value: null }, d(2026, 1, 1)), null);
});

test("access: home province, out-of-province and residency restriction", () => {
  assert.equal(L.access(S("uoft"), "ON"), "home");
  assert.equal(L.access(S("uoft"), "BC"), "out-of-province");
  assert.equal(L.access(S("laval"), "ON"), "not-eligible");
  assert.equal(L.access(S("laval"), "QC"), "home");
});

test("isVisible: draft shown in beta only", () => {
  const draft = { status: "draft" }, ver = { status: "verified" }, cs = { status: "coming-soon" };
  assert.equal(L.isVisible(draft, "beta"), true);
  assert.equal(L.isVisible(draft, "launch"), false);
  assert.equal(L.isVisible(ver, "launch"), true);
  assert.equal(L.isVisible(cs, "beta"), false);
});

test("evaluate: launch mode hides draft schools as Coming soon", () => {
  assert.equal(L.evaluate(S("uoft"), base, "launch").label, "Coming soon");
});
test("evaluate: GPA below published minimum", () => {
  const r = L.evaluate(S("western"), { ...base, gpa: 2.9 }, "beta");
  assert.equal(r.level, "bad");
  assert.match(r.reasons[0], /below the 3.00 minimum/);
});
test("evaluate: meets minimum but below typical interviewee GPA", () => {
  const r = L.evaluate(S("uoft"), { ...base, gpa: 3.5 }, "beta");
  assert.equal(r.level, "info");
  assert.equal(r.label, "Meets minimums");
});
test("evaluate: CASPer missing is an action", () => {
  assert.equal(L.evaluate(S("western"), { ...base, casper: false }, "beta").label, "Action needed");
});
test("evaluate: Laval not eligible for Ontario, evaluated for Quebec", () => {
  assert.equal(L.evaluate(S("laval"), base, "beta").label, "Not eligible");
  assert.notEqual(L.evaluate(S("laval"), { ...base, province: "QC", french: true }, "beta").label, "Not eligible");
});
test("evaluate: French program blocked without French", () => {
  assert.equal(L.evaluate(S("udem"), base, "beta").label, "Blocked");
});
test("evaluate: USask out-of-province DAT cut-off applies outside SK only", () => {
  assert.equal(L.evaluate(S("usask"), { ...base, aa: 20 }, "beta").label, "Below minimum");
  assert.notEqual(L.evaluate(S("usask"), { ...base, aa: 20, province: "SK" }, "beta").label, "Below minimum");
});
test("evaluate: school with no published minimum says so", () => {
  assert.equal(L.evaluate(S("ubc"), base, "beta").label, "No minimum published");
});

test("cycleStatus: all Fall 2027 deadlines closed on 2026-11-18", () => {
  const c = L.cycleStatus(DATA.schools, "ON", d(2026, 11, 18), "beta");
  assert.equal(c.known, c.closed);
  assert.ok(c.known >= 6);
});
test("cycleStatus: nothing closed on 2026-06-01", () => {
  assert.equal(L.cycleStatus(DATA.schools, "ON", d(2026, 6, 1), "beta").closed, 0);
});
test("deadlineEvents: sorted ascending and excludes ineligible schools", () => {
  const ev = L.deadlineEvents(DATA.schools, "ON", d(2026, 11, 18), "beta");
  for (let i = 1; i < ev.length; i++) assert.ok(ev[i].date >= ev[i - 1].date);
  assert.ok(!ev.some(e => e.school.id === "laval"));
});

test("gpa: credit-weighted OMSAS average", () => {
  const r = L.gpa([{ g: "A+", c: 3 }, { g: "B", c: 6 }]);
  assert.equal(r.credits, 9);
  assert.equal(r.gpa.toFixed(4), ((4.0 * 3 + 3.0 * 6) / 9).toFixed(4));
});
test("gpa: ignores zero credits and unknown grades", () => {
  assert.equal(L.gpa([{ g: "A", c: 0 }, { g: "Z", c: 3 }]).credits, 0);
});

test("errorReport: includes school, field, current value and source", () => {
  const t = L.errorReport(S("western"), "gpaMinimum", d(2026, 11, 18));
  assert.match(t, /Western University/);
  assert.match(t, /Field: gpaMinimum/);
  assert.match(t, /App shows: 3/);
  assert.match(t, /Reported: 2026-11-18/);
});

test("data: every school field has provenance", () => {
  for (const s of DATA.schools) for (const [k, f] of Object.entries(s.fields)) {
    assert.ok("value" in f, `${s.id}.${k} value`);
    assert.ok(f.checked_on && f.confidence && f.cycle, `${s.id}.${k} provenance`);
    if (f.value !== null) assert.ok(f.source_url, `${s.id}.${k} source_url`);
  }
});
