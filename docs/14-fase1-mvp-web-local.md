# Fase 1 — MVP Web Local

Fecha: 2026-08-06
Estado: Codigo creado, pendiente commit y prueba end-to-end
Metodologia: SDD + Plan First (afecta >3 archivos, arquitectura definida)

---

## Objetivo

Construir un MVP funcional que permita registrar arboles reales, verlos en un mapa publico y administrarlos desde un panel privado. Un solo flujo end-to-end operativo sin datos simulados.

## Stack seleccionado

| Capa | Tecnologia | Razon |
|---|---|---|
| Frontend + Backend | Next.js 14+ (App Router) | Framework fullstack, SSR, file-based routing |
| Base de datos | SQLite via better-sqlite3 | Sin dependencias externas, archivos en disco, ideal para MVP local |
| ORM/query | better-sqlite3 directo | Sin overhead de ORM, SQL claro y control total |
| Mapas | Leaflet | Ya probado en la maqueta, CDN o npm |
| Estilos | CSS vanilla (existente) | Reutilizar styles.css de la maqueta, sin framework adicional |
| Auth | Sin auth en Fase 1 | Panel privado sin login; se agrega en Fase 2 |
| Package manager | npm | Funciona sin problemas de build scripts en Windows |
| Hosting | Local (localhost:3010) | Solo desarrollo local |

## Alcance incluido

### 1. Base de datos SQLite

Tablas minimas inspiradas en `docs/04-modelo-datos.md`:

```sql
CREATE TABLE trees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  species TEXT NOT NULL,
  zone TEXT NOT NULL,
  planted_at TEXT,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  health TEXT DEFAULT 'good' CHECK(health IN ('good','fair','poor')),
  height_cm REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE care_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tree_id INTEGER NOT NULL REFERENCES trees(id),
  water_liters REAL,
  height_cm REAL,
  notes TEXT,
  captured_at TEXT DEFAULT (datetime('now'))
);
```

### 2. API REST (Next.js API Routes)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /api/trees | Lista todos los arboles (con filtros opcionales) |
| POST | /api/trees | Crea un arbol nuevo |
| GET | /api/trees/[id] | Detalle de un arbol con historial |
| PUT | /api/trees/[id] | Actualiza un arbol |
| DELETE | /api/trees/[id] | Elimina un arbol |
| POST | /api/trees/[id]/care | Registra un cuidado |
| GET | /api/stats | Indicadores agregados (totales, por zona, por salud) |

### 3. Paginas

| Pagina | Ruta | Descripcion |
|---|---|---|
| Mapa publico | / | Mapa Leaflet con todos los arboles, popups informativos |
| Listado | /arboles | Tabla con filtros por zona y salud, busqueda |
| Detalle | /arboles/[id] | Ficha completa del arbol: datos, mapa, historial, grafica |
| Registro | /arboles/nuevo | Formulario para crear un arbol nuevo |
| Panel admin | /admin | Vista administrativa con listado completo y acciones |

### 4. Funcionalidades minimas

- Crear arbol con: codigo, especie, zona, GPS (lat/lng), salud, altura, notas
- Editar arbol existente
- Eliminar arbol
- Registrar cuidado (agua, notas)
- Ver arboles en mapa con popup
- Filtrar por zona y salud
- Buscar por nombre o codigo
- Estadisticas basicas (total, por zona, por salud)

## Alcance FUERA de Fase 1

- Autenticacion y permisos (Fase 2)
- App movil / PWA (Fase 2)
- Fotos reales (Fase 2)
- IA (Fase 4)
- QR (Fase 3)
- Exportacion (Fase 5)
- Privacidad de datos de alumnos (no hay datos de alumnos aun)

## Estructura de archivos

```
forest-data/
├── index.html              ← maqueta original (referencia)
├── forestdata-dash.html    ← maqueta original (referencia)
├── styles.css              ← maqueta original (referencia)
├── data.js                 ← maqueta original (referencia)
├── app.js                  ← maqueta original (referencia)
├── docs/                   ← documentacion
├── src/
│   ├── app/
│   │   ├── layout.jsx      ← layout raiz
│   │   ├── page.jsx        ← mapa publico (homepage)
│   │   ├── arboles/
│   │   │   ├── page.jsx    ← listado
│   │   │   ├── nuevo/
│   │   │   │   └── page.jsx ← formulario crear
│   │   │   └── [id]/
│   │   │       └── page.jsx ← detalle
│   │   └── admin/
│   │       └── page.jsx    ← panel admin
│   ├── api/
│   │   ├── trees/
│   │   │   ├── route.js    ← GET list, POST create
│   │   │   ├── [id]/
│   │   │   │   ├── route.js ← GET one, PUT update, DELETE
│   │   │   │   └── care/
│   │   │   │       └── route.js ← POST care log
│   │   └── stats/
│   │       └── route.js    ← GET stats
│   ├── lib/
│   │   └── db.js           ← Conexion SQLite + queries
│   └── components/
│       ├── Map.jsx          ← Componente Leaflet
│       ├── TreeTable.jsx    ← Tabla de arboles
│       └── TreeForm.jsx     ← Formulario de creacion
├── data/
│   └── forestdata.db       ← Base de datos SQLite (gitignored)
└── package.json
```

## Criterios de salida

1. `npm run dev` inicia el servidor en localhost:3010
2. La homepage muestra un mapa con arboles de ejemplo
3. Se puede crear un arbol nuevo desde /arboles/nuevo
4. El arbol nuevo aparece en el mapa y en el listado
5. Se puede ver el detalle de un arbol
6. Se puede registrar un cuidado
7. Los filtros por zona y salud funcionan
8. Las estadisticas se calculan desde la base de datos
9. No hay errores en consola del navegador ni del servidor

## Orden de ejecucion

1. Inicializar proyecto Next.js + instalar dependencias
2. Crear schema SQLite y sembrar datos de ejemplo
3. Crear conexion a DB (lib/db.js)
4. Implementar API routes (trees, stats)
5. Crear componente Map con Leaflet
6. Crear homepage (mapa publico)
7. Crear pagina de listado con filtros
8. Crear formulario de registro
9. Crear pagina de detalle
10. Crear panel admin basico
11. Verificar flujo end-to-end
12. Actualizar CONTEXTO.md y README

---

*Spec creada: 2026-08-06 | SDD + Plan First activado*
