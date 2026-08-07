'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const HC = { good: '#16a34a', fair: '#d97706', poor: '#dc2626' };

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

export default function DetailMap({ tree, trees = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !tree) return;

    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false })
      .setView([tree.lat, tree.lng], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    trees.forEach(t => {
      if (t.id !== tree.id) {
        L.marker([t.lat, t.lng], { icon: makeIcon(t.health), opacity: 0.35 }).addTo(map);
      }
    });

    L.marker([tree.lat, tree.lng], { icon: makeIcon(tree.health, true) }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [tree, trees]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
