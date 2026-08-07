# Decision Journal - ForestData

Este archivo registra decisiones arquitectonicas o metodologicas cerradas. No debe usarse para notas temporales.

## DEC-001 - Metodologia base del proyecto

Fecha: 2026-05-12

Decision:

ForestData usara Project Bootstrap + Persistent Context + Session Efficiency como base permanente de trabajo.

Razon:

El proyecto esta en etapa temprana y necesita continuidad entre sesiones, orientacion clara para agentes, ahorro de tokens y registro de decisiones desde el inicio.

Trade-offs:

- A favor: menos perdida de contexto, mejor continuidad, menos relectura de documentos.
- En contra: requiere mantener `CONTEXTO.md` y memoria actualizados.

Estado: Cerrada.

## DEC-002 - Activacion selectiva de SDD + Plan First

Fecha: 2026-05-12

Decision:

SDD + Plan First no se usara para toda tarea pequena, pero sera obligatorio para cambios estructurales.

Se activa cuando:

- El cambio afecta mas de 3 archivos.
- Se elige o cambia stack tecnico.
- Se disena base de datos, API, autenticacion o permisos.
- Se manejan fotos, GPS, datos de alumnos o privacidad.
- Se integra IA.
- Se cambia arquitectura o despliegue.

Razon:

ForestData puede avanzar rapido en tareas acotadas, pero requiere especificacion previa cuando entran datos sensibles, decisiones de arquitectura o flujos criticos.

Trade-offs:

- A favor: evita burocracia en tareas simples y reduce riesgo en tareas criticas.
- En contra: requiere criterio para detectar a tiempo cuando una tarea dejo de ser simple.

Estado: Cerrada.

## DEC-003 - Stack tecnico del MVP

Fecha: 2026-08-06

Decision:

ForestData Fase 1 usara Next.js (App Router) + SQLite via better-sqlite3 como stack tecnico. Hosting local unicamente.

Razon:

- Next.js: framework fullstack con SSR, file-based routing y API routes integradas. Ecosistema maduro.
- SQLite: sin dependencias externas, archivo unico en disco, ideal para MVP educativo local. Sin necesidad de servidor de DB separado.
- Hosting local: priorizar funcionalidad sobre disponibilidad. Deploy remoto se evalua despues de Fase 2.

Alternativa descartada:

- Next.js + Supabase: descartado porque requiere cuenta externa y configuracion de proyecto en la nube. Para un MVP local, SQLite es suficiente y mas simple.
- SvelteKit + SQLite: descartado porque Next.js tiene mejor ecosistema y el equipo ya conoce React.

Trade-offs:

- A favor: cero dependencias externas, arranque rapido, sin costo, control total sobre la DB.
- En contra: SQLite no escala a multiples usuarios concurrentes (aceptable para Fase 1-2). Sin auth nativo (se agrega manualmente en Fase 2).

Consecuencia:

- La DB vive en `data/forestdata.db` (gitignored).
- El schema se define en `src/lib/db.js`.
- Las API routes usan better-sqlite3 directo, sin ORM.
- Para deploy futuro, evaluar migracion a PostgreSQL o Supabase.

Estado: Cerrada.

## DEC-004 — Package manager: pnpm → npm

Fecha: 2026-08-06

Decision:

El proyecto usara npm en lugar de pnpm. La preferencia inicial era pnpm por seguridad (supply chain), pero pnpm 11 en Windows falla con `ERR_PNPM_IGNORED_BUILDS` al no poder aprobar scripts de compilacion de `unrs-resolver` (dependencia transitive de eslint-config-next). No hay forma no-interactiva de aprobarlos.

Razon:

- pnpm 11 + Windows: `pnpm approve-builds` requiere input interactivo, no hay flag `--yes`.
- `pnpm.onlyBuiltDependencies` en package.json ya no es leido por pnpm 11.
- `.npmrc` con `allowBuilds` tampoco funciona.
- `unrs-resolver` es dependencia de `eslint-import-resolver-typescript` → `eslint-config-next`. No se puede evitar sin romper ESLint.
- npm instala better-sqlite3 sin problemas (usa prebuilt binaries).

Alternativa descartada:

- forzar pnpm: requiere resolver el bloqueo de build scripts, que depende de un fix de pnpm o de eliminar eslint-config-next.

Trade-offs:

- A favor: cero friccion, funciona inmediatamente.
- En contra: sin las ventajas de pnpm (hard links, estricto con dependencias). Se puede mitigar con `npm audit` periodicamente.

Consecuencia:

- `package-lock.json` se commitea (no se ignora).
- `pnpm-lock.yaml` se elimina.
- Revisar periodicamente con `npm audit`.

Estado: Cerrada.

## DEC-005 — UI/UX captura: dropdowns en lugar de inputs manuales

Fecha: 2026-08-07

Decision:

El formulario de captura TreeCapture usara selects/dropdowns para especie, zona y salud en lugar de inputs de texto manuales.

Razon:

- Los alumnos capturan rapido con opciones predefinidas.
- Reduce errores de escritura (especies mal escritas, zonas inconsistentes).
- Mejora la experiencia en movil (tap en vez de escribir).

Trade-offs:

- A favor: mas rapido, menos errores, mejor UX movil.
- En contra: requiere mantenimiento de listas de opciones.

Estado: Cerrada.

## DEC-006 — PWA basica: manifest + service worker

Fecha: 2026-08-07

Decision:

ForestData tendra una PWA basica con manifest.json y service worker para la pagina /capturar.

Razon:

- Permite instalacion en pantalla de inicio movil.
- Mejora la experiencia de uso en campo.
- Service worker permite cache basico.

Trade-offs:

- A favor: expericia de app nativa, funciona sin conexión posterior.
- En contra: requiere generacion de iconos y configuracion de offline.

Estado: Cerrada.

## DEC-007 — Sidebar colapsable en movil

Fecha: 2026-08-07

Decision:

El sidebar de navegacion sera colapsable en movil con boton toggle "Mas".

Razon:

- En pantallas pequenas el sidebar ocupa mucho espacio.
- Los usuarios movil necesitan acceso rapido a navegacion sin scroll.

Trade-offs:

- A favor: mejor uso del espacio en movil.
- En contra: requiere JS adicional para toggle.

Estado: Cerrada.

## DEC-008 — Iconografia Lucide (sin emojis)

Fecha: 2026-08-07

Decision:

Todo el codigo fuente usara iconos Lucide React (`lucide-react`) en lugar de emojis.

Razon:

- Los emojis no se renderizan consistentemente entre dispositivos.
- Lucide provides icons SVG consistentes y personalizables.
- Mejora la accesibilidad y el control visual.

Trade-offs:

- A favor: consistencia visual, mejor accesibilidad, control de tamano y color.
- En contra: requiere importar componentes individuales.

Consecuencia:

- Todos los archivos .jsx/.tsx deben usar lucide-react.
- Se agrego regla a CLAUDE.md.

Estado: Cerrada.

## DEC-009 — Prueba ArUco impresa pospuesta

Fecha: 2026-08-07

Decision:

La prueba de medicion con regla ArUco impresa se pospone hasta nuevo aviso.

Razon:

1. No se dispone de impresora en este momento.
2. Las pruebas en movil se realizan con conexion de uso medido (compartiendo datos desde el movil).
3. La funcionalidad de medicion esta implementada y lista para probarse cuando las condiciones lo permitan.

Trade-offs:

- A favor: no bloquea otras fases, evita consumo innecesario de datos moviles.
- En contra: no se puede verificar la precision de la medicion ArUco.

Consecuencia:

- La regla generada (assets/regla_aruco_30cm.png) estara lista para cuando se tenga acceso a impresora.
- La medicion ArUco queda como funcionalidad implementada pero no verificada en campo.

Estado: Cerrada.
