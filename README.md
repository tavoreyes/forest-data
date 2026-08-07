# ForestData

ForestData es una plataforma educativa y ambiental para registrar, geolocalizar y dar seguimiento publico al crecimiento de arboles cuidados por alumnos en el CECyTEM 33 Capula, Michoacan.

## Estado actual

Sistema funcional en desarrollo activo (Fase 2 en progreso). No es una maqueta estatica.

### Funcionalidades implementadas

- **Mapa interactivo** con Leaflet y 10 arboles reales geolocalizados en CECyTEM 33
- **CRUD completo** de arboles (crear, editar, eliminar, consultar)
- **Panel de administracion** con estadisticas y acciones
- **Captura movil** optimizada con selects/dropdowns, GPS automatico y busqueda
- **Subida de fotos** a Cloudflare R2 con metadatos sanitizados
- **Identificacion de especies** via Pl@ntNet API
- **Medicion de altura** con ArUco markers (scripts Python, pendiente prueba con regla impresa)
- **PWA basica** con manifest.json y service worker
- **Iconografia Lucide** (sin emojis en el codigo fuente)

### Stack tecnico

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18 + Leaflet |
| Base de datos | SQLite via better-sqlite3 |
| Estilos | CSS vanilla (tokens de diseño propios) |
| IA | Pl@ntNet (especies) + OpenRouter/Gemma 4 (validacion) |
| Almacenamiento fotos | Cloudflare R2 (10GB gratis) |
| Medicion altura | OpenCV + ArUco DICT_5X5_50 |
| Iconografia | lucide-react |
| Package manager | npm |

### Estructura del proyecto

```
src/
  app/           # Next.js App Router (pages + API routes)
  components/    # React components (Map, TreeCapture, DetailMap)
  lib/           # Database schema + utilities
public/          # PWA manifest, service worker, assets
scripts/         # Python scripts (ArUco measurement)
docs/            # Documentacion del proyecto
.claude/memory/  # Decisiones, reglas aprendidas, historial
```

## Como ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

Requiere Node.js 18+ y Python 3.11+ (para medicion ArUco).

## Funcionalidades pendientes

### Fase 2 (en progreso)

- Generar iconos PWA (192x192, 512x512)
- Modo offline con cola de capturas pendientes
- Prompt de instalacion PWA
- Validacion de GPS (que este dentro del campus)
- Validacion de fotos (tamano, formato)

### Fase 3 (no iniciada)

- QR unico por arbol
- Ficha publica mejorada con grafica de crecimiento
- Historial fotografico aprobado

### Fase 4 (parcial)

- Prueba de medicion ArUco con marcadores reales (pendiente: impresion de regla)
- Integracion Gemma 4 VLM como fallback/validacion
- Deteccion de alertas visuales

### Fase 5 (no iniciada)

- Exportacion CSV/XLSX
- Reportes por zona, especie y grupo
- Dashboard publico de impacto

## Restricciones conocidas

- **Sin autenticacion**: cualquier usuario puede crear/editar arboles (Fase 2)
- **SQLite local**: no soporta multiples usuarios concurrentes (aceptable para MVP)
- **Medicion ArUco**: pendiente prueba con regla impresa (sin acceso a impresora)
- **Conexion movil**: las pruebas en telefono se realizan con conexion de uso medido (compartiendo datos)

## Documentacion

La documentacion completa esta en `docs/`:

- [Vision del producto](docs/01-vision-producto.md)
- [Alcance funcional](docs/02-alcance-funcional.md)
- [Arquitectura tecnica](docs/03-arquitectura-tecnica.md)
- [Modelo de datos](docs/04-modelo-datos.md)
- [Modulo de IA](docs/05-modulo-ia.md)
- [Privacidad y seguridad](docs/06-privacidad-seguridad.md)
- [Roadmap](docs/07-roadmap.md)
- [Guia para alumnos](docs/08-guia-alumnos.md)
- [Analisis honesto de la maqueta](docs/09-analisis-maqueta.md)
- [API inicial propuesta](docs/10-api-inicial.md)
- [Backlog tecnico priorizado](docs/11-backlog-tecnico.md)
- [Metodologia de desarrollo](docs/12-metodologia-desarrollo.md)

## Principios del desarrollo

1. Primero datos confiables, despues automatizaciones.
2. La IA debe asistir, no reemplazar la validacion humana.
3. La interfaz publica debe proteger privacidad.
4. Cada medicion debe tener evidencia y fecha.
5. El sistema debe funcionar en condiciones reales de campo.
6. El proyecto debe poder crecer por etapas y ser entendible para alumnos.
7. Los cambios estructurales deben seguir especificacion previa y registrar decisiones.

## Metodologia de trabajo

ForestData usa Project Bootstrap + Persistent Context + Session Efficiency como base permanente de trabajo. Esto mantiene una memoria minima del proyecto, reduce relecturas innecesarias y evita perder decisiones entre sesiones.

Archivos operativos:

- `CLAUDE.md`: reglas de trabajo para agentes.
- `CONTEXTO.md`: estado activo y proximo paso.
- `.claude/memory/DECISIONS.md`: decisiones cerradas.
- `.claude/memory/learned-rules.md`: aprendizajes reutilizables.
- `.claude/memory/sessions.jsonl`: historial compacto de sesiones.
