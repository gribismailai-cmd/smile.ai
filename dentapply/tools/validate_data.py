"""Validate web/schools.json against web/schema/school.schema.json. Run: python3 -I tools/validate_data.py"""
import json, sys, pathlib
from jsonschema import Draft202012Validator
root = pathlib.Path(__file__).resolve().parent.parent
schema = json.loads((root / "web/schema/school.schema.json").read_text())
data = json.loads((root / "web/schools.json").read_text())
v = Draft202012Validator(schema)
errors = [(s["id"], e.message, list(e.path)) for s in data["schools"] for e in v.iter_errors(s)]

# Release rule: a "verified" school must have every Must field checked by a person, on an official page, this cycle.
MUST = ["deadline", "eligibilityForCanadians", "datRequired", "gpaMinimum", "casper"]
cycle = data["meta"]["currentCycle"]
for s in data["schools"]:
    if s["status"] != "verified":
        continue
    for k in MUST:
        f = s["fields"].get(k, {})
        if f.get("confidence") != "official":
            errors.append((s["id"], f"verified school: {k} confidence is {f.get('confidence')!r}, needs 'official'", [k]))
        if f.get("cycle") != cycle:
            errors.append((s["id"], f"verified school: {k} cycle is {f.get('cycle')!r}, needs {cycle!r}", [k]))
        if "search-extract" in (f.get("checked_by") or ""):
            errors.append((s["id"], f"verified school: {k} was not checked by a person", [k]))
for e in errors: print("INVALID", *e)
print(f"{len(data['schools'])} schools checked, {len(errors)} errors")
sys.exit(1 if errors else 0)
