---
name: forest-boot
description: "Boot protocol for ForestData sessions. Use at the start of EVERY work session: when the user says 'boot', 'iniciar sesion', 'empezar', 'que teniamos', 'donde quedamos', or when resuming work after inactivity. Also trigger when the user mentions working on ForestData without prior context in the conversation."
---

# Forest Boot

Initialize context for a ForestData work session. Execute these steps in order, reading only what's needed.

## Step 1: Read core context

Read these files (skip any that don't exist):

1. `CLAUDE.md` — project config, methodology, canonical paths
2. `CONTEXTO.md` — active state, what's done, what's pending
3. `.claude/memory/DECISIONS.md` — closed decisions

## Step 2: Read task-specific docs

Based on what the user wants to work on, read ONLY the relevant docs from `docs/`:

- Architecture: `docs/03-arquitectura-tecnica.md`
- Data model: `docs/04-modelo-datos.md`
- Privacy: `docs/06-privacidad-seguridad.md`
- Roadmap: `docs/07-roadmap.md`
- Fase 1 spec: `docs/14-fase1-mvp-web-local.md`
- Analysis: `docs/13-analisis-honesto-proyecto.md`

Don't read all of them. Pick based on the task.

## Step 3: Summarize

Output exactly 3 bullets:

1. **Estado actual** — what's done, what's in progress
2. **Decision relevante** — any DEC that affects the upcoming work
3. **Siguiente paso** — what to do now

## Rules

- Never read more than 4 files total (core + task-specific combined)
- If CONTEXTO.md says everything is done, say so and ask what to work on next
- If there are blockers, list them clearly
- Don't re-read files you've already seen in this conversation
