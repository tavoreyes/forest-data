---
name: forest-close
description: "Close protocol for ForestData sessions (Project Bootstrap). Use at the end of EVERY work session: when the user says 'close', 'cerrar sesion', 'terminar', 'hoy no mas', 'guarda el estado', or when wrapping up work. Also trigger when the user asks to commit, save progress, or summarize what was done."
---

# Forest Close

Persist session state so the next session boots with full context (Project Bootstrap). Execute these steps in order; skip steps with no real changes.

## Step 1: Update CONTEXTO.md

Read `CONTEXTO.md` and update it with:

- What was done this session (files created/modified, features completed)
- What's pending (specific next steps, not vague)
- Any blockers or decisions needed
- Current stack and key technical notes

Keep it concise. This is a status board, not a diary.

## Step 2: Register decisions

If any architectural or methodological decisions were made:

1. Read `.claude/memory/DECISIONS.md`
2. Add a new `## DEC-XXX - Título` entry with: Fecha, Decision, Razon, Trade-offs, Estado
3. Follow the existing format exactly (next number after the last DEC)

Skip if no decisions were made.

## Step 3: Register learnings

If any reusable lessons were learned:

1. Read `.claude/memory/learned-rules.md`
2. Add 1-line rules in the form: "Cuando X, hacer Y porque Z"
3. Don't add obvious or one-off observations

Skip if nothing reusable was learned.

## Step 4: Log session

Append a JSON line to `.claude/memory/sessions.jsonl`:

```json
{"date":"YYYY-MM-DD","task":"brief description","result":"what was accomplished"}
```

## Step 5: Verify methodology compliance

- If the task was structural and was implemented WITHOUT a prior spec, note it in CONTEXTO.md as pending (SDD + Plan First was skipped).
- If everything is committed/pushed, reflect it in the session `result`.

## Rules

- Don't create new docs during close. Just update existing ones.
- Don't over-document. If nothing meaningful changed, skip steps.
- The goal is that the next session can boot and know exactly where we are.
- Never delete or overwrite existing entries in DECISIONS.md or learned-rules.md. Only append.
- If the user closes via `close.bat` / `checkpoint.js`, the memory updates above still apply — run them first.
