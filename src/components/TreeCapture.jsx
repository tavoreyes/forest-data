'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';

const SPECIES_OPTIONS = [
  'Pinus leiophylla',
  'Pinus montezumae',
  'Pinus pseudostrobus',
  'Pinus oocarpa',
  'Pinus herrerensis',
  'Cedrus deodara',
  'Quercus rugosa',
  'Quercus ilex',
  'Eucalyptus globulus',
  'Jacaranda mimosifolia'
];

const ZONE_OPTIONS = [
  'Patio Central',
  'Jardin Botanico',
  'Entrada Principal',
  'Deportes',
  'Laboratorio',
  'Auditorio',
  'Biblioteca',
  'Comedor'
];

const HEALTH_OPTIONS = [
  { value: 'good', label: 'Saludable', color: '#166534', bg: '#dcfce7' },
  { value: 'fair', label: 'Regular', color: '#92400e', bg: '#fef3c7' },
  { value: 'poor', label: 'Malo', color: '#991b1b', bg: '#fee2e2' }
];

export default function TreeCapture({ trees, onCaptureComplete }) {
  const [selectedTree, setSelectedTree] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [speciesResult, setSpeciesResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [newTreeMode, setNewTreeMode] = useState(false);
  const [newTreeForm, setNewTreeForm] = useState({
    code: '',
    species: '',
    zone: '',
    health: 'good',
    planted_at: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const getGPS = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS no disponible'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const filteredTrees = useMemo(() => {
    if (!searchQuery) return trees;
    const q = searchQuery.toLowerCase();
    return trees.filter(t =>
      t.code?.toLowerCase().includes(q) ||
      t.species?.toLowerCase().includes(q) ||
      t.zone?.toLowerCase().includes(q)
    );
  }, [trees, searchQuery]);

  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    setStep(2);
    setError(null);
    setNewTreeMode(false);
  };

  const handleNewTree = async () => {
    if (!newTreeForm.code || !newTreeForm.species || !newTreeForm.zone) {
      setError('Completa codigo, especie y zona');
      return;
    }

    let coords = gpsCoords;
    if (!coords) {
      try {
        coords = await getGPS();
        setGpsCoords(coords);
      } catch (err) {
        setError('Activa el GPS para registrar un arbol nuevo');
        return;
      }
    }

    try {
      const res = await fetch('/api/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newTreeForm.code,
          species: newTreeForm.species,
          zone: newTreeForm.zone,
          health: newTreeForm.health,
          planted_at: newTreeForm.planted_at,
          lat: coords.lat,
          lng: coords.lng
        })
      });

      if (res.ok) {
        const tree = await res.json();
        setSelectedTree(tree);
        setStep(2);
        setError(null);
      } else {
        setError('Error al crear el arbol');
      }
    } catch (err) {
      setError('Error de conexion');
    }
  };

  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setStep(3);
    setError(null);

    try {
      const coords = await getGPS();
      setGpsCoords(coords);
    } catch (err) {
      console.warn('GPS no disponible:', err);
    }
  };

  const handleManualHeight = () => {
    const h = parseFloat(heightInput);
    if (isNaN(h) || h <= 0) {
      setError('Ingresa una altura valida');
      return;
    }
    setMeasurement({
      height_cm: h,
      source: 'manual',
      confidence: 100
    });
    setStep(4);
    setError(null);
  };

  const handleIdentifySpecies = async () => {
    if (!photo) return;

    setUploading(true);
    setError(null);

    try {
      const base64 = await photo.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const response = await fetch('/api/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: `data:${photo.type};base64,${base64String}`,
          tree_id: selectedTree?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setSpeciesResult(data.species);
      } else {
        setSpeciesResult({
          species: selectedTree?.species || 'Pinus sp.',
          confidence: 50,
          source: 'fallback'
        });
      }
      setStep(5);

    } catch (err) {
      setSpeciesResult({
        species: selectedTree?.species || 'Pinus sp.',
        confidence: 50,
        source: 'fallback'
      });
      setStep(5);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!photo || !selectedTree) return;

    setUploading(true);
    setError(null);

    try {
      const base64 = await photo.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: `data:${photo.type};base64,${base64String}`,
          tree_id: selectedTree.id,
          filename: photo.name
        })
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error('Error subiendo foto');
      }

      const careResponse = await fetch(`/api/trees/${selectedTree.id}/care`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          height_cm: measurement?.height_cm,
          notes: `Foto capturada - ${speciesResult?.species || selectedTree.species}`,
          photo_url: uploadData.photo.r2_url,
          lat: gpsCoords?.lat,
          lng: gpsCoords?.lng,
          accuracy_m: gpsCoords?.accuracy,
          measurement_source: measurement?.source || 'manual'
        })
      });

      const careData = await careResponse.json();

      if (careData.success) {
        onCaptureComplete?.({
          tree: selectedTree,
          photo: uploadData.photo,
          measurement,
          species: speciesResult,
          gps: gpsCoords
        });
        setStep(6);
      } else {
        throw new Error('Error registrando cuidado');
      }

    } catch (err) {
      setError('Error al subir la foto');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedTree(null);
    setPhoto(null);
    setPhotoPreview(null);
    setMeasurement(null);
    setSpeciesResult(null);
    setGpsCoords(null);
    setError(null);
    setSearchQuery('');
    setHeightInput('');
    setNewTreeMode(false);
    setStep(1);
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: '#fff',
    fontSize: 14,
    color: 'var(--t1)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: '#fff',
    fontSize: 14,
    color: 'var(--t1)',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--t3)',
    marginBottom: 6,
    display: 'block'
  };

  const btnPrimary = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    background: 'var(--green)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600
  };

  const btnSecondary = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid var(--border)',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
        paddingBottom: 16, borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: 'var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 20
        }}>
          📸
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Capturar Arbol</h1>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Paso {step} de 5</div>
        </div>
        {gpsCoords && (
          <div style={{
            padding: '4px 8px', borderRadius: 6, fontSize: 10,
            background: '#dcfce7', color: '#166534'
          }}>
            GPS activo
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: 12, borderRadius: 8, background: '#fef2f2', color: '#991b1b',
          marginBottom: 16, fontSize: 13
        }}>
          {error}
        </div>
      )}

      {/* Step 1: Seleccionar arbol */}
      {step === 1 && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setNewTreeMode(false)}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: 'none',
                background: !newTreeMode ? 'var(--green)' : 'var(--s2)',
                color: !newTreeMode ? '#fff' : 'var(--t2)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}
            >
              Arbol existente
            </button>
            <button
              onClick={() => setNewTreeMode(true)}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: 'none',
                background: newTreeMode ? 'var(--green)' : 'var(--s2)',
                color: newTreeMode ? '#fff' : 'var(--t2)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}
            >
              + Arbol nuevo
            </button>
          </div>

          {!newTreeMode ? (
            <>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Buscar por codigo, especie o zona..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    ...inputStyle,
                    paddingLeft: 36
                  }}
                />
                <span style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 14, color: 'var(--t3)'
                }}>
                  🔍
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                {filteredTrees.map((tree) => (
                  <button
                    key={tree.id}
                    onClick={() => handleTreeSelect(tree)}
                    style={{
                      padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)',
                      background: '#fff', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{tree.code}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{tree.species}</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{tree.zone}</div>
                      </div>
                      <div style={{
                        padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: HEALTH_OPTIONS.find(h => h.value === tree.health)?.bg || '#f3f4f6',
                        color: HEALTH_OPTIONS.find(h => h.value === tree.health)?.color || '#374151'
                      }}>
                        {tree.height_cm}cm
                      </div>
                    </div>
                  </button>
                ))}
                {filteredTrees.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
                    No se encontraron arboles
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Codigo del arbol *</label>
                <input
                  type="text"
                  placeholder="Ej: P-011"
                  value={newTreeForm.code}
                  onChange={e => setNewTreeForm(f => ({ ...f, code: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Especie *</label>
                <select
                  value={newTreeForm.species}
                  onChange={e => setNewTreeForm(f => ({ ...f, species: e.target.value }))}
                  style={selectStyle}
                >
                  <option value="">Seleccionar especie...</option>
                  {SPECIES_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Zona *</label>
                <select
                  value={newTreeForm.zone}
                  onChange={e => setNewTreeForm(f => ({ ...f, zone: e.target.value }))}
                  style={selectStyle}
                >
                  <option value="">Seleccionar zona...</option>
                  {ZONE_OPTIONS.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Salud</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {HEALTH_OPTIONS.map(h => (
                    <button
                      key={h.value}
                      onClick={() => setNewTreeForm(f => ({ ...f, health: h.value }))}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: 8,
                        border: newTreeForm.health === h.value ? `2px solid ${h.color}` : '1px solid var(--border)',
                        background: newTreeForm.health === h.value ? h.bg : '#fff',
                        color: newTreeForm.health === h.value ? h.color : 'var(--t2)',
                        cursor: 'pointer', fontSize: 12, fontWeight: 600
                      }}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Fecha de plantacion</label>
                <input
                  type="date"
                  value={newTreeForm.planted_at}
                  onChange={e => setNewTreeForm(f => ({ ...f, planted_at: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <button onClick={handleNewTree} style={btnPrimary}>
                Crear arbol y continuar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Tomar foto */}
      {step === 2 && (
        <div>
          <div style={{
            padding: 14, borderRadius: 10, background: 'var(--s2)',
            marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedTree?.code}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>{selectedTree?.species}</div>
            </div>
            <button
              onClick={() => { setSelectedTree(null); setStep(1); }}
              style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 11 }}
            >
              Cambiar
            </button>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Toma una foto
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
            Incluye la regla ArUco junto al arbol si la tienes
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => cameraInputRef.current?.click()}
              style={{
                padding: 24, borderRadius: 12, border: '2px dashed var(--green)',
                background: '#f0fdf4', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>
                Tomar Foto
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                Camara del telefono
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={btnSecondary}
            >
              📁 Seleccionar de Galeria
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            style={{ display: 'none' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoCapture}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => setStep(1)}
            style={{
              marginTop: 16, padding: 12, borderRadius: 8, border: 'none',
              background: 'transparent', color: 'var(--t3)', cursor: 'pointer',
              fontSize: 13, width: '100%'
            }}
          >
            ← Volver
          </button>
        </div>
      )}

      {/* Step 3: Ingresar altura */}
      {step === 3 && photoPreview && (
        <div>
          <div style={{ 
            borderRadius: 12, overflow: 'hidden', marginBottom: 16,
            border: '1px solid var(--border)'
          }}>
            <Image 
              src={photoPreview} 
              alt="Foto capturada" 
              width={400}
              height={300}
              style={{ width: '100%', height: 'auto', maxHeight: 250, objectFit: 'cover' }}
            />
          </div>

          {gpsCoords && (
            <div style={{
              padding: '8px 12px', borderRadius: 8, background: '#f0fdf4',
              fontSize: 11, color: '#166534', marginBottom: 16
            }}>
              GPS: {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)} ({gpsCoords.accuracy?.toFixed(1)}m)
            </div>
          )}

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Altura del arbol
          </h2>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input
              type="number"
              placeholder="Altura en cm"
              value={heightInput}
              onChange={e => setHeightInput(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              min="0"
              step="1"
            />
            <button
              onClick={handleManualHeight}
              style={{
                padding: '12px 20px', borderRadius: 10, border: 'none',
                background: 'var(--green)', color: '#fff', cursor: 'pointer',
                fontSize: 14, fontWeight: 600
              }}
            >
              OK
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setPhoto(null); setPhotoPreview(null); setStep(2); }}
              style={{ ...btnSecondary, flex: 1 }}
            >
              Otra foto
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Identificar especie */}
      {step === 4 && (
        <div>
          <div style={{
            padding: 14, borderRadius: 10, background: '#f0fdf4',
            border: '1px solid #bbf7d0', marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>
              {measurement?.height_cm} cm
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Altura registrada</div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Identificar especie
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
            Usa Pl@ntNet o confirma la especie del arbol
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleIdentifySpecies}
              disabled={uploading}
              style={{ ...btnPrimary, opacity: uploading ? 0.7 : 1 }}
            >
              {uploading ? 'Identificando...' : '🌿 Identificar con Pl@ntNet'}
            </button>

            <button
              onClick={() => {
                setSpeciesResult({
                  species: selectedTree?.species || 'Pinus sp.',
                  confidence: 100,
                  source: 'manual'
                });
                setStep(5);
              }}
              style={btnSecondary}
            >
              Usar especie del arbol: {selectedTree?.species}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmar y subir */}
      {step === 5 && speciesResult && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Confirmar registro
          </h2>

          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 
          }}>
            <div style={{
              padding: '12px 14px', borderRadius: 10, background: 'var(--s2)',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Arbol</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedTree?.code}</span>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 10, background: 'var(--s2)',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Altura</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{measurement?.height_cm} cm</span>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 10, background: 'var(--s2)',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Especie</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{speciesResult.species}</span>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 10, background: 'var(--s2)',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Confianza</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{speciesResult.confidence}%</span>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ ...btnPrimary, opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? 'Subiendo...' : '📤 Subir y Registrar'}
          </button>

          <button
            onClick={() => setStep(4)}
            style={{
              marginTop: 12, padding: 12, borderRadius: 8, border: 'none',
              background: 'transparent', color: 'var(--t3)', cursor: 'pointer',
              fontSize: 13, width: '100%'
            }}
          >
            ← Cambiar especie
          </button>
        </div>
      )}

      {/* Step 6: Completado */}
      {step === 6 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 36
          }}>
            ✅
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Registro exitoso
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24, lineHeight: 1.5 }}>
            Foto y datos del arbol <strong>{selectedTree?.code}</strong> guardados correctamente
          </p>
          
          <button onClick={handleReset} style={btnPrimary}>
            Capturar otro arbol
          </button>
        </div>
      )}
    </div>
  );
}
