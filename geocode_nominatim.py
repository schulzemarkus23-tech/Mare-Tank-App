import json, time, requests
UA = "tankstellen-app/1.0"
BASE="https://nominatim.openstreetmap.org/search"
stations=json.load(open("stations.geo.json","r",encoding="utf-8"))
for s in stations:
    if isinstance(s.get("lat"), (int,float)) and isinstance(s.get("lon"), (int,float)):
        continue
    q = s.get("title") or s.get("raw_name_address") or ""
    if not q: continue
    try:
        r=requests.get(BASE, params={"q": q, "format":"json", "limit":1}, headers={"User-Agent": UA}, timeout=30)
        r.raise_for_status()
        data=r.json()
        if data:
            s["lat"]=float(data[0]["lat"])
            s["lon"]=float(data[0]["lon"])
    except Exception:
        pass
    time.sleep(1.2)
json.dump(stations, open("stations.geo.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
