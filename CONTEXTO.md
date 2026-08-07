# Contexto Activo - ForestData

## Estado actual (2026-08-07)

Fase 0 completada. Fase 1 — codigo creado y funcionando. Fase 2-5 — herramientas base creadas.

### Stack definido (DEC-003, DEC-004)

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| DB | SQLite via better-sqlite3 |
| Package manager | npm |
| Mapas | Leaflet + react-leaflet |
| Estilos | CSS vanilla (tokens + componentes propios) |
| Auth | Sin auth en Fase 1 |
| IA | OpenRouter (Gemma 4) + Pl@ntNet |
| Almacenamiento | Cloudflare R2 |
| Medicion | OpenCV + ArUco markers |

### Archivos de diseno

- `PRODUCT.md` — Register: product. North Star: "El Cuaderno de Campo". Personalidad: Confiable, Claro, Accesible.
- `DESIGN.md` — Paleta minimalista (verde puntual, grises puros), tipografia Inter, elevacion funcional, componentes amigables.

### Codigo fuente (27 archivos)

**API (9 endpoints):** trees/route.js, trees/[id]/route.js, trees/[id]/care/route.js, stats/route.js, measure/route.js, upload/route.js, species/route.js
**Pages (7):** layout.jsx, page.jsx (home), arboles/page.jsx, arboles/[id]/page.jsx, arboles/nuevo/page.jsx, admin/page.jsx, capturar/page.jsx
**Components (3):** Map.jsx, DetailMap.jsx, TreeCapture.jsx
**DB:** src/lib/db.js (schema 5 tablas + seed 10 arboles reales CECyTEM 33)
**Scripts (2):** generate_ruler.py, measure.py
**Config:** next.config.js, package.json, globals.css, .eslintrc.json, .env.local

### Endpoints verificados (8/8 OK - Fase 1)

GET /, /api/stats, /api/trees, /arboles, /arboles/nuevo, /arboles/1, /admin — todos 200

### Endpoints nuevos (pendientes de prueba)

POST /api/measure — Medicion ArUco (Python bridge)
POST /api/upload — Subida fotos a R2
POST /api/species — Identificacion Pl@ntNet

### Coordenadas CECyTEM 33 Capula (verificadas)

```
CECyTEM 33 Capula: 19.67383, -101.393338
Direccion: Avenida Vasco de Quiroga, Capula, Morelia, Michoacán
```

### Decisiones cerradas

- DEC-001: Separar monolito HTML en archivos
- DEC-002: Metadata por defecto no es mentira
- DEC-003: Stack Next.js + SQLite local
- DEC-004: pnpm → npm (bloqueo en Windows)
- DEC-005: Leaflet se mantiene (50 markers no justifica MapLibre)
- DEC-006: GPS con navigator.geolocation (3-8m precision suficiente)
- DEC-007: ArUco DICT_5X5_50 para medicion de altura
- DEC-008: Cloudflare R2 para almacenamiento (10GB gratis, sin egress)
- DEC-009: Pl@ntNet primario + Gemma 4 VLM secundario
- DEC-010: OpenCV en Python v3.11 con venv

### Herramientas creadas (Sesion 2026-08-07)

| Archivo | Funcion |
|---------|---------|
| assets/regla_aruco_30cm.png | Regla imprimible con 3 marcadores |
| scripts/generate_ruler.py | Generador de regla ArUco |
| scripts/measure.py | Medicion de altura con OpenCV |
| src/app/api/measure/route.js | API bridge Python |
| src/app/api/upload/route.js | API subida a R2 |
| src/app/api/species/route.js | API Pl@ntNet |
| src/components/TreeCapture.jsx | Componente de captura movil |
| src/app/capturar/page.jsx | Pagina de captura |
| .env.local | Credenciales R2 + Pl@ntNet + OpenRouter |

### Pendiente proxima sesion

1. Commit de Fase 1 + nuevas herramientas
2. Probar POST /api/trees (crear arbol)
3. Probar POST /api/trees/1/care (registrar cuidado)
4. Verificar arbol nuevo aparece en mapa y listado
5. Probar flujo de captura en telefono
6. Probar subida a R2
7. Cerrar Fase 1 en roadmap
8. **Mejorar UI/UX de captura**: cambiar a selects/dropdowns para especie, zona, salud

## Proximo paso

Commit + prueba end-to-end + cierre de Fase 1.
