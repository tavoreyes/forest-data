# Contexto Activo - ForestData

## Estado actual (2026-08-07)

Fase 0 completada. Fase 1 completada. Fase 2 en progreso (85%). Fase 4 parcial (60%).

### Stack definido

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| DB | SQLite via better-sqlite3 |
| Package manager | npm |
| Mapas | Leaflet + react-leaflet |
| Estilos | CSS vanilla (tokens + componentes propios) |
| Auth | Sin auth en Fase 1-2 |
| IA | OpenRouter (Gemma 4) + Pl@ntNet |
| Almacenamiento | Cloudflare R2 |
| Medicion | OpenCV + ArUco markers |
| Iconografia | lucide-react (sin emojis) |

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

- DEC-001 a DEC-004: Ver `.claude/memory/DECISIONS.md`
- DEC-005: UI/UX captura con dropdowns (no inputs manuales)
- DEC-006: PWA basica (manifest + service worker)
- DEC-007: Sidebar colapsable en movil
- DEC-008: Iconografia Lucide (sin emojis en codigo fuente)
- DEC-009: Prueba ArUco impresa pospuesta (sin impresora, conexion movil con uso medido)

### Estado de fases

| Fase | Estado | Progreso |
|------|--------|----------|
| Fase 0 | Completada | 100% |
| Fase 1 | Completada | 100% |
| Fase 2 | En progreso | 85% |
| Fase 3 | No iniciada | 0% |
| Fase 4 | Parcial | 60% |
| Fase 5 | No iniciada | 0% |

### Restricciones conocidas

- Sin autenticacion: cualquier usuario puede crear/editar arboles
- SQLite local: no soporta multiples usuarios concurrentes
- Medicion ArUco: pendiente prueba con regla impresa (sin impresora)
- Conexion movil: pruebas con datos compartidos (uso medido)

### Pendiente proxima sesion

1. Generar iconos PWA (192x192, 512x512)
2. Completar PWA: offline mode, install prompt
3. Probar captura en telefono real (conexion de uso medido)
4. Probar subida a R2 con credenciales reales
5. Integrar Gemma VLM como fallback
6. Fase 3: QR por arbol
7. Fase 5: Exportacion CSV

## Proximo paso

Completar PWA (iconos + offline) y probar captura en telefono.
