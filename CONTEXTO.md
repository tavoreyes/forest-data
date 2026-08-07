# Contexto Activo - ForestData

## Estado actual (2026-08-06)

Fase 0 completada. Fase 1 — codigo creado y diseno mejorado, pendiente commit y prueba end-to-end.

### Stack definido (DEC-003, DEC-004)

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| DB | SQLite via better-sqlite3 |
| Package manager | npm |
| Mapas | Leaflet + react-leaflet |
| Estilos | CSS vanilla (tokens + componentes propios) |
| Auth | Sin auth en Fase 1 |

### Archivos de diseno

- `PRODUCT.md` — Register: product. North Star: "El Cuaderno de Campo". Personalidad: Confiable, Claro, Accesible.
- `DESIGN.md` — Paleta minimalista (verde puntual, grises puros), tipografia Inter, elevacion funcional, componentes amigables.

### Codigo fuente (14 archivos)

**API:** trees/route.js, trees/[id]/route.js, trees/[id]/care/route.js, stats/route.js
**Pages:** layout.jsx, page.jsx (home), arboles/page.jsx, arboles/[id]/page.jsx, arboles/nuevo/page.jsx, admin/page.jsx
**Components:** Map.jsx, DetailMap.jsx
**DB:** src/lib/db.js (schema + seed 15 arboles)
**Config:** next.config.js, package.json, globals.css

### Endpoints verificados (8/8 OK)

GET /, /api/stats, /api/trees, /arboles, /arboles/nuevo, /arboles/1, /admin — todos 200

### Decisiones cerradas

- DEC-001: Separar monolito HTML en archivos
- DEC-002: Metadata por defecto no es mentira
- DEC-003: Stack Next.js + SQLite local
- DEC-004: pnpm → npm (bloqueo en Windows)

### Pendiente proxima sesion

1. Commit de Fase 1 (todo el codigo nuevo)
2. Probar POST /api/trees (crear arbol)
3. Probar POST /api/trees/1/care (registrar cuidado)
4. Verificar arbol nuevo aparece en mapa y listado
5. Cerrar Fase 1 en roadmap
6. Abrir en navegador para verificar diseno visual

## Proximo paso

Commit + prueba end-to-end + cierre de Fase 1.
