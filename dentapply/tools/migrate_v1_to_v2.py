"""One-time migration of web/schools.json from v1 (flat) to v2 (per-field provenance).
Run: python3 -I tools/migrate_v1_to_v2.py web/schools.json web/schools.v2.json
"""
import json, sys

CHECKED_ON = "2026-11-18"
CHECKED_BY = "search-extract (not owner-verified)"
CYCLE = "Fall 2027"
PROV = {"uoft": "ON", "western": "ON", "mcgill": "QC", "udem": "QC", "laval": "QC",
        "ubc": "BC", "ualberta": "AB", "usask": "SK", "umanitoba": "MB", "dal": "NS"}

def field(value, url, conf, note=None, **extra):
    f = {"value": value, "source_url": url, "checked_on": CHECKED_ON, "checked_by": CHECKED_BY,
         "confidence": conf, "cycle": CYCLE}
    if note: f["note"] = note
    f.update(extra)
    return f

def date_field(d, url, label=None):
    if not d or not d.get("month"):
        out = field(None, url, "unknown", (d or {}).get("note"))
    else:
        entry_year_item = "completed" in (label or "").lower() or "entry" in (d.get("note") or "").lower()
        y = d.get("year") or (2027 if d["month"] < 7 or entry_year_item else 2026)  # Fall 2027 cycle
        out = field(f"{y:04d}-{d['month']:02d}-{d['day']:02d}", url, d["confidence"], d.get("note") or None,
                    recurring=not d.get("year"))
    if label: out["label"] = label
    return out

def main(src, dst):
    v1 = json.load(open(src))
    schools = []
    for s in v1["schools"]:
        off = [x for x in s["sources"] if x["tier"] == "official"]
        url = (off[0] if off else s["sources"][0])["url"]
        dat = s["dat"]
        f = {
            "deadline": date_field(s["deadline"], url, (s["deadline"] or {}).get("label", "Application")),
            "eligibilityForCanadians": field(s["ontarioStatusNote"], url, "official" if s["ontarioStatus"] == "not-eligible" else "third-party" if s["id"] == "mcgill" else "official"),
            "gpaMinimum": field(s["gpaMin"], url, s["gpaMinConfidence"], scale="OMSAS 4.0"),
            "gpaCompetitive": field(s["gpaCompetitive"], url if s["gpaCompetitive"] is None else next((x["url"] for x in s["sources"] if "utsc" in x["url"]), url),
                                    s["gpaCompetitiveConfidence"], s.get("gpaCompetitiveNote") or None, scale="OMSAS 4.0"),
            "datRequired": field(dat["required"], url, dat["confidence"]),
            "tests": field(dat["rule"] or None, url, dat["confidence"]),
            "testMinimum": field(dat.get("minimum"), url, dat["confidence"] if dat.get("minimum") is not None else "unknown",
                                 "Out-of-province cut-off; school uses its own DAT average" if dat.get("minimum") else None,
                                 approximate=bool(dat.get("minimumIsApprox"))),
            "testReference": field(dat.get("reference"), url, "third-party" if dat.get("reference") else "unknown",
                                   "Older reported out-of-province cut-off (2020)" if dat.get("reference") else None),
            "casper": field(s["casper"]["required"], url, s["casper"]["confidence"]),
            "seatsTotal": field(s["seats"], url, s["seatsConfidence"]),
            "seatsForOutOfProvince": field(s.get("outOfProvinceSeats"), url, s["seatsConfidence"] if s.get("outOfProvinceSeats") is not None else "unknown"),
            "interview": field(s.get("interview") or None, url, "official" if s.get("interview") else "unknown"),
        }
        schools.append({
            "id": s["id"], "name": s["name"], "short": s["short"], "country": "CA", "region": PROV[s["id"]],
            "city": s["city"], "degree": s["degree"], "language": s["language"],
            "status": "draft", "applicationSystem": "direct",
            "applicationRoute": s.get("applicationRoute"),
            "residencyRestrictedTo": ["QC"] if s["id"] == "laval" else None,
            "requires120Credits": bool(s.get("requires120Credits")),
            "applicantsPerYear": s.get("applicantsPerYear"),
            "fields": f,
            "otherDates": [date_field(d, url, d["label"]) for d in s.get("otherDates", [])],
            "sources": s["sources"],
        })
    out = {
        "schemaVersion": 2,
        "meta": {"researchedOn": CHECKED_ON, "currentCycle": CYCLE,
                 "statusMeaning": {"verified": "Owner checked every Must field on the official page this cycle",
                                   "draft": "From search extracts; shown in beta with an Unverified label; hidden at launch",
                                   "coming-soon": "No requirement data shown"},
                 "gpaScale": "OMSAS 4.0", "disclaimer": v1["meta"]["method"]},
        "countries": [
            {"code": "CA", "name": "Canada", "schoolCount": 10, "countConfidence": "official", "countSource": "https://www.ada.org/en/resources/research/health-policy-institute/dental-education", "status": "listed"},
            {"code": "US", "name": "United States", "schoolCount": 79, "countConfidence": "official", "countSource": "https://www.ada.org/en/resources/research/health-policy-institute/dental-education", "status": "coming-soon", "note": "Applications through AADSAS; US DAT"},
            {"code": "UK", "name": "United Kingdom", "schoolCount": 18, "countConfidence": "third-party", "countSource": "https://www.leadingtuition.co.uk/dental-schools/", "status": "coming-soon", "note": "Applications through UCAS; UCAT"},
            {"code": "AU", "name": "Australia", "schoolCount": None, "countRange": "7-9", "countConfidence": "unknown", "countSource": "https://www.adc.org.au/accreditation/", "status": "coming-soon", "note": "Undergraduate (UCAT ANZ) or graduate entry (GAMSAT/DAT)"},
            {"code": "IE", "name": "Ireland", "schoolCount": 2, "countConfidence": "official", "countSource": "https://www.tcd.ie/courses/undergraduate/courses/dental-science", "status": "coming-soon", "note": "Trinity College Dublin and University College Cork; apply to each school directly"},
        ],
        "schools": schools,
        "resources": v1["resources"],
    }
    json.dump(out, open(dst, "w"), indent=2, ensure_ascii=False)
    print(f"wrote {len(schools)} schools to {dst}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
