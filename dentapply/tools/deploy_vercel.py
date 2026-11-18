"""Deploy dentapply/web to Vercel production via the REST API (no CLI).
The Vercel token is injected by the session's network proxy; none is read here.
Run: python3 -I tools/deploy_vercel.py
"""
import base64, json, pathlib, sys, time, urllib.request

WEB = pathlib.Path(__file__).resolve().parent.parent / "web"
FILES = ["index.html", "logic.js", "schools.json", "sw.js", "manifest.webmanifest",
         "icon.svg", "icon-180.png", "icon-512.png", "vercel.json"]

def api(method, path, body=None):
    req = urllib.request.Request("https://api.vercel.com" + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Content-Type": "application/json", "Authorization": "Bearer proxy-injected"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")

files = [{"file": f, "data": base64.b64encode((WEB / f).read_bytes()).decode(), "encoding": "base64"} for f in FILES]
status, d = api("POST", "/v13/deployments?skipAutoDetectionConfirmation=1", {
    "name": "dentpath", "target": "production", "files": files,
    "projectSettings": {"framework": None, "buildCommand": None, "outputDirectory": None, "installCommand": None}})
if status >= 300:
    print("deploy failed", status, json.dumps(d)[:500]); sys.exit(1)
dep_id = d["id"]
print("deployment", dep_id, "state", d.get("readyState"))
for _ in range(60):
    s, d = api("GET", f"/v13/deployments/{dep_id}")
    if d.get("readyState") in ("READY", "ERROR", "CANCELED"):
        break
    time.sleep(3)
print("state", d.get("readyState"))
print("aliases", d.get("alias"))
print("url", "https://" + d.get("url", ""))
sys.exit(0 if d.get("readyState") == "READY" else 1)
