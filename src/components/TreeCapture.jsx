'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export default function TreeCapture({ trees, onCaptureComplete }) {
  const [selectedTree, setSelectedTree] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [speciesResult, setSpeciesResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: select tree, 2: take photo, 3: measure, 4: species, 5: done
  const [error, setError] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Obtener GPS del usuario
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

  // Seleccionar árbol
  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    setStep(2);
    setError(null);
  };

  // Capturar foto (cámara o galería)
  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setStep(3);
    setError(null);

    // Obtener GPS
    try {
      const coords = await getGPS();
      setGpsCoords(coords);
    } catch (err) {
      console.warn('GPS no disponible:', err);
      // Continuar sin GPS
    }
  };

  // Enviar a medición ArUco
  const handleMeasure = async () => {
    if (!photo) return;

    setUploading(true);
    setError(null);

    try {
      // Convertir foto a base64
      const base64 = await photo.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Por ahora, medición manual (estudiante ingresa altura)
      // Cuando tengamos la regla ArUco, usaremos el endpoint de medición
      setMeasurement({
        height_cm: null,
        source: 'pending',
        message: 'Ingresa la altura manualmente'
      });
      setStep(4);

    } catch (err) {
      setError('Error al procesar la foto');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Enviar altura manual
  const handleManualHeight = (heightCm) => {
    setMeasurement({
      height_cm: heightCm,
      source: 'manual',
      confidence: 100
    });
    setStep(5);
  };

  // Identificar especie con Pl@ntNet
  const handleIdentifySpecies = async () => {
    if (!photo) return;

    setUploading(true);
    setError(null);

    try {
      // Convertir foto a base64
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
        // Si Pl@ntNet falla, usar Gemma
        setSpeciesResult({
          species: selectedTree?.species || 'Pinus sp.',
          confidence: 50,
          source: 'fallback'
        });
      }
      setStep(6);

    } catch (err) {
      // Fallback a especie del árbol
      setSpeciesResult({
        species: selectedTree?.species || 'Pinus sp.',
        confidence: 50,
        source: 'fallback'
      });
      setStep(6);
    } finally {
      setUploading(false);
    }
  };

  // Subir foto a R2
  const handleUpload = async () => {
    if (!photo || !selectedTree) return;

    setUploading(true);
    setError(null);

    try {
      // Convertir a base64
      const base64 = await photo.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Subir a R2
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

      // Registrar cuidado con la foto
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
        setStep(7);
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

  // Reiniciar
  const handleReset = () => {
    setSelectedTree(null);
    setPhoto(null);
    setPhotoPreview(null);
    setMeasurement(null);
    setSpeciesResult(null);
    setGpsCoords(null);
    setError(null);
    setStep(1);
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
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Capturar Arbol</h1>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Paso {step} de 6</div>
        </div>
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
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Selecciona un arbol
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {trees.map((tree) => (
              <button
                key={tree.id}
                onClick={() => handleTreeSelect(tree)}
                style={{
                  padding: 16, borderRadius: 12, border: '1px solid var(--border)',
                  background: '#fff', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tree.code}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>{tree.species}</div>
                  </div>
                  <div style={{
                    padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: tree.health === 'good' ? '#dcfce7' : tree.health === 'fair' ? '#fef3c7' : '#fee2e2',
                    color: tree.health === 'good' ? '#166534' : tree.health === 'fair' ? '#92400e' : '#991b1b'
                  }}>
                    {tree.height_cm}cm
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Tomar foto */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Toma una foto de {selectedTree?.code}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 16 }}>
            Incluye la regla ArUco junto al arbol si la tienes
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => cameraInputRef.current?.click()}
              style={{
                padding: 20, borderRadius: 12, border: '2px dashed var(--green)',
                background: '#f0fdf4', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>
                Tomar Foto
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                Usa la camara del telefono
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: 16, borderRadius: 12, border: '1px solid var(--border)',
                background: '#fff', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                📁 Seleccionar de Galeria
              </div>
            </button>
          </div>

          {/* Inputs ocultos */}
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
              fontSize: 13
            }}
          >
            ← Volver a seleccionar
          </button>
        </div>
      )}

      {/* Step 3: Medir altura */}
      {step === 3 && photoPreview && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Mide la altura
          </h2>
          
          <div style={{ 
            borderRadius: 12, overflow: 'hidden', marginBottom: 16,
            border: '1px solid var(--border)'
          }}>
            <Image 
              src={photoPreview} 
              alt="Foto capturada" 
              width={400}
              height={300}
              style={{ width: '100%', height: 'auto', maxHeight: 300, objectFit: 'cover' }}
            />
          </div>

          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 16 }}>
            {gpsCoords ? 
              `GPS: ${gpsCoords.lat.toFixed(6)}, ${gpsCoords.lng.toFixed(6)} (${gpsCoords.accuracy?.toFixed(1)}m)` :
              'GPS no disponible'
            }
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleMeasure}
              disabled={uploading}
              style={{
                padding: 16, borderRadius: 12, border: 'none',
                background: 'var(--green)', color: '#fff', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, opacity: uploading ? 0.7 : 1
              }}
            >
              {uploading ? 'Procesando...' : '🔍 Detectar ArUco'}
            </button>

            <button
              onClick={() => {
                const height = prompt('Altura en cm:');
                if (height && !isNaN(height)) {
                  handleManualHeight(parseFloat(height));
                }
              }}
              style={{
                padding: 16, borderRadius: 12, border: '1px solid var(--border)',
                background: '#fff', cursor: 'pointer', fontSize: 14
              }}
            >
              ✏️ Ingresar Altura Manual
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              marginTop: 16, padding: 12, borderRadius: 8, border: 'none',
              background: 'transparent', color: 'var(--t3)', cursor: 'pointer',
              fontSize: 13
            }}
          >
            ← Tomar otra foto
          </button>
        </div>
      )}

      {/* Step 4: Altura capturada */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Altura registrada
          </h2>
          
          <div style={{
            padding: 20, borderRadius: 12, background: '#f0fdf4',
            border: '1px solid #bbf7d0', marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--green)' }}>
              {measurement?.height_cm || '---'} cm
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>
              {measurement?.source === 'aruco' ? 'Medido con ArUco' : 'Altura manual'}
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            style={{
              width: '100%', padding: 16, borderRadius: 12, border: 'none',
              background: 'var(--green)', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600
            }}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* Step 5: Identificar especie */}
      {step === 5 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Identificar especie
          </h2>
          
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 16 }}>
            Usa Pl@ntNet para identificar la especie del arbol
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleIdentifySpecies}
              disabled={uploading}
              style={{
                padding: 16, borderRadius: 12, border: 'none',
                background: 'var(--green)', color: '#fff', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, opacity: uploading ? 0.7 : 1
              }}
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
                setStep(6);
              }}
              style={{
                padding: 16, borderRadius: 12, border: '1px solid var(--border)',
                background: '#fff', cursor: 'pointer', fontSize: 14
              }}
            >
              ✏️ Seleccionar Manualmente
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Resultado especie */}
      {step === 6 && speciesResult && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Especie identificada
          </h2>
          
          <div style={{
            padding: 20, borderRadius: 12, background: '#f0fdf4',
            border: '1px solid #bbf7d0', marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--green)' }}>
              {speciesResult.species}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
              Confianza: {speciesResult.confidence}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
              Fuente: {speciesResult.source}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              width: '100%', padding: 16, borderRadius: 12, border: 'none',
              background: 'var(--green)', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Subiendo...' : '📤 Subir Foto y Registrar'}
          </button>
        </div>
      )}

      {/* Step 7: Completado */}
      {step === 7 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Registro completado
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>
            La foto y datos del arbol {selectedTree?.code} han sido guardados
          </p>
          
          <button
            onClick={handleReset}
            style={{
              padding: 16, borderRadius: 12, border: 'none',
              background: 'var(--green)', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600
            }}
          >
            Capturar otro arbol
          </button>
        </div>
      )}
    </div>
  );
}
