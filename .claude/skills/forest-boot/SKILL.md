---
name: forest-boot
description: "Boot protocol for ForestData sessions (Project Bootstrap + Session Efficiency). Use at the start of EVERY work session: when the user says 'boot', 'iniciar sesion', 'empezar', 'que teniamos', 'donde quedamos', or when resuming work after inactivity. Also trigger when the user mentions working on ForestData without prior context in the conversation."
---

# Forest Boot

Initialize context for a ForestData work session following Project Bootstrap + Session Efficiency. Execute these steps in order, reading only what's needed.

## Step 1: Read core context

Read these files (skip any that don't exist):

1. `CLAUDE.md` — project config, methodology, canonical paths
2. `CONTEXTO.md` — active state, what's done, what's pending
3. `.claude/memory/DECISIONS.md` — closed decisions

## Step 2: Checkpoint (optional)

If a recent checkpoint exists under `.claude/checkpoints/` (`session-<fecha>.jsonl`), read the latest one as additional context before continuing.

## Step 3: Read task-specific canonical docs (Session Efficiency)

Based on the task, read ONLY the relevant docs from `docs/`. Do not read all of them:

- Producto: `README.md`, `docs/01-vision-producto.md`, `docs/02-alcance-funcional.md`
- Arquitectura: `docs/03-arquitectura-tecnica.md` + decisiones vigentes
- Datos: `docs/04-modelo-datos.md`
- Privacidad: `docs/06-privacidad-seguridad.md`
- Ejecución: `docs/07-roadmap.md` + `docs/11-backlog-tecnico.md`
- Análisis: `docs/13-analisis-honesto-proyecto.md`
- Fase 1 spec: `docs/14-fase1-mvp-web-local.md`

Never read more than 4-5 files total (core + task-specific combined).

## Step 4: Classify the task

Classify as:

- **Tarea simple**: documentación menor, ajuste puntual, corrección localizada → execute directly.
- **Tarea estructural**: afecta >3 archivos, cambia stack, DB, API, autenticación/permisos, fotos/GPS/datos de alumnos, integra IA, o toca despliegue/seguridad → **SDD + Plan First obligatorio**: create a brief spec before implementing (objetivo, alcance dentro/fuera, archivos afectados, contratos, riesgos, criterios de salida).

## Step 5: Summarize

Output exactly 4 bullets:

1. **Estado actual** — what's done, what's in progress
2. **Decision relevante** — any DEC that affects the upcoming work
3. **Siguiente paso** — what to do now
4. **Tipo de tarea** — simple (ejecutar) o estructural (especificar primero, SDD)

## Rules

- If CONTEXTO.md says everything is done, say so and ask what to work on next
- If there are blockers, list them clearly
- Don't re-read files you've already seen in this conversation
- Don't create new docs during boot. Just read and orient.
