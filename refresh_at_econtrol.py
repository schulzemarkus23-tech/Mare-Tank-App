# Simplified E-Control fetch (public endpoint)
import json, requests, math
from datetime import datetime, timezone

stations=json.load(open("stations.geo.json","r",encoding="utf-8"))
prices=json.load(open("prices.json","r",encoding="utf-8"))
URL="https://api.e-control.at/sprit/1.0/search/gas-stations/by-address"

def dist(a,b,c,d):
    R=6371
    import math
    dlat=math.radians(c-a); dlon=math.radians(d-b)
    x=math.sin(dlat/2)**2+math.cos(math.radians(a))*math.cos(math.radians(c))*math.sin(dlon/2)**2
    return R*(2*math.atan2(math.sqrt(x),math.sqrt(1-x)))

now=datetime.now(timezone.utc).isoformat()
prices["generated_at_utc"]=now

for s in stations:
    if "deutschland" in (s.get("region") or "").lower(): continue
    lat=s.get("lat"); lon=s.get("lon")
    if not isinstance(lat,(int,float)): continue
    try:
        r=requests.get(URL, params={"latitude":lat,"longitude":lon,"radius":10}, timeout=30)
        data=r.json()
        best=None; bestd=1e9
        for st in data.get("stations",[]):
            d=dist(lat,lon,st["latitude"],st["longitude"])
            if d<bestd:
                for f in st.get("fuels",[]):
                    if f.get("type")=="DIE":
                        best=f.get("amount"); bestd=d
        if best is not None:
            prices["stations"].setdefault(s["id"],{})["diesel"]=best
            prices["stations"][s["id"]]["updated_at_utc"]=now
    except Exception:
        pass

json.dump(prices, open("prices.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
