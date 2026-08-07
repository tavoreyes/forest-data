# Contexto Activo - ForestData

## Estado actual (2026-08-07)

Fase 0 completada. Fase 1 completada. Fase 2 en progreso (UI/UX mejorada, PWA básica).

### Stack definido

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

### Codigo fuente (30 archivos)

**API (9 endpoints):** trees, trees/[id], trees/[id]/care, stats, measure, upload, species
**Pages (7):** home, arboles, arboles/[id], arboles/nuevo, admin, capturar
**Components (3):** Map, DetailMap, TreeCapture
**DB:** src/lib/db.js (schema 5 tablas + seed 10 arboles CECyTEM 33)
**Scripts (2):** generate_ruler.py, measure.py
**PWA:** manifest.json, sw.js
**Config:** next.config.js, package.json, globals.css, .eslintrc.json, .env.local

### Coordenadas CECyTEM 33 Capula

```
19.67383, -101.393338
Avenida Vasco de Quiroga, Capula, Morelia, Michoacán
```

### Decisiones cerradas

- DEC-001 a DEC-010: Ver roadmap
- DEC-011: UI/UX captura con dropdowns (no inputs manuales)
- DEC-012: PWA básica (manifest + service worker)
- DEC-013: Sidebar colapsable en móvil

### Estado de fases

| Fase | Estado | Progreso |
|------|--------|----------|
| Fase 0 | Completada | 100% |
| Fase 1 | Completada | 100% |
| Fase 2 | En progreso | 75% |
| Fase 3 | No iniciada | 0% |
| Fase 4 | Parcial | 60% |
| Fase 5 | No iniciada | 0% |

### Pendiente proxima sesion

1. Probar `/capturar` en teléfono real
2. Probar subida a R2 con credenciales reales
3. Generar íconos PWA (192x192, 512x512)
4. Completar PWA: offline mode, install prompt
5. Probar medición ArUco con regla impresa
6. Integrar Gemma VLM como fallback
7. Fase 3: QR por árbol
8. Fase 5: Exportación CSV

## Proximo paso

Probar captura en teléfono + completar PWA.
