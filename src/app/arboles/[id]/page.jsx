'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DetailMap = dynamic(() => import('@/components/DetailMap'), { ssr: false });

export default function TreeDetailPage({ params }) {
  const id = params.id;
  const [tree, setTree] = useState(null);
  const [showCareForm, setShowCareForm] = useState(false);
  const [careForm, setCareForm] = useState({ water_liters: '', height_cm: '', notes: '' });

  useEffect(() => {
    fetch(`/api/trees/${id}`).then(r => r.json()).then(setTree);
  }, [id]);

  const handleCareSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/trees/${id}/care`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        water_liters: careForm.water_liters ? parseFloat(careForm.water_liters) : null,
        height_cm: careForm.height_cm ? parseFloat(careForm.height_cm) : null,
        notes: careForm.notes || null,
      }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/trees/${id}`).then(r => r.json());
      setTree(updated);
      setCareForm({ water_liters: '', height_cm: '', notes: '' });
      setShowCareForm(false);
    }
  };

  if (!tree) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--t3)' }}>
        Cargando...
      </div>
    );
  }

  const healthLabel = { good: 'Saludable', fair: 'Regular', poor: 'Malo' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/arboles" className="btn btn-ghost btn-sm">← Volver</Link>
          <h1 style={{ fontSize: 15 }}>{tree.species}</h1>
          <span style={{ fontSize: 12, color: 'var(--t3)', fontVariantNumeric: 'tabular-nums' }}>#{tree.code}</span>
          <span className={`chip ${tree.health}`}>● {healthLabel[tree.health]}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCareForm(!showCareForm)}>
          {showCareForm ? 'Cancelar' : '+ Registrar cuidado'}
        </button>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', overflow: 'hidden' }}>
        <div style={{ overflowY: 'auto', borderRight: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tree.species}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
              Arbol #{tree.code} · {tree.zone}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <DataCell label="ALTURA" value={`${tree.height_cm} cm`} />
              <DataCell label="ZONA" value={tree.zone} />
              <DataCell label="SALUD" value={healthLabel[tree.health]} color={
                tree.health === 'good' ? 'var(--green)' : tree.health === 'fair' ? 'var(--amber)' : 'var(--red)'
              } />
              <DataCell label="PLANTADO" value={tree.planted_at || '—'} />
            </div>
          </div>

          {tree.notes && (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <div className="sidebar-title" style={{ marginBottom: 6 }}>NOTAS</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>{tree.notes}</div>
            </div>
          )}

          {showCareForm && (
            <form onSubmit={handleCareSubmit} style={{ padding: 16, borderBottom: '1px solid var(--border)', background: 'var(--s2)' }}>
              <div className="sidebar-title" style={{ marginBottom: 12 }}>NUEVO CUIDADO</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Agua (litros)</label>
                  <input className="input" type="number" step="0.1" placeholder="ej. 1.5"
                    value={careForm.water_liters} onChange={e => setCareForm(f => ({ ...f, water_liters: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Altura medida (cm)</label>
                  <input className="input" type="number" step="1" placeholder="ej. 115"
                    value={careForm.height_cm} onChange={e => setCareForm(f => ({ ...f, height_cm: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Notas</label>
                  <textarea className="input" rows="2" placeholder="Observaciones..."
                    value={careForm.notes} onChange={e => setCareForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Guardar cuidado
                </button>
              </div>
            </form>
          )}

          <div style={{ padding: 16 }}>
            <div className="sidebar-title" style={{ marginBottom: 10 }}>HISTORIAL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tree.careLogs?.map(log => (
                <div key={log.id} style={{
                  background: 'var(--s2)', border: '1px solid var(--border)',
                  borderRadius: 7, padding: '10px 12px', display: 'flex', gap: 10
                }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', whiteSpace: 'nowrap', minWidth: 70 }}>
                    {new Date(log.captured_at).toLocaleDateString('es-MX')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
                    {log.water_liters && <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{log.water_liters}L </span>}
                    {log.height_cm && <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{log.height_cm}cm </span>}
                    {log.notes}
                  </div>
                </div>
              ))}
              {(!tree.careLogs || tree.careLogs.length === 0) && (
                <div style={{ fontSize: 12, color: 'var(--t3)', padding: '12px 0' }}>Sin registros de cuidado.</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <DetailMap tree={tree} trees={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataCell({ label, value, color }) {
  return (
    <div style={{
      padding: '10px 12px', background: 'var(--s2)', border: '1px solid var(--border)',
      borderRadius: 7
    }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{
        fontSize: 15, fontWeight: 700, color: color || 'var(--t1)',
        fontVariantNumeric: 'tabular-nums', marginTop: 2
      }}>{value}</div>
    </div>
  );
}
