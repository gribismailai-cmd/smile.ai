/* DentPath business logic. Pure functions, no DOM.
   Loaded by index.html as a classic script (window.DentLogic) and by Node tests (module.exports).
   Keep ios/DentPath/Models.swift evaluate() in step with evaluate() here. */
(function (root) {
  "use strict";

  const MS_DAY = 86400000;

  /* OMSAS 4.0 values for letter grades. Not yet checked against the OUAC row for each university. */
  const OMSAS = { "A+": 4.0, "A": 3.9, "A-": 3.7, "B+": 3.3, "B": 3.0, "C+": 2.3, "C": 2.0, "D+": 1.3, "D": 1.0, "E": 0.0, "F": 0.0 };

  const PROVINCES = [
    ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"], ["NB", "New Brunswick"],
    ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"], ["NT", "Northwest Territories"],
    ["NU", "Nunavut"], ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"],
    ["SK", "Saskatchewan"], ["YT", "Yukon"]
  ];

  function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function parseISO(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  /** Next occurrence of a dated field on or after today. Dates that have passed roll forward one
      year at a time and are marked projected, because the school has not confirmed next year's date. */
  function nextOccurrence(field, today) {
    const base = parseISO(field && field.value);
    if (!base) return null;
    const t = startOfDay(today);
    let d = base, rolled = false;
    while (d < t) { d = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()); rolled = true; }
    return { date: d, projected: rolled || !!field.recurring, days: Math.round((d - t) / MS_DAY) };
  }

  /** Is a school's data shown? 'beta' shows draft + verified; 'launch' shows verified only. */
  function isVisible(school, mode) {
    if (school.status === "verified") return true;
    return mode === "beta" && school.status === "draft";
  }

  /** How a Canadian applicant from `province` relates to a school. */
  function access(school, province) {
    const r = school.residencyRestrictedTo;
    if (Array.isArray(r) && r.length && !r.includes(province)) return "not-eligible";
    if (school.country === "CA" && school.region === province) return "home";
    return "out-of-province";
  }

  const RANK = { ok: 0, info: 1, warn: 2, bad: 3 };

  /** Compare a profile with published minimums only. Never predicts admission. */
  function evaluate(school, p, mode) {
    if (!isVisible(school, mode)) return { level: "info", label: "Coming soon", reasons: ["Requirements not yet verified."] };
    const f = school.fields;
    const reasons = []; let level = "ok"; let checked = 0;
    const bump = l => { if (RANK[l] > RANK[level]) level = l; };
    const a = access(school, p.province);
    if (a === "not-eligible") return { level: "bad", label: "Not eligible", reasons: [f.eligibilityForCanadians.value || "Residency restriction."] };
    let blocked = false;
    if (school.language === "French" && !p.french) { reasons.push("Program taught in French."); bump("bad"); blocked = true; }
    if (school.requires120Credits && !p.c120) { reasons.push("Needs a 120-credit bachelor's by July 31 of entry year."); bump("bad"); blocked = true; }
    const gmin = f.gpaMinimum && f.gpaMinimum.value;
    if (gmin != null) {
      checked++;
      if (p.gpa < gmin) { reasons.push(`GPA ${p.gpa.toFixed(2)} is below the ${gmin.toFixed(2)} minimum.`); bump("bad"); }
      else {
        const gc = f.gpaCompetitive && f.gpaCompetitive.value;
        if (gc != null && p.gpa < gc) { reasons.push(`Meets minimum; below the ~${gc.toFixed(2)} typical of interviewees (3rd-party).`); bump("info"); }
      }
    }
    const tmin = f.testMinimum && f.testMinimum.value;
    if (tmin != null && a !== "home") {
      checked++;
      if (p.aa < tmin) { reasons.push(`DAT AA ${p.aa} is below the ${tmin} out-of-province cut-off${f.testMinimum.approximate ? " (school uses its own average; approximate)" : ""}.`); bump("bad"); }
    }
    const tref = f.testReference && f.testReference.value;
    if (tref != null && a !== "home" && p.aa < tref) { reasons.push(`DAT AA below an older reported cut-off of ${tref} (3rd-party, 2020).`); bump("info"); }
    if (f.casper && f.casper.value === true && !p.casper) { reasons.push("CASPer required and not yet done."); bump("warn"); }
    if (a === "out-of-province" && level !== "bad" && f.eligibilityForCanadians.value) reasons.push(f.eligibilityForCanadians.value);
    let label = { ok: "Meets published minimums", info: "Meets minimums", warn: "Action needed", bad: "Below minimum" }[level];
    if (level === "bad" && blocked) label = "Blocked";
    if (checked === 0 && RANK[level] <= RANK.info) {
      level = "info"; label = "No minimum published";
      reasons.unshift("No GPA or DAT minimum found in research. Verify on the school site.");
    }
    return { level, label, reasons };
  }

  /** How many deadlines of the cycle that started this calendar year have passed. */
  function cycleStatus(schools, province, today, mode) {
    const t = startOfDay(today), y = t.getFullYear();
    const known = schools.filter(s => isVisible(s, mode) && access(s, province) !== "not-eligible" && parseISO(s.fields.deadline.value));
    const closed = known.filter(s => {
      const d = parseISO(s.fields.deadline.value);
      return new Date(y, d.getMonth(), d.getDate()) < t;
    });
    return { year: y, known: known.length, closed: closed.length };
  }

  /** Every dated step for visible schools the applicant can apply to, soonest first. */
  function deadlineEvents(schools, province, today, mode) {
    const ev = [];
    for (const s of schools) {
      if (!isVisible(s, mode) || access(s, province) === "not-eligible") continue;
      const all = [Object.assign({ main: true }, s.fields.deadline)].concat(s.otherDates || []);
      for (const d of all) {
        const n = nextOccurrence(d, today);
        if (n) ev.push(Object.assign({ school: s, field: d, main: !!d.main }, n));
      }
    }
    return ev.sort((a, b) => a.date - b.date);
  }

  /** Credit-weighted GPA on the OMSAS 4.0 scale. Rows: [{g:"A", c:3}]. */
  function gpa(rows) {
    let pts = 0, cr = 0;
    for (const r of rows) {
      const c = Number(r.c);
      if (c > 0 && r.g in OMSAS) { pts += OMSAS[r.g] * c; cr += c; }
    }
    return { gpa: cr ? pts / cr : 0, credits: cr };
  }

  /** Plain-text data-error report a student can paste into a message. */
  function errorReport(school, fieldKey, today) {
    const f = school.fields[fieldKey] || {};
    return [
      `DentPath data report`,
      `School: ${school.name} (${school.id})`,
      `Field: ${fieldKey}`,
      `App shows: ${f.value === null || f.value === undefined ? "(blank)" : f.value}`,
      `App source: ${f.source_url || "(none)"}`,
      `Checked on: ${f.checked_on || "(unknown)"}`,
      `Correct value: `,
      `Where I found it (link): `,
      `Reported: ${startOfDay(today).toISOString().slice(0, 10)}`
    ].join("\n");
  }

  const api = { OMSAS, PROVINCES, parseISO, nextOccurrence, isVisible, access, evaluate, cycleStatus, deadlineEvents, gpa, errorReport };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DentLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
