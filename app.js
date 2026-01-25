const STATIONS_URL="stations.geo.json";
const PRICES_URL="prices.json";
function haversineKm(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}
async function loadJson(url){
  const res=await fetch(url,{cache:"no-store"});
  if(!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return await res.json();
}
async function getLocationOnce(){
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation) return reject(new Error("no geolocation"));
    navigator.geolocation.getCurrentPosition(
      p=>resolve({lat:p.coords.latitude, lon:p.coords.longitude}),
      e=>reject(e),
      {enableHighAccuracy:true, timeout:12000, maximumAge:300000}
    );
  });
}
function navLink(lat,lon,title){
  if(typeof lat==="number" && typeof lon==="number"){
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;
}
function setStatus(t){document.getElementById("status").textContent=t;}
function render(stations, prices){
  const list=document.getElementById("list");
  list.innerHTML="";
  stations.forEach(s=>{
    const p=prices?.stations?.[s.id] || {};
    const diesel=p.diesel ?? "—";
    const dist=(typeof s.distance_km==="number") ? `${s.distance_km.toFixed(1)} km` : "—";
    const link=navLink(s.lat,s.lon,s.title||s.raw_name_address);
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <div class="name">${s.title || s.raw_name_address}</div>
      <div class="meta">
        <span class="badge">📍 ${dist}</span>
        <span class="badge">⛽ Diesel: ${diesel} €</span>
      </div>
      <div class="actions">
        <a class="linkbtn" target="_blank" rel="noopener" href="${link}">🧭 Google Maps Navigation</a>
      </div>
    `;
    list.appendChild(card);
  });
}
async function main(){
  setStatus("Lade Daten…");
  const stations=await loadJson(STATIONS_URL);
  let prices={};
  try{ prices=await loadJson(PRICES_URL);}catch(e){ prices={}; }
  let user=null;
  try{ user=await getLocationOnce(); }catch(e){ user=null; }
  const withDist=stations.map(s=>{
    if(user && typeof s.lat==="number" && typeof s.lon==="number"){
      return {...s, distance_km:haversineKm(user.lat,user.lon,s.lat,s.lon)};
    }
    return {...s, distance_km:null};
  }).sort((a,b)=>{
    if(a.distance_km==null && b.distance_km==null) return 0;
    if(a.distance_km==null) return 1;
    if(b.distance_km==null) return -1;
    return a.distance_km-b.distance_km;
  });
  setStatus(`Aktualisiert: ${new Date().toLocaleString("de-DE")} · ${withDist.length} Tankstellen`);
  render(withDist, prices);
}
document.getElementById("btnLocate").addEventListener("click", ()=>main().catch(()=>setStatus("Fehler beim Laden/Standort")));
main().catch(()=>setStatus("Fehler beim Laden/Standort"));
