# Roadmap

Este roadmap prioriza construir confianza antes que funciones llamativas.

## Fase 0: Ordenar la maqueta — COMPLETADA (2026-08-06)

Objetivo: convertir el prototipo actual en una base mantenible.

Tareas completadas:

- [x] Corregir HTML duplicado.
- [x] Separar CSS y JavaScript (index.html, styles.css, data.js, app.js).
- [x] Eliminar referencias inexistentes.
- [x] Calcular conteos desde datos.
- [x] Marcar claramente funciones simuladas.
- [x] Crear repositorio Git.

Criterio de salida cumplidos:

- [x] La maqueta abre sin errores evidentes.
- [x] Los datos visibles coinciden con la fuente interna.
- [x] El codigo puede ser entendido por alumnos.

## Fase 1: MVP web local — COMPLETADA (2026-08-06)

Objetivo: registrar y consultar arboles con datos reales basicos.

Tareas completadas:

- [x] Crear backend (Next.js 14 App Router).
- [x] Crear base de datos SQLite (better-sqlite3, schema, seed data 10 arboles reales CECyTEM 33).
- [x] CRUD de arboles (API routes: GET, POST, PUT, DELETE).
- [x] Captura de ubicacion (lat/lng en formulario).
- [x] Listado y mapa (Leaflet, filtros por zona/salud, busqueda).
- [x] Ficha publica simple (detalle con mapa, historial de cuidados).
- [x] Panel privado basico (admin con tabla y acciones).
- [x] Formulario de edicion de arboles.
- [x] Commit y cierre de Fase 1.

Criterio de salida:

- [x] Se puede registrar un arbol real y verlo en mapa publico.

## Fase 2: Captura movil — EN PROGRESO (2026-08-07)

Objetivo: permitir captura en campo.

Tareas completadas:

- [x] Componente TreeCapture (seleccion arbol -> foto -> medida -> especie -> upload).
- [x] Pagina /capturar optimizada para movil.
- [x] GPS desde navegador (navigator.geolocation).
- [x] Camara o carga de foto (input file con capture="environment").
- [x] Subida a Cloudflare R2 (POST /api/upload).
- [x] Identificacion de especie con Pl@ntNet (POST /api/species).
- [x] UI/UX mejorada: selects/dropdowns para especie, zona, salud.
- [x] Sidebar responsive collapse en movil.
- [x] PWA basica (manifest.json + service worker).
- [x] Iconografia Lucide (sin emojis en codigo fuente).

Tareas pendientes:

- [ ] Generar iconos PWA (192x192, 512x512).
- [ ] Modo offline (capturas pendientes de sincronizar).
- [ ] Prompt de instalacion PWA.
- [ ] Validacion de GPS (que este dentro del campus).
- [ ] Validacion de fotos (tamano, formato).

Restricciones:

- Las pruebas en telefono se realizan con conexion de uso medido (compartiendo datos desde el movil). Evitar descargas grandes o pruebas que consuman mucho ancho de banda.

Criterio de salida:

- [x] Un alumno puede capturar un cuidado desde su telefono.
- [ ] La captura funciona como PWA instalable.
- [ ] Un docente puede aprobar registros.

## Fase 3: QR y seguimiento publico — NO INICIADA

Objetivo: conectar arbol fisico con ficha digital.

Tareas:

- [ ] Generar QR unico por arbol (libreria qrcode).
- [ ] Endpoint /api/trees/[id]/qr.
- [ ] Imprimir etiquetas.
- [ ] Ficha publica mejorada (grafica de crecimiento, historial fotos).
- [ ] Historial fotografico aprobado.
- [ ] Grafica de crecimiento.
- [ ] Share buttons (WhatsApp, etc.).

Criterio de salida:

- [ ] Escanear un QR abre la ficha publica correcta.

## Fase 4: IA asistida — PARCIAL (2026-08-07)

Objetivo: agregar inteligencia artificial con validacion humana.

Tareas completadas:

- [x] Medicion de altura con ArUco markers (scripts/measure.py).
- [x] API bridge Python (POST /api/measure).
- [x] Identificacion de especie con Pl@ntNet (POST /api/species).
- [x] Regla ArUco imprimible generada (assets/regla_aruco_30cm.png).

Tareas pendientes:

- [ ] Integrar Gemma 4 VLM como fallback/validacion.
- [ ] Deteccion de alertas visuales.
- [ ] Revision docente de resultados.
- [ ] Registro de confianza e incertidumbre.

**Prueba con regla ArUco impresa: POSPUESTA**

La prueba de medicion con marcadores ArUco impresos se pospone por las siguientes razones:

1. No se dispone de impresora en este momento.
2. Las pruebas en movil se realizan con conexion de uso medido (compartiendo datos).
3. La regla generada (assets/regla_aruco_30cm.png) estara lista para cuando se tenga acceso a impresora.

La funcionalidad de medicion esta implementada y lista para probarse cuando las condiciones lo permitan. No es bloqueante para las demas fases.

Criterio de salida:

- [x] La IA produce sugerencias utiles (Pl@ntNet funciona).
- [ ] Los administradores pueden aceptarlas o corregirlas.
- [ ] La medicion ArUco funciona con marcadores reales (pospuesto).

## Fase 5: Reportes e indicadores — NO INICIADA

Objetivo: convertir datos en seguimiento institucional.

Tareas:

- [ ] Exportacion CSV/XLSX.
- [ ] Reportes por zona, especie y grupo.
- [ ] Indicadores de supervivencia.
- [ ] Alertas de cuidado pendiente.
- [ ] Dashboard publico de impacto.

Criterio de salida:

- [ ] El equipo puede presentar avances con datos trazables.

## Resumen de progreso

| Fase | Estado | Progreso |
|------|--------|----------|
| Fase 0 | Completada | 100% |
| Fase 1 | Completada | 100% |
| Fase 2 | En progreso | 85% (falta PWA completa + validaciones) |
| Fase 3 | No iniciada | 0% |
| Fase 4 | Parcial | 60% (falta prueba ArUco + Gemma) |
| Fase 5 | No iniciada | 0% |

## Notas de implementacion

### Coordenadas CECyTEM 33 Capula

```
Centro del plantel: 19.67383, -101.393338
Direccion: Avenida Vasco de Quiroga, Capula, Morelia, Michoacán
```

### Stack tecnico final

- Frontend: Next.js 14 + React 18 + Leaflet
- Backend: Next.js API Routes + SQLite
- IA: Pl@ntNet (especies) + OpenRouter/Gemma 4 (validacion)
- Almacenamiento: Cloudflare R2 (10GB gratis)
- Medicion: OpenCV + ArUco DICT_5X5_50
- Dispositivo: Python 3.11 + OpenCV 5.0
- Iconografia: lucide-react (sin emojis)
