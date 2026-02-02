const JSON_FILE = './tankstellen.json';

const el = {
  status: document.getElementById('status'),
  error: document.getElementById('error'),
  root: document.getElementById('stations'),
  q: document.getElementById('q'),
  sort: document.getElementById('sort'),
  onlyOpen: document.getElementById('onlyOpen'),
};

let ALL = [];

function norm(s){ return (s ?? '').toString().toLowerCase().trim(); }

function is247(openStr){
  const t = norm(openStr).replace(/\s/g,'');
  return t.includes('24') || t === '00.00-24.00' || t === '00:00-24:00' || t === '00.00-00.00';
}

function fmtPrice(v){
  if (v === null || v === undefined || v === '') return '-';
  const n = Number(v);
  if (Number.isNaN(n)) return '-';
  return n.toFixed(3).replace('.', ',');
}

function minOf(obj){
  const vals = Object.values(obj || {}).filter(v => typeof v === 'number' && !Number.isNaN(v));
  if (!vals.length) return Infinity;
  return Math.min(...vals);
}

function badge(label, ok){
  return `<span class="pill ${ok ? '' : 'off'}">${ok ? '✅' : '—'} ${label}</span>`;
}

function getAkzeptanz(a){
  const as24 = !!a?.as24_karte;
  const eurowag = !!a?.eurowag_karte;
  const gutmann = !!(a?.gutmann_karte ?? a?.gutmann_lieferant);
  return { as24, eurowag, gutmann };
}

function render(list){
  el.root.innerHTML = '';

  if (!list.length){
    el.root.innerHTML = `<div class="error">Keine Treffer.</div>`;
    return;
  }

  const frag = document.createDocumentFragment();

  for (const s of list){
    const diesel = s.preise?.diesel || {};
    const adblue = s.preise?.adblue || {};
    const akz = getAkzeptanz(s.akzeptanz);

    const openTxt = s.oeffnungszeiten ?? '-';
    const openTag = is247(openTxt) ? `<span class="tag">24/7</span>` : `<span class="tag">⏱ ${openTxt}</span>`;

    const minDiesel = minOf(diesel);
    const minAdblue = minOf(adblue);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <div class="card-title">${s.name ?? '-'}</div>
        <div class="card-sub">${s.adresse ?? '-'}</div>
      </div>

      <div class="card-body">
        <div class="row">
          ${openTag}
          <span class="tag">Best Diesel: ${minDiesel === Infinity ? '-' : fmtPrice(minDiesel)} €</span>
        </div>

        <div class="row">
          ${badge('AS24', akz.as24)}
          ${badge('Eurowag', akz.eurowag)}
          ${badge('Gutmann', akz.gutmann)}
        </div>

        <div class="pricebox">
          <h4>Diesel</h4>
          <div class="pricegrid">
            <div class="kv"><span>AS24</span><b>${fmtPrice(diesel.as24)} €</b></div>
            <div class="kv"><span>Eurowag</span><b>${fmtPrice(diesel.eurowag)} €</b></div>
            <div class="kv"><span>Gutmann</span><b>${fmtPrice(diesel.gutmann)} €</b></div>
            <div class="kv"><span>Best</span><b>${minDiesel === Infinity ? '-' : fmtPrice(minDiesel)} €</b></div>
          </div>
        </div>

        <div class="pricebox">
          <h4>AdBlue</h4>
          <div class="pricegrid">
            <div class="kv"><span>AS24</span><b>${fmtPrice(adblue.as24)} €</b></div>
            <div class="kv"><span>Eurowag</span><b>${fmtPrice(adblue.eurowag)} €</b></div>
            <div class="kv"><span>Gutmann</span><b>${fmtPrice(adblue.gutmann)} €</b></div>
            <div class="kv"><span>Best</span><b>${minAdblue === Infinity ? '-' : fmtPrice(minAdblue)} €</b></div>
          </div>
        </div>
      </div>
    `;

    frag.appendChild(card);
  }

  el.root.appendChild(frag);
}

function apply(){
  const q = norm(el.q.value);
  const only247 = el.onlyOpen.checked;
  const sortMode = el.sort.value;

  let list = ALL.slice();

  if (q){
    list = list.filter(s =>
      norm(s.name).includes(q) ||
      norm(s.adresse).includes(q)
    );
  }

  if (only247){
    list = list.filter(s => is247(s.oeffnungszeiten));
  }

  if (sortMode === 'name_asc'){
    list.sort((a,b) => (a.name ?? '').localeCompare((b.name ?? ''), 'de'));
  } else if (sortMode === 'diesel_asc'){
    list.sort((a,b) => minOf(a.preise?.diesel) - minOf(b.preise?.diesel));
  } else if (sortMode === 'adblue_asc'){
    list.sort((a,b) => minOf(a.preise?.adblue) - minOf(b.preise?.adblue));
  }

  el.status.textContent = `Stationen: ${list.length} / ${ALL.length}`;
  render(list);
}

async function load(){
  try{
    el.error.hidden = true;
    el.status.textContent = 'lade Daten…';

    const r = await fetch(JSON_FILE, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);

    const data = await r.json();
    if (!data || !Array.isArray(data.stations)) throw new Error('JSON-Format: stations[] fehlt');

    ALL = data.stations;

    el.q.addEventListener('input', apply);
    el.sort.addEventListener('change', apply);
    el.onlyOpen.addEventListener('change', apply);

    apply();
  } catch (e){
    el.error.hidden = false;
    el.error.textContent = 'FEHLER: JSON nicht geladen (' + (e?.message ?? e) + ')';
    el.status.textContent = 'Fehler';
    console.error(e);
  }
}

load();
