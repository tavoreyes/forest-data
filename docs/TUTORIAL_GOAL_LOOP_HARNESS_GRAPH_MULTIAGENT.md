# Tutorial: Goal / Loop / Harness / Graph / Multi-Agent — Aplicado a ForestData

**Objetivo**: Entender la funcionalidad REAL de cada término en el contexto de ForestData, aunque hoy uses opencode y no Hermes. Esto te permite hablar el mismo lenguaje que la arquitectura de agentes moderna y migrar cuando toque.

---

## 🎯 GOAL (Objetivo Verificable)

### Definición Técnica
> **Goal = Estado final específico y medible que define "terminado". No es "hacer X", es "X cumple criterio Y".**

### En ForestData — Ejemplos Concretos

| ❌ Meta Vaga (No es Goal) | ✅ Goal Real (Verificable) |
|---|---|
| "Crear API de árboles" | `POST /api/trees` retorna 201 + árbol aparece en `GET /api/trees` + visible en mapa público |
| "Mejorar privacidad" | `privacy-filter.js` detecta 100% patrones PII en staged files + cero exposiciones en auditoría semanal |
| "Optimizar tokens" | Token usage/sesión < 15k (70% reducción vs baseline 50k) medido por Token Optimizer MCP |
| "Implementar auth" | Usuario `student` puede crear árbol → status `draft` → docente ve en panel → aprueba → público ve ficha |

### Anatomía de un Goal (Plantilla ForestData)
```markdown
## Goal: [Nombre Corto]
**Criterio de Éxito (Automatizable):**
- [ ] Test E2E: `npm run test:e2e -- --grep "Goal name"` → PASS
- [ ] Lint: `npm run lint` → 0 errors
- [ ] Typecheck: `npm run typecheck` → 0 errors
- [ ] Privacidad: `node .claude/scripts/privacy-filter.js <staged>` → 0 hallazgos
- [ ] Métrica: [tokens/latency/coverage] ≤ [target]

**Evidencia Requerida:** [logs, screenshots, JSON output, test report]
**Stop Rule:** Si cualquier criterio falla → NO está done.
```

### Por Qué Importa
Sin Goal explícito, el agente (o tú) hace loop infinito "mejorando". El Goal es la **condición de parada** del Loop.

---

## 🔄 LOOP (Ciclo de Evidencia)

### Definición Técnica
> **Loop = Ciclo controlado: Acción → Evidencia → Feedback → Decisión (continuar/parar/reintentar). No es "reintentar hasta que funcione".**

### En ForestData — El Loop Estándar (SDD + TDD)

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOOP FORESTDATA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRIGGER: Nueva tarea / spec aprobada / test fallando           │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────┐                                           │
│  │  ACCIÓN          │  Escribe test que FALLA (TDD)             │
│  │  (Agent/Dev)     │  O: Implementa código mínimo              │
│  └────────┬─────────┘                                           │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────┐                                           │
│  │  EVIDENCIA       │  npm test → PASS/FAIL                     │
│  │  (Determinista)  │  npm run lint → 0/errors                  │
│  │                  │  npm run typecheck → 0/errors             │
│  │                  │  privacy-filter → 0 hallazgos             │
│  └────────┬─────────┘                                           │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────┐                                           │
│  │  FEEDBACK        │  Compacto y accionable:                   │
│  │                  │  "Test X falla: expected 201 got 400"     │
│  │                  │  "Lint error line 42: unused var"         │
│  │                  │  NO: "El código se ve mal"                │
│  └────────┬─────────┘                                           │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────┐                                           │
│  │  DECISIÓN        │  ✅ PASS → Goal alcanzado → STOP          │
│  │  (Stop Rules)    │  🔄 FAIL + retries < 2 → Reintentar       │
│  │                  │  🔄 FAIL + retries ≥ 2 → Investigar       │
│  │                  │  ❌ Budget/timeout → Escalar humano       │
│  └──────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Stop Rules Obligatorios en ForestData
```javascript
// .claude/loop-config.json
{
  "maxRetries": 2,
  "maxRuntimeMinutes": 60,
  "tokenBudgetPerLoop": 5000,
  "stopConditions": {
    "success": "allEvidencePass",
    "retry": "evidenceFail && retries < maxRetries",
    "investigate": "evidenceFail && retries >= maxRetries",
    "escalate": "tokenBudgetExceeded || runtimeExceeded || privacyViolation"
  }
}
```

### Anti-Patrón Común (Lo que NO es Loop)
```
❌ "El agente dice que terminó" → STOP
❌ "Se ve bien" → STOP  
❌ "Intenté 5 veces y casi" → CONTINUAR
❌ Sin evidence checks → Loop en confianza
```

### En Tu Flujo Actual (opencode)
Cada vez que ejecutas:
1. `npm run test` → **Evidencia**
2. `npm run lint` → **Evidencia**
3. Lees output → **Feedback**
4. Decides fix/retry/done → **Decisión**

**Eso YA es un Loop. Solo falta formalizarlo.**

---

## 🏗️ HARNESS (Entorno del Agente)

### Definición Técnica
> **Harness = Todo lo que rodea al modelo para que pueda actuar en el mundo real. Test del harness: "Saca el modelo de tu diagrama. Lo que queda es el harness."**

### En ForestData — Tu Harness Actual (opencode)

| Capa del Harness | Implementación Actual | Gap vs Producción |
|---|---|---|
| **Context Injection** | `CLAUDE.md` + `CONTEXTO.md` + `DECISIONS.md` | ✅ Completo |
| **Action Surfaces** | `read`, `write`, `edit`, `bash`, `glob`, `grep` | ⚠️ Falta: Browser, DB directo, Git MCP |
| **Persistence** | `.claude/memory/` + `CONTEXTO.md` + checkpoints | ✅ Completo |
| **Execution Control** | Timeouts en bash, token budget manual | ⚠️ Falta: Retry policy, sub-agent spawn, approval gates |
| **Safety** | Privacy filter script, invariants en CLAUDE.md | ⚠️ Falta: Allow lists, secret handling, sandbox |
| **Observability** | Logs bash, token count manual | ❌ Falta: Traces, cost tracking, latency |

### Harness Mínimo Viable para ForestData (Checklist)

```yaml
# .claude/harness.yaml
contextInjection:
  - CLAUDE.md
  - CONTEXTO.md
  - .claude/memory/DECISIONS.md
  - .claude/memory/learned-rules.md
  - docs/specs/{active}.md  # cuando hay spec aprobada

actionSurfaces:
  filesystem: { read, write, edit, glob, grep }
  shell: { npm, git, node, python }
  database: { sqlite: "data/forestdata.db" }  # VÍA MCP
  browser: { playwright: "tests/e2e/" }       # VÍA MCP
  git: { commit, push, diff, log }            # VÍA MCP

persistence:
  decisions: ".claude/memory/DECISIONS.md"
  learnings: ".claude/memory/learned-rules.md"
  sessions: ".claude/memory/sessions.jsonl"
  checkpoints: ".claude/checkpoints/"
  context: "CONTEXTO.md"

executionControl:
  timeoutSeconds: 120
  maxRetries: 2
  tokenBudgetPerTask: 8000
  subAgentSpawn: false  # opencode no soporta, Hermes sí

safety:
  privacyFilter: ".claude/scripts/privacy-filter.js"
  invariants: "CLAUDE.md#invariantes"
  allowList: [ "src/", "docs/", "tests/", ".claude/" ]
  denyList: [ "data/forestdata.db", ".env", "node_modules/" ]
  secretHandling: "never_in_context"

observability:
  traceTools: true
  logLevel: "info"
  costTracking: "token-optimizer-mcp"
```

### Cuándo Necesitas Harness Completo (Hermes)
- **Ahora (opencode)**: Harness parcial → tú eres el "middleware" (decides, apruebas, verificas)
- **Fase 2+ (Hermes)**: Harness completo → agente autónomo 24/7 con safety gates

---

## 🕸️ GRAPH (Topología y Flujo)

### Definición Técnica
> **Graph = Coordinación de múltiples nodos especializados con estado compartido, routing condicional, fan-out/fan-in. Un Loop es un Grafo de 1 nodo. Se compone Grafos cuando 1 Loop no basta.**

### En ForestData — Cuándo Necesitas Graph

| Fase | ¿Loop Basta? | ¿Graph Necesario? | Por Qué |
|---|---|---|---|
| **Fase 1 (MVP Web Local)** | ✅ SÍ | ❌ NO | 1 agente, 1 contexto, CRUD lineal |
| **Fase 2 (Captura Móvil)** | ❌ NO | ✅ SÍ | Alumno captura → Docente valida → Admin aprueba → Público ve = **Fan-out/Fan-in** |
| **Fase 3 (QR + Ficha Pública)** | ❌ NO | ✅ SÍ | QR genera token → Resuelve árbol → Filtra datos aprobados → Renderiza = **Pipeline con branching** |
| **Fase 4 (IA Asistida)** | ❌ NO | ✅ SÍ | Foto → IA analiza (especie/altura/salud) → Humano valida → Persiste = **Nodos especializados en paralelo** |
| **Fase 5 (Reportes/Operación)** | ❌ NO | ✅ SÍ | Múltiples reportes paralelos + alertas + backups = **Grafo de mantenimiento** |

### Graph ForestData Fase 2 (Ejemplo Real)

```
┌────────────────────────────────────────────────────────────────────┐
│                    GRAPH: CAPTURA MÓVIL → PÚBLICO                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐         │
│  │   ALUMNO    │     │  DOCENTE    │     │   ADMIN     │         │
│  │  (Nodo A)   │     │  (Nodo B)   │     │  (Nodo C)   │         │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘         │
│         │                   │                   │                 │
│         ▼                   ▼                   ▼                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐         │
│  │ Captura:    │     │ Revisa:     │     │ Aprueba/    │         │
│  │ - GPS       │     │ - Foto OK   │     │ Rechaza     │         │
│  │ - Foto      │     │ - Especie   │     │ - validation│         │
│  │ - Altura    │     │ - Altura    │     │   _status   │         │
│  │ - QR scan   │     │ - Salud     │     │ - Genera QR │         │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘         │
│         │                   │                   │                 │
│         └───────────────────┼───────────────────┘                 │
│                             ▼                                     │
│                    ┌─────────────────┐                            │
│                    │   FAN-IN JOIN   │                            │
│                    │ validation_     │                            │
│                    │ status=approved │                            │
│                    └────────┬────────┘                            │
│                             ▼                                     │
│                    ┌─────────────────┐                            │
│                    │   PÚBLICO       │                            │
│                    │ (Nodo D)        │                            │
│                    │ - Ve ficha      │                            │
│                    │ - Solo datos    │                            │
│                    │   aprobados     │                            │
│                    └─────────────────┘                            │
│                                                                    │
│  ROUTING CONDITIONS:                                               │
│  - Alumno → Docente:   SIEMPRE (care_log creado)                 │
│  - Docente → Admin:    SI validation_status = pending_review     │
│  - Docente → Alumno:   SI rechaza (feedback + reintento)         │
│  - Admin → Público:    SI validation_status = approved           │
│  - Admin → Docente:    SI pide más info                          │
│                                                                    │
│  STATE SCHEMA (compartido por edges):                             │
│  { tree_id, care_log_id, validation_status,                      │
│    approved_by, approved_at, public_data_hash }                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Diferencia Clave: Loop vs Graph en Código

```javascript
// LOOP (Fase 1) - Un agente, ciclo simple
async function loopCrearArbol(datos) {
  let retries = 0;
  while (retries < 3) {
    const result = await crearArbol(datos);        // Acción
    const evidence = await verifyArbol(result.id); // Evidencia
    if (evidence.ok) return result;                // Stop: éxito
    retries++;                                      // Stop: retry
  }
  throw new Error("Max retries");                  // Stop: escalate
}

// GRAPH (Fase 2) - Nodos especializados, routing
const graphCapturaMovil = {
  nodes: {
    alumno: { tool: "mobile_capture", prompt: "capture_prompt" },
    docente: { tool: "review_ui", prompt: "review_prompt" },
    admin: { tool: "admin_panel", prompt: "approve_prompt" },
    publico: { tool: "public_view", prompt: "view_prompt" }
  },
  edges: [
    { from: "alumno", to: "docente", condition: "always" },
    { from: "docente", to: "admin", condition: "status === 'pending_review'" },
    { from: "docente", to: "alumno", condition: "status === 'rejected'" },
    { from: "admin", to: "publico", condition: "status === 'approved'" },
    { from: "admin", to: "docente", condition: "needs_more_info" }
  ],
  state: "shared_validation_schema",
  checkpoints: ["alumno_done", "docente_done", "admin_done"]
};
```

### Regla de Oro
> **"Clavar el Loop primero; cablear el Graph solo cuando el trabajo lo pida."**
> 
> ForestData Fase 1 = **Solo Loop**. No construyas Graph todavía.

---

## 🤖 MULTI-AGENT (Múltiples Agentes Coordinados)

### Definición Técnica
> **Multi-Agent = Ejecución paralela en contextos completamente aislados, con coordinador que orquesta. No es "un agente que hace todo". Es "agentes especialistas que no comparten contexto sucio".**

### En ForestData — Perfiles de Agentes (Crew)

| Perfil | Especialización | Modelo | Contexto Aislado | Cuándo Actúa |
|---|---|---|---|---|
| **Architect** | Decisiones stack, DB, API, privacy | Nemotron Ultra | `docs/03-architectura.md`, `DECISIONS.md` | Inicio fase, cambios estructurales |
| **Backend Dev** | API routes, SQLite, auth | Nemotron Super | `src/app/api/`, `src/lib/db.js` | Implementar endpoints |
| **Frontend Dev** | Pages, components, Leaflet, CSS | Nemotron Super | `src/app/`, `src/components/`, `globals.css` | UI/UX, mapas, forms |
| **Privacy Auditor** | Scan PII, validar invariants | Llama 3.3 70B | `privacy-filter.js`, `docs/06-privacidad.md` | Pre-commit, weekly audit |
| **QA Engineer** | Playwright E2E, test data | Nemotron Super | `tests/e2e/`, `test-data/` | Post-implement, pre-merge |
| **Tech Writer** | Docs, specs, CONTEXTO.md | Qwen 80B (cheap) | `docs/`, `CLAUDE.md`, `CONTEXTO.md` | Close session, spec writing |
| **DevOps** | Deploy, scripts, CI/CD | Llama 3.3 70B | `scripts/`, `.github/`, `package.json` | Release, infra changes |

### Cómo Funciona Multi-Agent en Hermes (v0.6.0+)

```yaml
# Arquitectura de coordinación (de BLUEPRINT_HERMES_AGENT.md)
coordinator: "Hermes (orquestador)"
agents:
  - name: "researcher"
    role: "Investigación técnica, comparativas, docs"
    model: "Nemotron Ultra"
    context: "aislado - solo docs + web search"
    tools: ["web_search", "read_docs"]
    
  - name: "implementer"
    role: "Escribe código, tests, fixea bugs"
    model: "Nemotron Super"
    context: "aislado - solo src/ + spec aprobada"
    tools: ["read", "write", "edit", "bash", "test"]
    
  - name: "reviewer"
    role: "Code review, security, privacy, architecture"
    model: "Llama 3.3 70B"
    context: "aislado - recibe output de implementer, NO historial de researcher"
    tools: ["read", "grep", "privacy_filter", "lint"]
    
routing:
  - researcher → implementer: "spec aprobada + decisiones"
  - implementer → reviewer: "código + tests + evidence"
  - reviewer → implementer: "feedback estructurado" (si fail)
  - reviewer → coordinator: "approved" (si pass)
```

### Ventaja Real vs Single Agent

| Métrica | Single Agent (Contexto Único) | Multi-Agent (Contextos Aislados) |
|---|---|---|
| **Tokens/sesión** | 50k-100k (acumula todo) | 10k-20k por agente (contextos limpios) |
| **Calidad código** | Media (contexto contaminado) | Alta (reviewer con ojos frescos) |
| **Privacidad** | Riesgo leak entre tareas | Aislamiento garantizado |
| **Paralelización** | No | Sí (research + implement simultáneo) |
| **Debugging** | Difícil (historial mezclado) | Fácil (traces por nodo) |
| **Costo** | Alto | 40-60% menor |

### Anti-Patrón: "Multi-Agent Falso"
```
❌ Un agente que "simula" roles cambiando system prompt
❌ Compartir todo el historial entre "agentes"
❌ Sin routing conditions definidas
❌ Sin state schema compartido
❌ Coordinador que micro-gestiona en lugar de orquestar
```

### En ForestData — Cuándo Migrar a Multi-Agent

| Trigger | Acción |
|---|---|
| Fase 2 iniciada (GPS + fotos + validación) | Activar `researcher` (flujos alumno-docente) + `implementer` (PWA) + `reviewer` (privacidad) |
| Tokens/sesión > 30k consistentemente | Split contextos → multi-agent |
| Defectos de privacidad en staging | `privacy_auditor` como nodo dedicado |
| Equipo crece (más devs) | Cada dev ↔ su agente especialista |

---

## 📚 Resumen: Mapa Mental para ForestData

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FORESTDATA TODAY (Fase 1)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GOAL: "POST /api/trees crea árbol y aparece en mapa público"      │
│       │                                                             │
│       ▼                                                             │
│  LOOP: TDD cycle (test→code→verify) + SDD gate                     │
│       │                                                             │
│       ▼                                                             │
│  HARNESS: opencode + filesystem + shell + SQLite + checkpoints     │
│       │                                                             │
│       ▼                                                             │
│  GRAPH: N/A (solo 1 loop)                                          │
│       │                                                             │
│       ▼                                                             │
│  MULTI-AGENT: N/A (tú + opencode = pair programming)               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FORESTDATA FUTURO (Fase 2-4)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GOALS: Múltiples por fase (captura→validación→público→IA→reportes)│
│       │                                                             │
│       ▼                                                             │
│  LOOPS: Uno por nodo especializado (alumno, docente, admin, IA)    │
│       │                                                             │
│       ▼                                                             │
│  HARNESS: Hermes completo (MCP, mem0, crons, safety, observability)│
│       │                                                             │
│       ▼                                                             │
│  GRAPH: Coordinación alumno→docente→admin→público + IA pipeline    │
│       │                                                             │
│       ▼                                                             │
│  MULTI-AGENT: Crew de 5-7 agentes (architect, backend, frontend,   │
│               privacy, QA, writer, devops) con contextos aislados  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Ejercicio Práctico: Identifica en Tu Trabajo Actual

### Esta Semana (Fase 1), ¿qué estás usando?

1. **Goal**: ¿Cuál es el criterio de éxito EXACTO de tu tarea actual? Escríbelo.
2. **Loop**: ¿Ejecutas test → lees output → decides fix/retry/done? Ese es tu loop.
3. **Harness**: Lista tus action surfaces (read, write, bash, npm, git, sqlite...).
4. **Graph**: ¿Hay fan-out/fan-in? ¿Múltiples especialistas? Si no → no necesitas graph.
5. **Multi-Agent**: ¿Tú + opencode? Eso es pair programming, no multi-agent.

### Plantilla de Auto-Diagnóstico
```markdown
## Mi Diagnóstico Actual (Fecha: ____)

### Goal Actual
- [ ] Escrito y verificable
- [ ] Criterios automatizables

### Loop Actual
- [ ] Evidence checks definidos (test, lint, typecheck, privacy)
- [ ] Stop rules claras (max retries, budget, escalation)
- [ ] Feedback accionable (no "se ve mal")

### Harness Actual
- [ ] Context injection: CLAUDE.md + CONTEXTO.md + DECISIONS.md
- [ ] Action surfaces: [lista tus tools]
- [ ] Persistence: [qué guardas entre sesiones]
- [ ] Safety: privacy-filter + invariants
- [ ] Observability: [qué mides]

### Graph
- [ ] ¿Necesito graph? (Sí/No) → Si No: perfecto, Fase 1

### Multi-Agent
- [ ] ¿Necesito multi-agent? (Sí/No) → Si No: perfecto, Fase 1
```

---

## 📖 Referencias Profundas

| Concepto | Documento Fuente | Sección |
|---|---|---|
| Goal/Loop/Graph distinction | `BLUEPRINT_AGENT_ARCHITECTURE_CONSOLIDATED.md` | §5-Layer Execution Routing, §Loop vs Graph |
| Loop Engineering | `BLUEPRINT_AGENT_ARCHITECTURE_CONSOLIDATED.md` | §Loop Engineering, §Eval Engineering |
| Harness Economics | `BLUEPRINT_AGENT_ARCHITECTURE_CONSOLIDATED.md` | §Harness Economics |
| Multi-Agent Architecture | `BLUEPRINT_HERMES_AGENT.md` | §8 Multi-agente — v0.6.0 |
| Memory Architecture | `BLUEPRINT_AGENT_MEMORY_CONTEXT.md` | §3 Niveles, §Anti-patrones |
| Token Optimization | `BLUEPRINT_Token_Memory_Pipeline.md` | Pipeline completo |

---

*Este tutorial es documentación viva. Actualízalo cuando migres a Hermes o cambie la fase del proyecto.*