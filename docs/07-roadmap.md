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

## Fase 1: MVP web local — EN PROGRESO

Objetivo: registrar y consultar arboles con datos reales basicos.

Tareas:

- [x] Crear backend (Next.js 14 App Router).
- [x] Crear base de datos SQLite (better-sqlite3, schema, seed data 15 arboles).
- [x] CRUD de arboles (API routes: GET, POST, PUT, DELETE).
- [x] Captura de ubicacion (lat/lng en formulario).
- [x] Listado y mapa (Leaflet, filtros por zona/salud, busqueda).
- [x] Ficha publica simple (detalle con mapa, historial de cuidados).
- [x] Panel privado basico (admin con tabla y acciones).
- [ ] Commit y cierre de Fase 1.
- [ ] Probar flujo end-to-end completo (crear -> mapa -> detalle -> cuidado).

Criterio de salida:

- [x] Se puede registrar un arbol real y verlo en mapa publico.
- [ ] Flujo completo verificado sin errores.

## Fase 2: Captura movil

Objetivo: permitir captura en campo.

Tareas:

- PWA movil.
- GPS desde navegador.
- Camara o carga de foto.
- Escaneo de QR.
- Registro de cuidados.
- Validacion administrativa.

Criterio de salida:

- Un alumno puede capturar un cuidado desde su telefono y un docente puede aprobarlo.

## Fase 3: QR y seguimiento publico

Objetivo: conectar arbol fisico con ficha digital.

Tareas:

- Generar QR unico por arbol.
- Imprimir etiquetas.
- Ficha publica mejorada.
- Historial fotografico aprobado.
- Grafica de crecimiento.

Criterio de salida:

- Escanear un QR abre la ficha publica correcta.

## Fase 4: IA asistida

Objetivo: agregar inteligencia artificial con validacion humana.

Tareas:

- Integrar API de IA desde backend.
- Analisis de especie probable.
- Estimacion de altura.
- Deteccion de alertas visuales.
- Revision docente de resultados.
- Registro de confianza e incertidumbre.

Criterio de salida:

- La IA produce sugerencias utiles y los administradores pueden aceptarlas o corregirlas.

## Fase 5: Reportes e indicadores

Objetivo: convertir datos en seguimiento institucional.

Tareas:

- Exportacion CSV/XLSX.
- Reportes por zona, especie y grupo.
- Indicadores de supervivencia.
- Alertas de cuidado pendiente.
- Dashboard publico de impacto.

Criterio de salida:

- El equipo puede presentar avances con datos trazables.

