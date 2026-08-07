// ── ForestData — Logica de la maqueta ──
// NOTA: Todo este codigo es simulado. No hay backend real.

// ── NAVIGATION ──
let growthChartInst = null;
let detailMapInst   = null;

function navigate(page, treeId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(n => n.classList.add('active'));
  if (page === 'detail' && treeId) renderDetail(treeId);
  if (page === 'trees') renderTable();
  if (page === 'home') setTimeout(() => map && map.invalidateSize(), 50);
  if (page === 'register') resetRegister();
}

document.querySelectorAll('.nav-item:not(.disabled)').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.page));
});

// ── MAP ──
const map = L.map('map', { zoomControl: true, attributionControl: false })
  .setView([19.466, -101.872], 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
}).addTo(map);

function makeIcon(health, selected = false) {
  const c = HC[health];
  const ring = selected ? `<circle cx="10" cy="10" r="9" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/>` : '';
  return L.divIcon({
    className: '',
    html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      ${ring}
      <circle cx="10" cy="10" r="${selected?6:5}" fill="${c}" stroke="white" stroke-width="2"/>
    </svg>`,
    iconSize:[20,20], iconAnchor:[10,10], popupAnchor:[0,-12],
  });
}

const markerMap = {};
let activeMarkerId = null;

TREES.forEach(t => {
  const m = L.marker([t.lat, t.lng], { icon: makeIcon(t.health) }).addTo(map);
  m.bindPopup(`<div class="popup-inner">
    <div class="popup-name">${t.emoji} ${t.name}</div>
    <div class="popup-species">Arbol #${t.code} · ${t.zone}</div>
    <div class="popup-row"><span class="popup-lbl">Altura</span><span class="popup-val">${t.heightCm} cm</span></div>
    <div class="popup-row"><span class="popup-lbl">Edad</span><span class="popup-val">${t.days} dias</span></div>
    <div class="popup-row"><span class="popup-lbl">Estado</span><span class="popup-val" style="color:${HC[t.health]}">${HL[t.health]}</span></div>
    <div class="popup-divider"></div>
    <button class="popup-btn" onclick="navigate('detail','${t.id}')">Ver detalle completo</button>
  </div>`, { maxWidth: 220 });
  m.on('click', () => {
    if (activeMarkerId && markerMap[activeMarkerId]) {
      const prev = TREES.find(x => x.id === activeMarkerId);
      markerMap[activeMarkerId].setIcon(makeIcon(prev.health, false));
    }
    activeMarkerId = t.id;
    m.setIcon(makeIcon(t.health, true));
    map.panTo([t.lat, t.lng], { animate: true, duration: 0.5 });
  });
  markerMap[t.id] = m;
});

document.getElementById('btn-center').addEventListener('click', () => {
  map.flyTo([19.466, -101.872], 15, { duration: 1 });
});

// ── TABLE ──
let tableFilter = 'all', tableZone = 'all', tableSearch = '';

function renderTable() {
  const filtered = TREES.filter(t => {
    const mf = tableFilter === 'all' || t.health === tableFilter;
    const mz = tableZone === 'all' || t.zone === tableZone;
    const q  = tableSearch.toLowerCase();
    const ms = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.student.toLowerCase().includes(q);
    return mf && mz && ms;
  });
  document.getElementById('tree-count-label').textContent = `${filtered.length} registros`;
  document.getElementById('tree-tbody').innerHTML = filtered.map(t => {
    const recent = t.growth[t.growth.length-1] - t.growth[t.growth.length-2];
    return `<tr onclick="navigate('detail','${t.id}')">
      <td style="font-size:20px;width:36px;">${t.emoji}</td>
      <td class="td-name">${t.name}</td>
      <td style="color:var(--t3);font-size:11px;font-variant-numeric:tabular-nums;">#${t.code}</td>
      <td style="color:var(--t2);">${t.zone}</td>
      <td style="color:var(--t3);font-size:11px;">${t.student}</td>
      <td style="color:var(--t1);font-weight:600;font-variant-numeric:tabular-nums;">${t.heightCm} cm</td>
      <td style="color:var(--green);font-size:11px;font-variant-numeric:tabular-nums;">+${recent} cm/mes</td>
      <td><span class="chip-health ${t.health}">● ${HL[t.health]}</span></td>
      <td style="color:var(--t3);font-size:11px;">${t.lastCare}</td>
      <td><iconify-icon icon="ph:arrow-right" style="font-size:14px;color:var(--t3);"></iconify-icon></td>
    </tr>`;
  }).join('');
}

document.querySelectorAll('[data-tf]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tf]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tableFilter = btn.dataset.tf;
    renderTable();
  });
});
document.querySelectorAll('[data-tz]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tz]').forEach(b => { b.style.color=''; b.classList.remove('active'); });
    btn.classList.add('active'); btn.style.color = 'var(--green)';
    tableZone = btn.dataset.tz;
    renderTable();
  });
});
document.getElementById('table-search').addEventListener('input', e => {
  tableSearch = e.target.value; renderTable();
});

// ── DETAIL ──
function renderDetail(id) {
  const t = TREES.find(x => x.id === id);
  if (!t) return;
  document.getElementById('detail-topbar-name').textContent = `${t.name} #${t.code}`;
  const growth = t.heightCm - t.initialCm;

  document.getElementById('detail-left-content').innerHTML = `
    <div class="detail-hero">
      <div class="dh-top">
        <div class="dh-emoji">${t.emoji}</div>
        <div style="flex:1;min-width:0;">
          <div class="dh-name">${t.name}</div>
          <div class="dh-code">Arbol #${t.code} · ${t.zone} · ${t.student}</div>
          <div class="dh-chips">
            <span class="d-chip ${t.health}">● ${HL[t.health]}</span>
            <span class="d-chip ai"><iconify-icon icon="ph:sparkle" style="font-size:9px;"></iconify-icon>Analisis Gemini</span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="dg-cell"><div class="dg-lbl">ALTURA ACTUAL</div><div class="dg-val">${t.heightCm}<span class="unit"> cm</span></div></div>
      <div class="dg-cell"><div class="dg-lbl">CRECIMIENTO TOTAL</div><div class="dg-val" style="color:var(--green);">+${growth}<span class="unit"> cm</span></div></div>
      <div class="dg-cell"><div class="dg-lbl">EDAD</div><div class="dg-val">${t.days}<span class="unit"> dias</span></div></div>
      <div class="dg-cell"><div class="dg-lbl">ULTIMO CUIDADO</div><div class="dg-val" style="font-size:13px;padding-top:4px;">${t.lastCare}</div></div>
    </div>
    <div class="detail-section">
      <div class="ds-title">CONDICIONES ACTUALES</div>
      <div class="env-row">
        <div class="env-cell"><iconify-icon icon="ph:thermometer" style="font-size:15px;color:var(--t2);"></iconify-icon><div><div class="env-val">${t.env.temp}</div><div class="env-lbl">Temp.</div></div></div>
        <div class="env-cell"><iconify-icon icon="ph:drop" style="font-size:15px;color:var(--t2);"></iconify-icon><div><div class="env-val">${t.env.hum}</div><div class="env-lbl">Humedad</div></div></div>
        <div class="env-cell"><iconify-icon icon="ph:wind" style="font-size:15px;color:var(--t2);"></iconify-icon><div><div class="env-val">${t.env.wind}</div><div class="env-lbl">Viento</div></div></div>
      </div>
    </div>
    <div class="detail-section">
      <div class="ds-title">REGISTROS RECIENTES</div>
      <div class="log-list">
        ${t.logs.map(l => `<div class="log-item"><div class="log-date">${l.date}</div><div class="log-text">${l.text}</div></div>`).join('')}
      </div>
    </div>
    <div class="detail-action-row">
      <button class="btn-full green" onclick="navigate('register')">
        <iconify-icon icon="ph:plus-circle" style="font-size:14px;"></iconify-icon>Registrar cuidado
      </button>
      <button class="btn-full ghost">
        <iconify-icon icon="ph:qr-code" style="font-size:14px;"></iconify-icon>Ver QR
      </button>
    </div>
  `;

  // Chart
  if (growthChartInst) { growthChartInst.destroy(); growthChartInst = null; }
  const recentGrowth = t.growth[t.growth.length-1] - t.growth[t.growth.length-2];
  document.getElementById('chart-growth-tag').textContent = `+${recentGrowth} cm este mes`;
  const bc = HC[t.health];
  const bgMap = {'#16a34a':'rgba(22,163,74,0.08)','#d97706':'rgba(217,119,6,0.08)','#dc2626':'rgba(220,38,38,0.08)'};
  growthChartInst = new Chart(document.getElementById('growth-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        data: t.growth, borderColor: bc, backgroundColor: bgMap[bc],
        borderWidth: 2, fill: true, tension: 0.4,
        pointBackgroundColor: bc, pointBorderColor: '#fff', pointBorderWidth: 2,
        pointRadius: 4, pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor:'#fff', borderColor:'rgba(0,0,0,.1)', borderWidth:1, titleColor:'#111', bodyColor:'#6b7280', padding:8, callbacks:{ label: ctx => `${ctx.parsed.y} cm` } }
      },
      scales: {
        x: { grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#9ca3af', font:{size:10,family:'Inter'} } },
        y: { grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#9ca3af', font:{size:10,family:'Inter'}, callback: v => v+'cm' } }
      }
    }
  });

  // Mini-map
  setTimeout(() => {
    if (detailMapInst) { detailMapInst.remove(); detailMapInst = null; }
    detailMapInst = L.map('detail-map', { zoomControl: false, attributionControl: false })
      .setView([t.lat, t.lng], 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom:19 }).addTo(detailMapInst);
    TREES.filter(x => x.id !== t.id).forEach(x => {
      L.marker([x.lat, x.lng], { icon: makeIcon(x.health, false), opacity: 0.35 }).addTo(detailMapInst);
    });
    L.marker([t.lat, t.lng], { icon: makeIcon(t.health, true) }).addTo(detailMapInst);
  }, 60);
}

// ── REGISTER ──
let photoLoaded = false;

function resetRegister() {
  photoLoaded = false;
  const zone = document.getElementById('photo-upload-zone');
  zone.innerHTML = `
    <iconify-icon icon="ph:camera-plus" style="font-size:28px;color:var(--t3);"></iconify-icon>
    <div class="pu-label">Tomar foto o cargar desde galeria</div>
    <div class="pu-sub">La IA estima la altura usando la regla como referencia</div>`;
  zone.style.padding = '24px 20px';
  zone.style.borderStyle = 'dashed';
  zone.style.borderColor = '';
  document.getElementById('photo-placeholder').style.display = 'flex';
  document.getElementById('photo-loaded').style.display = 'none';
  document.getElementById('ai-idle').style.display = 'flex';
  document.getElementById('ai-loading').style.display = 'none';
  document.getElementById('ai-done').style.display = 'none';
  const btn = document.getElementById('btn-save-care');
  btn.innerHTML = `<iconify-icon icon="ph:sparkle" style="font-size:13px;"></iconify-icon>Analizar con IA y guardar`;
  btn.style.background = '';
}

function simulatePhotoSelect() {
  photoLoaded = true;
  const zone = document.getElementById('photo-upload-zone');
  zone.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--green);">
    <iconify-icon icon="ph:check-circle" style="font-size:18px;"></iconify-icon>
    <span style="font-size:13px;font-weight:500;">Foto cargada · Listo para analizar</span>
    <span style="font-size:11px;color:var(--t3);margin-left:4px;cursor:pointer;">Cambiar</span>
  </div>`;
  zone.style.padding = '12px 20px';
  zone.style.borderStyle = 'solid';
  zone.style.borderColor = 'rgba(22,163,74,.35)';
  document.getElementById('photo-placeholder').style.display = 'none';
  document.getElementById('photo-loaded').style.display = 'block';
}

function simulateAI() {
  if (!photoLoaded) simulatePhotoSelect();
  document.getElementById('ai-idle').style.display = 'none';
  document.getElementById('ai-loading').style.display = 'flex';
  document.getElementById('ai-done').style.display = 'none';
  setTimeout(() => {
    document.getElementById('ai-loading').style.display = 'none';
    document.getElementById('ai-done').style.display = 'flex';
    const btn = document.getElementById('btn-save-care');
    btn.innerHTML = `<iconify-icon icon="ph:check" style="font-size:13px;"></iconify-icon>Guardado correctamente`;
    btn.style.background = '#15803d';
  }, 2200);
}

// QR decorativo
(function(){
  const p = [1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,1,0,0,1,0,0,0,1,1,1,0,1,1,0,0,0,0,1];
  const g = document.getElementById('qr-grid');
  if (g) g.innerHTML = p.map(v=>`<div class="qr-cell ${v?'qr-dark':'qr-light'}"></div>`).join('');
})();

renderTable();
