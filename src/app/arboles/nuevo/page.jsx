'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, AlertTriangle, TreePine, 
  MapPin, Ruler, Calendar, FileText 
} from 'lucide-react';

export default function NuevoArbolPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: '',
    species: '',
    zone: 'Zona A',
    planted_at: '',
    lat: '',
    lng: '',
    health: 'good',
    height_cm: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const body = {
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : 0,
    };

    if (!body.code || !body.species || !body.lat || !body.lng) {
      setError('Codigo, especie, latitud y longitud son requeridos.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/trees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const tree = await res.json();
      router.push(`/arboles/${tree.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Error al crear el arbol.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px' }}>
      <header style={{ marginBottom: 28 }}>
        <Link href="/arboles" style={{ fontSize: 12, color: 'var(--t3)' }}>← Volver a arboles</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>Registrar arbol nuevo</h1>
        <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>
          Completa los datos basicos del arbol. Los campos con * son obligatorios.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em', marginBottom: 16 }}>IDENTIFICACION</div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">CODIGO *</label>
              <input className="input" name="code" placeholder="ej. A-01" value={form.code} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">ESPECIE *</label>
              <input className="input" name="species" placeholder="ej. Pinus pseudostrobus" value={form.species} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">ZONA</label>
              <select className="input" name="zone" value={form.zone} onChange={handleChange}>
                <option>Zona A</option>
                <option>Zona B</option>
                <option>Zona C</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">FECHA DE PLANTACION</label>
              <input className="input" name="planted_at" type="date" value={form.planted_at} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em', marginBottom: 16 }}>UBICACION</div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">LATITUD *</label>
              <input className="input" name="lat" type="number" step="any" placeholder="ej. 19.468" value={form.lat} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">LONGITUD *</label>
              <input className="input" name="lng" type="number" step="any" placeholder="ej. -101.877" value={form.lng} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.04em', marginBottom: 16 }}>ESTADO INICIAL</div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">SALUD</label>
              <select className="input" name="health" value={form.health} onChange={handleChange}>
                <option value="good">Saludable</option>
                <option value="fair">Regular</option>
                <option value="poor">Malo</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">ALTURA INICIAL (cm)</label>
              <input className="input" name="height_cm" type="number" step="1" placeholder="ej. 45" value={form.height_cm} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">NOTAS</label>
            <textarea className="input" name="notes" rows="3" placeholder="Observaciones del arbol..." value={form.notes} onChange={handleChange} />
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
            {loading ? 'Guardando...' : 'Crear arbol'}
          </button>
          <Link href="/arboles" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
