"""Validate web/schools.json against web/schema/school.schema.json. Run: python3 -I tools/validate_data.py"""
import json, sys, pathlib
from jsonschema import Draft202012Validator
root = pathlib.Path(__file__).resolve().parent.parent
schema = json.loads((root / "web/schema/school.schema.json").read_text())
data = json.loads((root / "web/schools.json").read_text())
v = Draft202012Validator(schema)
errors = [(s["id"], e.message, list(e.path)) for s in data["schools"] for e in v.iter_errors(s)]
for e in errors: print("INVALID", *e)
print(f"{len(data['schools'])} schools checked, {len(errors)} errors")
sys.exit(1 if errors else 0)
