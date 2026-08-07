'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DetailMap = dynamic(() => import('@/components/DetailMap'), { ssr: false });

export default function TreeDetailPage({ params }) {
  const id = params.id;
  const [tree, setTree] = useState(null);
  const [showCareForm, setShowCareForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [careForm, setCareForm] = useState({ water_liters: '', height_cm: '', notes: '' });
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetch(`/api/trees/${id}`).then(r => r.json()).then(data => {
      setTree(data);
      setEditForm({
        code: data.code || '',
        species: data.species || '',
        zone: data.zone || '',
        planted_at: data.planted_at || '',
        lat: data.lat || '',
        lng: data.lng || '',
        health: data.health || 'good',
        height_cm: data.height_cm || '',
        notes: data.notes || ''
      });
    });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/trees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: editForm.code,
        species: editForm.species,
        zone: editForm.zone,
        planted_at: editForm.planted_at || null,
        lat: parseFloat(editForm.lat),
        lng: parseFloat(editForm.lng),
        health: editForm.health,
        height_cm: editForm.height_cm ? parseFloat(editForm.height_cm) : null,
        notes: editForm.notes || null
      }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/trees/${id}`).then(r => r.json());
      setTree(updated);
      setShowEditForm(false);
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => {
            setShowEditForm(!showEditForm);
            setShowCareForm(false);
          }}>
            {showEditForm ? 'Cancelar' : '✏️ Editar'}
          </button>
          <button className="btn btn-primary" onClick={() => {
            setShowCareForm(!showCareForm);
            setShowEditForm(false);
          }}>
            {showCareForm ? 'Cancelar' : '+ Registrar cuidado'}
          </button>
        </div>
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

          {tree.notes && !showEditForm && (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <div className="sidebar-title" style={{ marginBottom: 6 }}>NOTAS</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>{tree.notes}</div>
            </div>
          )}

          {showEditForm && (
            <form onSubmit={handleEditSubmit} style={{ padding: 16, borderBottom: '1px solid var(--border)', background: 'var(--s2)' }}>
              <div className="sidebar-title" style={{ marginBottom: 12 }}>EDITAR ARBOL</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Codigo</label>
                  <input className="input" type="text" placeholder="P-001"
                    value={editForm.code} onChange={e => setEditForm(f => ({ ...f, code: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Especie</label>
                  <input className="input" type="text" placeholder="Pinus leiophylla"
                    value={editForm.species} onChange={e => setEditForm(f => ({ ...f, species: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Zona</label>
                  <input className="input" type="text" placeholder="Patio Central"
                    value={editForm.zone} onChange={e => setEditForm(f => ({ ...f, zone: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Plantado</label>
                  <input className="input" type="date"
                    value={editForm.planted_at} onChange={e => setEditForm(f => ({ ...f, planted_at: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Latitud</label>
                    <input className="input" type="number" step="0.0001" placeholder="19.6738"
                      value={editForm.lat} onChange={e => setEditForm(f => ({ ...f, lat: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Longitud</label>
                    <input className="input" type="number" step="0.0001" placeholder="-101.3933"
                      value={editForm.lng} onChange={e => setEditForm(f => ({ ...f, lng: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Salud</label>
                    <select className="input"
                      value={editForm.health} onChange={e => setEditForm(f => ({ ...f, health: e.target.value }))}>
                      <option value="good">Saludable</option>
                      <option value="fair">Regular</option>
                      <option value="poor">Malo</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Altura (cm)</label>
                    <input className="input" type="number" step="1" placeholder="45"
                      value={editForm.height_cm} onChange={e => setEditForm(f => ({ ...f, height_cm: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Notas</label>
                  <textarea className="input" rows="2" placeholder="Observaciones..."
                    value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Guardar cambios
                </button>
              </div>
            </form>
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
