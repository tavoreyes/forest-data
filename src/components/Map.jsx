'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const HC = { good: '#16a34a', fair: '#d97706', poor: '#dc2626' };
const HL = { good: 'Saludable', fair: 'Regular', poor: 'Malo' };

function makeIcon(health, selected = false) {
  const c = HC[health];
  const ring = selected
    ? `<circle cx="10" cy="10" r="9" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/>`
    : '';
  return L.divIcon({
    className: '',
    html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      ${ring}
      <circle cx="10" cy="10" r="${selected ? 6 : 5}" fill="${c}" stroke="white" stroke-width="2"/>
    </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

export default function Map({ trees }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
      .setView([19.466, -101.872], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !trees.length) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    trees.forEach(t => {
      const m = L.marker([t.lat, t.lng], { icon: makeIcon(t.health) }).addTo(map);
      m.bindPopup(`
        <div style="padding:12px 14px;min-width:190px;font-family:Inter,sans-serif;">
          <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:2px;">🌲 ${t.species}</div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;">Arbol #${t.code} · ${t.zone}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:10px;color:#9ca3af;">Altura</span>
            <span style="font-size:11px;font-weight:600;color:#374151;">${t.height_cm} cm</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:10px;color:#9ca3af;">Salud</span>
            <span style="font-size:11px;font-weight:600;color:${HC[t.health]}">${HL[t.health]}</span>
          </div>
          <div style="height:1px;background:#f3f4f6;margin:8px 0;"></div>
          <a href="/arboles/${t.id}" style="display:block;width:100%;padding:7px 0;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;color:#16a34a;font-size:11px;font-weight:600;text-align:center;font-family:Inter,sans-serif;">
            Ver detalle
          </a>
        </div>
      `, { maxWidth: 220 });

      m.on('click', () => {
        map.panTo([t.lat, t.lng], { animate: true, duration: 0.5 });
      });

      markersRef.current[t.id] = m;
    });
  }, [trees]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
