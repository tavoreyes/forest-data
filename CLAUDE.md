# CLAUDE.md - ForestData

## Proposito del proyecto

ForestData es una plataforma educativa y ambiental para registrar, geolocalizar y dar seguimiento publico al crecimiento de arboles cuidados por alumnos.

El proyecto debe priorizar datos confiables, privacidad de alumnos, trazabilidad de cambios y aprendizaje tecnico del equipo. La maqueta actual es referencia visual, no arquitectura final.

## Metodologia activa

Base permanente:

- Project Bootstrap: mantener estructura, memoria y decisiones desde el inicio.
- Persistent Context: evitar perdida de contexto entre sesiones.
- Session Efficiency: cargar solo los archivos necesarios para la tarea.

Activacion obligatoria de SDD + Plan First:

- Cambios que afecten mas de 3 archivos.
- Eleccion o cambio de stack tecnico.
- Diseno de base de datos, API, autenticacion o permisos.
- Manejo de fotos, GPS, datos de alumnos o privacidad.
- Integracion de IA.
- Cambios de arquitectura o despliegue.

## Destinos canonicos

| Tipo | Ruta | Regla |
|---|---|---|
| Vision y alcance | `docs/01-vision-producto.md`, `docs/02-alcance-funcional.md` | Fuente primaria de producto |
| Arquitectura | `docs/03-arquitectura-tecnica.md` | Debe actualizarse antes de cambios estructurales |
| Datos | `docs/04-modelo-datos.md` | Contrato inicial del dominio |
| Privacidad | `docs/06-privacidad-seguridad.md` | Referencia obligatoria para datos reales |
| Roadmap | `docs/07-roadmap.md` | Secuencia de fases |
| Metodologia | `docs/12-metodologia-desarrollo.md` | Protocolo de trabajo del proyecto |
| Estado activo | `CONTEXTO.md` | Resumen corto para iniciar sesiones |
| Decisiones | `.claude/memory/DECISIONS.md` | Registro de decisiones cerradas |
| Aprendizajes | `.claude/memory/learned-rules.md` | Reglas aprendidas por experiencia |
| Sesiones | `.claude/memory/sessions.jsonl` | Log compacto de sesiones |

## Boot minimo

Al iniciar una sesion de trabajo estructural:

1. Leer `CLAUDE.md`.
2. Leer `CONTEXTO.md`.
3. Leer `.claude/memory/DECISIONS.md`.
4. Leer solo los documentos especificos de la tarea.
5. Resumir en 3 puntos: estado actual, decision relevante, siguiente paso.

## Close minimo

Al cerrar una sesion de trabajo:

1. Actualizar `CONTEXTO.md` con lo hecho, lo pendiente y bloqueos.
2. Registrar decisiones arquitectonicas nuevas en `.claude/memory/DECISIONS.md`.
3. Registrar aprendizajes reutilizables en `.claude/memory/learned-rules.md`.
4. Agregar una linea JSON compacta a `.claude/memory/sessions.jsonl` cuando aplique.

## Invariantes

- No usar datos reales de alumnos sin politica de privacidad y consentimiento definidos.
- La interfaz publica no debe mostrar nombres completos, matriculas ni datos sensibles.
- La IA debe sugerir, no validar ni modificar datos finales por si sola.
- Los cambios importantes deben ser auditables.
- Las decisiones cerradas no se reabren sin razon explicita.
- Para tareas pequenas y claras, ejecutar directo; para tareas estructurales, especificar primero.
