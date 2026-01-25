import os, json, requests
from datetime import datetime, timezone

API_KEY=os.environ.get("TANKKOENIG_API_KEY","")
LIST="https://creativecommons.tankerkoenig.de/json/list.php"
DETAIL="https://creativecommons.tankerkoenig.de/json/detail.php"

stations=json.load(open("stations.geo.json","r",encoding="utf-8"))
prices=json.load(open("prices.json","r",encoding="utf-8"))
now=datetime.now(timezone.utc).isoformat()
prices["generated_at_utc"]=now

for s in stations:
    if "deutschland" not in (s.get("region") or "").lower(): continue
    lat=s.get("lat"); lon=s.get("lon")
    if not isinstance(lat,(int,float)): continue
    try:
        r=requests.get(LIST, params={"lat":lat,"lng":lon,"rad":15,"sort":"dist","type":"all","apikey":API_KEY}, timeout=30).json()
        if r.get("ok") and r.get("stations"):
            sid=r["stations"][0]["id"]
            d=requests.get(DETAIL, params={"id":sid,"apikey":API_KEY}, timeout=30).json()
            if d.get("ok"):
                diesel=d.get("station",{}).get("price",{}).get("diesel")
                if diesel is not None:
                    prices["stations"].setdefault(s["id"],{})["diesel"]=diesel
                    prices["stations"][s["id"]]["updated_at_utc"]=now
    except Exception:
        pass

json.dump(prices, open("prices.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
