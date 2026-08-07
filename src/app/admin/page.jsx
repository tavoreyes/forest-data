'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch('/api/trees').then(r => r.json()).then(setTrees);
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este arbol?')) return;
    setDeleting(id);
    await fetch(`/api/trees/${id}`, { method: 'DELETE' });
    setTrees(t => t.filter(x => x.id !== id));
    setDeleting(null);
  };

  const healthLabel = { good: 'Saludable', fair: 'Regular', poor: 'Malo' };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>
      <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/" style={{ fontSize: 12, color: 'var(--t3)' }}>← Inicio</Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>Panel de administracion</h1>
        </div>
        <Link href="/arboles/nuevo" className="btn btn-primary">+ Nuevo arbol</Link>
      </header>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <StatCard label="Total arboles" value={stats.total} />
          <StatCard label="Saludables" value={stats.byHealth.good || 0} color="var(--green)" />
          <StatCard label="Regulares" value={stats.byHealth.fair || 0} color="var(--amber)" />
          <StatCard label="En riesgo" value={stats.byHealth.poor || 0} color="var(--red)" />
        </div>
      )}

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em' }}>TODOS LOS ARBOLES</div>
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>{trees.length} registros</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Especie</th>
              <th>Zona</th>
              <th>Altura</th>
              <th>Salud</th>
              <th>Creado</th>
              <th style={{ width: 120 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trees.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600 }}>#{t.code}</td>
                <td>{t.species}</td>
                <td style={{ color: 'var(--t2)' }}>{t.zone}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{t.height_cm} cm</td>
                <td>
                  <span className={`chip ${t.health}`}>● {healthLabel[t.health]}</span>
                </td>
                <td style={{ color: 'var(--t3)' }}>
                  {t.created_at ? new Date(t.created_at).toLocaleDateString('es-MX') : '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => router.push(`/arboles/${t.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--red)', borderColor: 'var(--red-bd)' }}
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                    >
                      {deleting === t.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: color || 'var(--t1)',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.2, marginTop: 4
      }}>{value}</div>
    </div>
  );
}
