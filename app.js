fetch('./tankstellen_preise_kw6_50.json')
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    const root = document.getElementById('stations');
    data.stations.forEach(s => {
      const d = s.preise?.diesel || {};
      const a = s.preise?.adblue || {};
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <strong>${s.name}</strong><br>
        ${s.adresse}<br>
        Diesel AS24: ${d.as24 ?? '-'} €<br>
        Diesel Eurowag: ${d.eurowag ?? '-'} €<br>
        AdBlue AS24: ${a.as24 ?? '-'} €<br>
        AdBlue Eurowag: ${a.eurowag ?? '-'} €
      `;
      root.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById('error').innerText = 'FEHLER: JSON nicht geladen';
    console.error(err);
  });
