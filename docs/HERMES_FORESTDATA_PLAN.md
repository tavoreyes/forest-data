# Plan de Configuración Completa: Hermes Agent para ForestData

**Versión**: 1.0  
**Fecha**: 2026-08-07  
**Basado en**: BLUEPRINT_HERMES_AGENT.md, BLUEPRINT_AGENT_ARCHITECTURE_CONSOLIDATED.md, BLUEPRINT_AGENT_MEMORY_CONTEXT.md  
**Objetivo**: Preparar Hermes Agent para desarrollo autónomo continuo en ForestData (Fase 1→5)

---

## 1. Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                    HERMES AGENT (Mini PC Ubuntu)             │
│  192.168.1.9  |  Tailscale: 100.86.100.109                  │
│  https://hermesagent.tailce80bb.ts.net                      │
├─────────────────────────────────────────────────────────────┤
│  Servicios systemd:                                          │
│  ├── hermes-gateway.service    (Telegram 24/7)              │
│  ├── hermes-dashboard.service  (Web UI :9119 via Tailscale) │
│  └── ollama.service            (Modelos cloud proxy)        │
├─────────────────────────────────────────────────────────────┤
│  Memoria Persistente Compartida (mem0 + Qdrant):            │
│  ├── vector_store: qdrant @ localhost:6333                  │
│  │   └── collection: forestdata_fleet_memory                │
│  └── embedder: ollama/nomic-embed-text                      │
├─────────────────────────────────────────────────────────────┤
│  Integración ForestData:                                     │
│  ├── Filesystem MCP → C:\Users\usuario\Proyectos\nexus\GitHub\forest-data │
│  ├── Git MCP → repo forest-data                              │
│  ├── SQLite MCP → data/forestdata.db                         │
│  └── Browser MCP (Playwright) → Tests E2E                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Configuración de Modelos (Fallback Chain)

```yaml
# ~/.hermes/config.yaml
model_routing:
  # Modelo por defecto: balanceado para tareas generales
  default: "nvidia/nemotron-3-ultra-550b-a55b:free"
  
  # Perfiles especializados
  profiles:
    coding:
      model: "nvidia/nemotron-3-super-120b-a12b:free"
      temperature: 0.1
      max_tokens: 8192
      system_prompt: |
        Eres un ingeniero de software senior especializado en Next.js, SQLite, 
        Leaflet, y arquitectura limpia. Sigue SDD + TDD estricto.
        Nunca escribas código sin spec aprobada. Tests primero.
    
    architecture:
      model: "nvidia/nemotron-3-ultra-550b-a55b:free"
      temperature: 0.2
      max_tokens: 16384
      system_prompt: |
        Arquitecto de sistemas. Decisiones documentadas en DECISIONS.md.
        Trade-offs explícitos. Privacidad y auditoría son invariantes.
    
    privacy_audit:
      model: "meta-llama/llama-3.3-70b-instruct:free"
      temperature: 0.0
      max_tokens: 4096
      system_prompt: |
        Auditor de privacidad. Busca exposición de datos de alumnos:
        nombres, matrículas, emails, coordenadas GPS exactas, fotos.
        Cero tolerancia. Reporta línea y archivo exacto.
    
    cheap:
      model: "qwen/qwen3-next-80b-a3b-instruct:free"
      temperature: 0.3
      max_tokens: 4096
      system_prompt: |
        Tareas rutinarias: actualizar CONTEXTO.md, formatear docs, 
        limpiar checkpoints, verificar imports.
  
  # Fallback chain (orden de prioridad)
  fallback_chain:
    - "nvidia/nemotron-3-super-120b-a12b:free"
    - "nvidia/nemotron-3-ultra-550b-a55b:free"
    - "meta-llama/llama-3.3-70b-instruct:free"
    - "qwen/qwen3-next-80b-a3b-instruct:free"
    - "inclusionai/ling-2.6-flash"           # OpenRouter paid
    - "qwen/qwen3.5-flash-02-23"            # OpenRouter paid
    - "nemotron-3-super:cloud"              # Ollama proxy
    - "gemma4:31b-cloud"                    # Ollama proxy
```

---

## 3. Skills ForestData (7 Skills Core)

### 3.1 `forestdata-sdd` — Spec-Driven Development
```markdown
# SKILL.md
name: forestdata-sdd
description: |
  Crea especificaciones SDD antes de cualquier cambio estructural.
  Trigger: "cambio >3 archivos" OR "touch API/DB/auth/privacidad/IA"
  Output: docs/specs/{feature}.md con objetivo, alcance, contratos, riesgos, criterios salida.
  Requiere aprobación humana antes de codificar.
category: development
tools: [read, write, glob, grep, bash]
instructions: |
  1. Entrevista al usuario para clarificar objetivo real (Karpathy Capa 1)
  2. Crea spec en docs/specs/{slug}.md usando template SDD
  3. Presenta spec para aprobación — NO codifiques hasta "aprobado"
  4. Tras aprobación, delega a forestdata-tdd para implementación
```

### 3.2 `forestdata-tdd` — Test-Driven Development
```markdown
# SKILL.md
name: forestdata-tdd
description: |
  Implementa siguiendo TDD estricto: test falla -> código mínimo -> refactor -> commit.
  Stop hook: no termina hasta test pase + lint/typecheck OK.
  Batch size: 1 test por ciclo.
category: development
tools: [read, write, edit, bash, glob]
instructions: |
  1. Lee spec aprobada de forestdata-sdd
  2. Escribe test que FALLE (Playwright E2E o unit)
  3. Usuario aprueba test (pausa obligatoria)
  4. Implementa código MÍNIMO para pasar
  5. Ejecuta lint + typecheck + test
  6. Refactor si aplica
  7. Commit atómico con mensaje convencional
  8. Repite para siguiente escenario
```

### 3.3 `forestdata-privacy` — Auditoría de Privacidad
```markdown
# SKILL.md
name: forestdata-privacy
description: |
  Escanea código/docs por exposición de datos sensibles de alumnos.
  Bloquea commit si detecta: nombre completo, matrícula, email, GPS exacto, fotos sin consentimiento.
  Invariante: interfaz pública solo muestra datos aprobados (validation_status=approved).
category: security
tools: [read, glob, grep, bash]
instructions: |
  1. Ejecuta .claude/scripts/privacy-filter.js sobre archivos staged
  2. Busca patrones: matricula, curp, latitude/longitude exactos, emails personales
  3. Verifica que vistas públicas usan SOLO datos con validation_status=approved
  4. Verifica que fotos tienen consent_status=granted y public_visibility=true
  5. Si falla: reporta archivo:línea exacta + tipo de dato expuesto
  6. No permite commit hasta fix verificado
```

### 3.4 `forestdata-audit` — Registro de Decisiones
```markdown
# SKILL.md
name: forestdata-audit
description: |
  Registra decisiones arquitectónicas en .claude/memory/DECISIONS.md
  y aprendizajes en .claude/memory/learned-rules.md.
  Formato: DEC-XXX con fecha, decisión, razón, trade-offs, estado.
category: memory
tools: [read, write, edit]
instructions: |
  Trigger: tras cerrar tarea estructural (SDD completada)
  1. Pregunta: "¿Qué decisión arquitectónica se tomó?"
  2. Escribe entrada DEC-XXX en DECISIONS.md
  3. Pregunta: "¿Qué aprendizaje reutilizable surgió?"
  4. Escribe en learned-rules.md si aplica
  5. Añade línea JSONL a sessions.jsonl
```

### 3.5 `forestdata-context` — Boot/Close Protocol
```markdown
# SKILL.md
name: forestdata-context
description: |
  Automatiza boot mínimo y close mínimo del proyecto.
  Boot: lee CLAUDE.md + CONTEXTO.md + DECISIONS.md -> resume 3 puntos.
  Close: actualiza CONTEXTO.md + registra decisiones/aprendizajes + checkpoint.
category: memory
tools: [read, write, bash]
instructions: |
  COMANDO /boot:
  1. Lee CLAUDE.md, CONTEXTO.md, .claude/memory/DECISIONS.md
  2. Resume: estado actual, decisión relevante, siguiente paso
  3. Ejecuta node .claude/scripts/checkpoint.js --resume si hay checkpoint
  
  COMANDO /close:
  1. Pregunta: qué se hizo, qué está pendiente, bloqueos
  2. Actualiza CONTEXTO.md
  3. Ejecuta forestdata-audit para decisiones/aprendizajes
  4. Ejecuta node .claude/scripts/checkpoint.js --trigger "próximo paso"
```

### 3.6 `forestdata-token-opt` — Optimización de Tokens
```markdown
# SKILL.md
name: forestdata-token-opt
description: |
  Aplica pipeline token-memory: RTK filter, batch engine, token cache, checkpoint.
  Configura .claude/rtk-config.json y .claude/config.json.
  Monitorea uso de tokens por sesión.
category: efficiency
tools: [read, write, bash]
instructions: |
  1. Verifica RTK instalado y config válida
  2. Verifica Token Optimizer MCP activo
  3. Cada 15 mensajes: trigger checkpoint automático
  4. Reporta: tokens ahorrados, cache hit rate, densidad wiki
  5. Sugiere consolidación de docs si density < 3.5
```

### 3.7 `forestdata-weekly-audit` — Auditoría Semanal (Cron)
```markdown
# SKILL.md
name: forestdata-weekly-audit
description: |
  Cron semanal: revisa decisions, learned-rules, tech debt, token usage.
  Genera reporte en Telegram + actualiza CONTEXTO.md con hallazgos.
category: maintenance
tools: [read, write, bash]
instructions: |
  1. Lee DECISIONS.md - identifica decisiones stale (>30 días sin acción)
  2. Lee learned-rules.md - poda reglas obsoletas
  3. Ejecuta npm audit + check de dependencias desactualizadas
  4. Analiza token usage 7 días (via Token Optimizer MCP stats)
  5. Verifica health de endpoints críticos (8/8 OK)
  6. Genera reporte: "✅ OK" o "⚠️ ACCIÓN REQUERIDA: [lista]"
  7. Envía a Telegram + actualiza CONTEXTO.md
```

---

## 4. Crons Programados

| ID | Schedule (UTC) | Skill | Función | Entrega |
|---|---|---|---|---|
| `forestdata-morning-sync` | `0 6 * * *` | `forestdata-context` (boot) | Sync CONTEXTO.md, sugiere siguiente paso, resume checkpoint | Telegram |
| `forestdata-weekly-audit` | `0 2 * * 0` | `forestdata-weekly-audit` | Auditoría completa: decisions, deps, tokens, endpoints | Telegram |
| `forestdata-evolution` | `0 6 * * 1` | `self-evolve` | Análisis sesiones semana -> mejoras skills/SOUL.md | Interno |
| `forestdata-privacy-scan` | `0 3 * * *` | `forestdata-privacy` | Scan completo repo por datos sensibles | Solo si falla |

---

## 5. Memoria Persistente (mem0 + Qdrant)

```yaml
# ~/.hermes/config.yaml (sección memory)
memory:
  provider: "mem0"
  config:
    vector_store:
      provider: "qdrant"
      config:
        host: "localhost"
        port: 6333
        collection_name: "forestdata_fleet_memory"
    embedder:
      provider: "ollama"
      config:
        model: "nomic-embed-text"
    graph_store:
      provider: "neo4j"  # opcional, para relaciones entidad-relación
      config:
        url: "bolt://localhost:7687"
        username: "neo4j"
        password: "${NEO4J_PASSWORD}"
    # Filtro de privacidad ANTES de guardar en mem0
    pre_process: ".claude/scripts/privacy-filter.js"
    # Hook para broadcast a fleet (opcional)
    post_process: "mem_broadcast.py"
```

**Estructura de memoria en Qdrant:**
```
forestdata_fleet_memory/
├── decisions/          # DEC-XXX embeddings para búsqueda semántica
├── specs/              # specs aprobadas (docs/specs/)
├── patterns/           # learned-rules.md patterns
├── code_context/       # snippets relevantes de src/
├── api_contracts/      # schemas de API, DB
└── privacy_rules/      # invariantes de privacidad
```

---

## 6. Integración MCP (Model Context Protocol)

```json
// ~/.hermes/mcp_servers.json
{
  "mcpServers": {
    "forestdata-fs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "args_extra": ["C:\\Users\\usuario\\Proyectos\\nexus\\GitHub\\forest-data"],
      "env": {}
    },
    "forestdata-git": {
      "command": "npx",
      "args": ["-y", "mcp-git"],
      "args_extra": ["C:\\Users\\usuario\\Proyectos\\nexus\\GitHub\\forest-data"],
      "env": {}
    },
    "forestdata-sqlite": {
      "command": "npx",
      "args": ["-y", "mcp-sqlite"],
      "args_extra": ["data/forestdata.db"],
      "env": {}
    },
    "forestdata-browser": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    },
    "token-optimizer": {
      "command": "npx",
      "args": ["-y", "token-optimizer-mcp"],
      "env": {
        "CACHE_TTL": "3600",
        "COMPRESSION": "aggressive",
        "CACHE_DIR": ".claude/cache/token-optimizer"
      }
    }
  }
}
```

---

## 7. SOUL.md — Personalidad del Agente ForestData

```markdown
# SOUL.md — Hermes ForestData

## Identidad
Soy Hermes ForestData, agente de ingeniería para la plataforma educativo-ambiental 
ForestData. Mi propósito: código confiable, privacidad inviolable, trazabilidad total.

## Principios Operativos
1. **SDD + TDD siempre** — Sin spec no hay código. Sin test fallando no hay implementación.
2. **Privacidad por diseño** — Datos de alumnos nunca en memoria, nunca en logs, nunca en público.
3. **Evidencia sobre confianza** — Loop en tests/lint/typecheck, no en "creo que funciona".
4. **Memoria lean** — CONTEXTO.md < 80 líneas. DECISIONS.md solo decisiones cerradas.
5. **Tokens son caros** — RTK + Cache + Checkpoint + Batch. Target: 70%+ reducción.

## Iniciativa (Triggers Proactivos)
- Cada lunes 6AM: forestdata-weekly-audit -> reporte Telegram
- Cada día 6AM: forestdata-morning-sync -> CONTEXTO.md + próximo paso
- Cada commit: forestdata-privacy scan (pre-commit hook)
- Cada 15 mensajes: checkpoint automático
- Si `npm audit` muestra high/critical: alerta inmediata
- Si endpoint crítico falla (health check): alerta + auto-investigación

## Escalation Rules
- **Crítico**: Exposición datos alumnos, pérdida datos, security breach -> Telegram INMEDIATO + pausa todo
- **Alto**: Test suite rota >1hr, deploy bloqueado, decisión arquitectónica requerida -> Telegram en 15min
- **Medio**: Token usage >80% budget, tech debt acumulado, dependencia desactualizada -> Telegram diario
- **Bajo**: Doc outdated, lint warning, refactor oportuno -> Log interno, revisar en weekly audit

## Comunicación
- Formato: bullets concisos, archivo:línea para código, sin floreos
- Preguntas: una a la vez, opciones concretas
- Reportes: estado + métrica + acción requerida (si aplica)
```

---

## 8. Setup Paso a Paso (Checklist)

### Semana 1: Infra Base
- [ ] `hermes setup` + `hermes model` + `hermes doctor`
- [ ] Configurar `~/.hermes/config.yaml` con model_routing + memory + mcp_servers
- [ ] Levantar Qdrant: `docker run -d -p 6333:6333 qdrant/qdrant`
- [ ] Probar mem0: `hermes memory test "ForestData usa Next.js + SQLite"`
- [ ] Configurar Tailscale Serve para dashboard: `tailscale serve https /http://localhost:9119`

### Semana 2: Skills Core (vía `/learn`)
- [ ] Ejecutar MANUALMENTE 1 ciclo SDD+TDD completo (ej: endpoint POST /api/trees)
- [ ] `/learn forestdata-sdd` → guarda skill
- [ ] `/learn forestdata-tdd` → guarda skill
- [ ] `/learn forestdata-privacy` → guarda skill
- [ ] `/learn forestdata-audit` → guarda skill
- [ ] `/learn forestdata-context` → guarda skill
- [ ] Probar `/boot` y `/close` end-to-end

### Semana 3: Automatización
- [ ] Configurar crons en Hermes (`hermes cron create ...`)
- [ ] Crear `mem_broadcast.py` hook para fleet memory
- [ ] Integrar Telegram gateway (`hermes-gateway.service`)
- [ ] Probar weekly audit completo
- [ ] Documentar SOUL.md final

### Semana 4: Validación Producción
- [ ] Ejecutar Fase 2 completa (captura móvil) via Hermes autónomo
- [ ] Medir: tokens/sesión, tiempo/ciclo SDD, defectos escapados
- [ ] Ajustar model_routing por perfil de tarea
- [ ] Documentar lessons learned en learned-rules.md

---

## 9. Métricas de Éxito (KPIs)

| Métrica | Baseline (opencode manual) | Target (Hermes autónomo) |
|---|---|---|
| Tokens/sesión desarrollo | ~50k | <15k (70% reducción) |
| Tiempo ciclo SDD (spec→commit) | ~2-4 hrs | <45 min |
| Defectos escapados a staging | 2-3/semana | 0 |
| Exposiciones privacidad | 0 (invariante) | 0 |
| Decisiones documentadas | ~60% | 100% |
| Cobertura test nuevos endpoints | ~70% | 100% |
| Tiempo auditoría semanal | 30 min manual | 0 (automático) |

---

## 10. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Modelo gratuito rate-limited | Alta | Medio | Fallback chain 8 niveles + Ollama local |
| mem0 guarda dato sensible | Baja | Crítico | privacy-filter.js PRE-Procesamiento obligatorio |
| Skills se vuelven stale | Media | Medio | Weekly audit + self-evolve cron |
| Contexto se contamina | Media | Alto | Checkpoint cada 15 msgs + CONTEXTO.md < 80 líneas |
| Hermes hace loop infinito | Baja | Alto | MAX_RUNTIME=12h, stop rules en skills, approval gates |
| Qdrant se corrompe | Baja | Medio | Backup diario + replica en fleet memory |

---

## 11. Próximos Pasos Inmediatos

1. **Hoy**: Crear `~/.hermes/config.yaml` con secciones 2, 5, 6
2. **Mañana**: Levantar Qdrant + probar mem0 + filesystem MCP
3. **Esta semana**: Ejecutar 1 ciclo SDD+TDD manual completo → `/learn` skills
4. **Próxima semana**: Activar crons + Telegram gateway
5. **Fase 2**: Usar Hermes para captura móvil (GPS/fotos/validación)

---

## 12. Referencias

- `BLUEPRINT_HERMES_AGENT.md` — Arquitectura completa Hermes
- `BLUEPRINT_AGENT_ARCHITECTURE_CONSOLIDATED.md` — Harness/Loop/Graph
- `BLUEPRINT_AGENT_MEMORY_CONTEXT.md` — Memoria 3 niveles
- `BLUEPRINT_Token_Memory_Pipeline.md` — Pipeline token-memory
- `docs/12-metodologia-desarrollo.md` — Metodología ForestData (SDD + Plan First)
- `CLAUDE.md` — Reglas del proyecto (invariantes, boot/close)