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

## Fase 1: MVP web local — EN PROGRESO (casi completada)

Objetivo: registrar y consultar arboles con datos reales basicos.

Tareas:

- [x] Crear backend (Next.js 14 App Router).
- [x] Crear base de datos SQLite (better-sqlite3, schema, seed data 10 arboles reales CECyTEM 33).
- [x] CRUD de arboles (API routes: GET, POST, PUT, DELETE).
- [x] Captura de ubicacion (lat/lng en formulario).
- [x] Listado y mapa (Leaflet, filtros por zona/salud, busqueda).
- [x] Ficha publica simple (detalle con mapa, historial de cuidados).
- [x] Panel privado basico (admin con tabla y acciones).
- [x] Formulario de edicion de arboles.
- [ ] Commit y cierre de Fase 1.
- [ ] Probar flujo end-to-end completo (crear -> mapa -> detalle -> cuidado).

Criterio de salida:

- [x] Se puede registrar un arbol real y verlo en mapa publico.
- [ ] Flujo completo verificado sin errores.

## Fase 2: Captura movil — PARCIALMENTE COMPLETADA

Objetivo: permitir captura en campo.

Tareas completadas:

- [x] Componente TreeCapture (seleccion arbol -> foto -> medida -> especie -> upload).
- [x] Pagina /capturar optimizada para movil.
- [x] GPS desde navegador (navigator.geolocation).
- [x] Camara o carga de foto (input file con capture="environment").
- [x] Subida a Cloudflare R2 (POST /api/upload).
- [x] Identificacion de especie con Pl@ntNet (POST /api/species).

Tareas pendientes:

- [ ] **Mejorar UI/UX de captura**: formulario no es intuitivo, todo se escribe a mano. Cambiar a selects/dropdowns para: especie, zona, salud. Agregar autocompletado y validación.
- [ ] PWA manifest.json + service worker.
- [ ] Meta tags para iOS/Android (installable).
- [ ] Funcionamiento offline (capturas pendientes).
- [ ] Boton "Instalar app".
- [ ] Validacion de GPS (que este dentro del campus).
- [ ] Validacion de fotos (tamano, formato).
- [ ] Sidebar responsive collapse en movil.

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

## Fase 4: IA asistida — PARCIALMENTE COMPLETADA

Objetivo: agregar inteligencia artificial con validacion humana.

Tareas completadas:

- [x] Medicion de altura con ArUco markers (scripts/measure.py).
- [x] API bridge Python (POST /api/measure).
- [x] Identificacion de especie con Pl@ntNet (POST /api/species).
- [x] Regla ArUco imprimible (assets/regla_aruco_30cm.png).

Tareas pendientes:

- [ ] Integrar Gemma 4 VLM como fallback/validacion.
- [ ] Deteccion de alertas visuales.
- [ ] Revision docente de resultados.
- [ ] Registro de confianza e incertidumbre.
- [ ] Prueba real con marcadores ArUco impresos.

Criterio de salida:

- [x] La IA produce sugerencias utiles (Pl@ntNet funciona).
- [ ] Los administradores pueden aceptarlas o corregirlas.
- [ ] La medicion ArUco funciona con marcadores reales.

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
| Fase 1 | Casi completada | 90% (falta commit + prueba E2E) |
| Fase 2 | Parcialmente completada | 70% (falta PWA + validaciones) |
| Fase 3 | No iniciada | 0% |
| Fase 4 | Parcialmente completada | 60% (falta prueba real + Gemma) |
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
