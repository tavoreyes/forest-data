'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArbolesPage() {
  const router = useRouter();
  const [trees, setTrees] = useState([]);
  const [filter, setFilter] = useState('all');
  const [zone, setZone] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('health', filter);
    if (zone !== 'all') params.set('zone', zone);
    if (search) params.set('q', search);

    fetch(`/api/trees?${params}`).then(r => r.json()).then(setTrees);
  }, [filter, zone, search]);

  const healthLabel = { good: 'Saludable', fair: 'Regular', poor: 'Malo' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" className="btn btn-ghost btn-sm">← Inicio</Link>
          <h1>Arboles</h1>
          <span className="chip" style={{ background: 'var(--s3)', color: 'var(--t2)', border: '1px solid var(--border)' }}>
            {trees.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="input"
            placeholder="Buscar especie, codigo..."
            style={{ width: 220 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Link href="/arboles/nuevo" className="btn btn-primary">+ Nuevo</Link>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <aside className="sidebar" style={{ width: 180, padding: '16px 12px' }}>
          <div className="sidebar-section">
            <div className="sidebar-title">ESTADO</div>
            {['all', 'good', 'fair', 'poor'].map(h => (
              <button
                key={h}
                onClick={() => setFilter(h)}
                className={`sidebar-item ${filter === h ? 'active' : ''}`}
              >
                <div
                  className="sidebar-dot"
                  style={{
                    background: h === 'all' ? 'var(--t3)' : h === 'good' ? 'var(--green)' : h === 'fair' ? 'var(--amber)' : 'var(--red)'
                  }}
                />
                {h === 'all' ? 'Todos' : healthLabel[h]}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">ZONA</div>
            {['all', 'Zona A', 'Zona B', 'Zona C'].map(z => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={`sidebar-item ${zone === z ? 'active' : ''}`}
              >
                {z === 'all' ? 'Todas' : z}
              </button>
            ))}
          </div>
        </aside>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Especie</th>
                  <th>Codigo</th>
                  <th>Zona</th>
                  <th>Altura</th>
                  <th>Salud</th>
                  <th>Actualizado</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {trees.map(t => (
                  <tr
                    key={t.id}
                    data-clickable
                    onClick={() => router.push(`/arboles/${t.id}`)}
                  >
                    <td style={{ fontSize: 16 }}>🌲</td>
                    <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{t.species}</td>
                    <td style={{ color: 'var(--t3)', fontVariantNumeric: 'tabular-nums' }}>#{t.code}</td>
                    <td style={{ color: 'var(--t2)' }}>{t.zone}</td>
                    <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{t.height_cm} cm</td>
                    <td>
                      <span className={`chip ${t.health}`}>● {healthLabel[t.health]}</span>
                    </td>
                    <td style={{ color: 'var(--t3)' }}>
                      {t.updated_at ? new Date(t.updated_at).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td style={{ color: 'var(--t3)', fontSize: 14 }}>→</td>
                  </tr>
                ))}
                {trees.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--t3)' }}>
                      No se encontraron arboles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
