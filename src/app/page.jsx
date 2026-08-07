'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  TreePine, Camera, ClipboardList, Settings, Plus,
  ChevronDown, ChevronUp, Activity, MapPin
} from 'lucide-react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function HomePage() {
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/trees').then(r => r.json()).then(setTrees);
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.25)'
          }}>
            <TreePine size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700 }}>ForestData</h1>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Michoacan · CECyTE</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link href="/capturar" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Camera size={14} />
            Capturar
          </Link>
          <Link href="/arboles" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClipboardList size={14} />
            Arboles
          </Link>
          <Link href="/admin" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Settings size={14} />
            Admin
          </Link>
          <Link href="/arboles/nuevo" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} />
            Registrar
          </Link>
        </nav>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {stats && (
          <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`} style={{ width: 260 }}>
            <div className="sidebar-section">
              <div className="sidebar-title">RESUMEN</div>
              <div className="stat-block">
                <div className="stat-label">ARBOLES</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-block">
                <div className="stat-label">ALTURA PROM.</div>
                <div className="stat-value" style={{ color: 'var(--t2)' }}>{stats.avgHeight} cm</div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">SALUD</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <HealthMini label="Bueno" value={stats.byHealth.good || 0} color="var(--green)" />
                <HealthMini label="Regular" value={stats.byHealth.fair || 0} color="var(--amber)" />
                <HealthMini label="Malo" value={stats.byHealth.poor || 0} color="var(--red)" />
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">ZONAS</div>
              {stats.byZone.map(z => (
                <div key={z.zone} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '7px 0',
                  borderBottom: '1px solid var(--border)', fontSize: 12
                }}>
                  <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={10} />
                    {z.zone}
                  </span>
                  <span style={{ color: 'var(--t3)', fontVariantNumeric: 'tabular-nums' }}>{z.count}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <Link href="/arboles/nuevo" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} />
                Registrar arbol
              </Link>
            </div>

            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {sidebarExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {sidebarExpanded ? 'Menos' : 'Mas'}
            </button>
          </aside>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          <Map trees={trees} />
        </div>
      </div>
    </div>
  );
}

function HealthMini({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.03em' }}>{label}</div>
    </div>
  );
}
