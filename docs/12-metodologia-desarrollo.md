# Metodologia de Desarrollo

## Vision

ForestData debe crecer como un sistema verificable, no como una maqueta extendida por parches. La metodologia combina continuidad de contexto, ahorro de tokens y especificacion previa cuando el cambio toca decisiones criticas.

La base del trabajo sera:

- Project Bootstrap para tener estructura operativa desde el inicio.
- Persistent Context para no perder decisiones entre sesiones.
- Session Efficiency para cargar solo el contexto necesario.
- SDD + Plan First para cambios estructurales.

## Por que esta combinacion

ForestData mezcla tres riesgos:

- Riesgo tecnico: pasar de HTML estatico a sistema con backend, base de datos, mapas, fotos, GPS e IA.
- Riesgo de privacidad: ubicacion, imagenes y participacion de alumnos.
- Riesgo de continuidad: el proyecto puede avanzar por sesiones separadas y con decisiones acumuladas.

Por eso no conviene usar solo velocidad. Pero tampoco conviene convertir cada ajuste pequeno en un documento pesado. La regla es simple: memoria siempre, especificacion cuando haya impacto estructural.

## Capas de trabajo

### 1. Bootstrap permanente

Archivos obligatorios:

- `CLAUDE.md`: orientacion del agente y reglas del proyecto.
- `CONTEXTO.md`: estado activo y siguiente paso.
- `.claude/memory/DECISIONS.md`: decisiones cerradas.
- `.claude/memory/learned-rules.md`: aprendizajes reutilizables.
- `.claude/memory/sessions.jsonl`: historial compacto de sesiones.

Uso:

- Antes de una tarea estructural, leer la capa minima de contexto.
- Al cerrar, actualizar solo lo que cambio.
- No duplicar documentos si una referencia canonica ya existe.

### 2. Session Efficiency

Reglas:

- No cargar todo el proyecto si solo se toca una parte.
- Leer primero el archivo canonico de la tarea.
- Evitar logs o salidas largas; extraer solo errores o datos relevantes.
- Cuando una sesion cambie de tema, crear checkpoint antes de continuar.

Aplicacion en ForestData:

- Para producto: leer `README.md`, `docs/01-vision-producto.md` y `docs/02-alcance-funcional.md`.
- Para arquitectura: leer `docs/03-arquitectura-tecnica.md` y decisiones vigentes.
- Para datos: leer `docs/04-modelo-datos.md`.
- Para privacidad: leer `docs/06-privacidad-seguridad.md`.
- Para ejecucion: leer `docs/07-roadmap.md` y `docs/11-backlog-tecnico.md`.

### 3. SDD + Plan First

SDD + Plan First se activa obligatoriamente cuando:

- El cambio afecta mas de 3 archivos.
- Se define o cambia el stack tecnico.
- Se crea o modifica base de datos.
- Se crea o modifica API.
- Se implementa autenticacion, roles o permisos.
- Se manejan fotos, ubicacion GPS o datos de alumnos.
- Se integra IA.
- Se toca despliegue, backups, logs o seguridad.

Entregable minimo de SDD:

- Objetivo.
- Alcance incluido y fuera de alcance.
- Archivos o modulos afectados.
- Contratos relevantes: datos, API, permisos o UI.
- Riesgos de privacidad o seguridad.
- Criterios de salida verificables.

No hace falta un documento largo. Hace falta una especificacion suficiente para que el codigo pueda revisarse contra ella.

## Flujo operativo

### Fase A: Orientacion

1. Leer `CLAUDE.md`.
2. Leer `CONTEXTO.md`.
3. Leer decisiones en `.claude/memory/DECISIONS.md`.
4. Leer solo los documentos canonicos relacionados con la tarea.

Salida esperada:

- Estado actual.
- Decision relevante.
- Siguiente accion.

### Fase B: Clasificacion de tarea

Clasificar la tarea como:

- Tarea simple: documentacion menor, ajuste puntual, correccion localizada.
- Tarea estructural: arquitectura, datos, API, permisos, privacidad, IA, despliegue o mas de 3 archivos.

Si es simple, ejecutar directo.

Si es estructural, crear especificacion breve antes de implementar.

### Fase C: Especificacion

Para tareas estructurales, crear o actualizar un documento de spec dentro de `docs/` o en una subcarpeta futura `docs/specs/`.

La especificacion debe responder:

- Que problema resuelve?
- Que no incluye?
- Que datos toca?
- Quien puede ver o modificar esos datos?
- Como se verifica?
- Que decision debe registrarse?

### Fase D: Implementacion

Implementar siguiendo la especificacion aprobada o aceptada.

Reglas:

- Mantener cambios pequenos y revisables.
- No introducir dependencias nuevas sin registrar la decision.
- No exponer datos privados en vistas publicas.
- No permitir que IA escriba datos finales sin validacion humana.

### Fase E: Verificacion y cierre

Antes de cerrar:

- Ejecutar pruebas o revision manual correspondiente.
- Actualizar `CONTEXTO.md`.
- Registrar decisiones nuevas.
- Registrar aprendizajes si aplica.

## Adaptacion por fases del roadmap

### Fase 0: Ordenar la maqueta

Metodologia:

- Bootstrap + Session Efficiency.
- SDD solo si se decide stack o estructura de app.

Pasos:

1. Inicializar Git.
2. Crear `.gitignore`.
3. Separar `forestdata-dash.html` en `index.html`, `styles.css`, `app.js` y `data.js`.
4. Documentar como abrir la maqueta.
5. Marcar claramente datos simulados.

Criterio de salida:

- La maqueta abre sin errores evidentes.
- Los datos visibles vienen de una fuente unica.
- La estructura puede convertirse en app real.

### Fase 1: MVP web local

Metodologia:

- SDD + Plan First obligatorio.

Pasos:

1. Crear spec de stack tecnico.
2. Crear spec de modelo de datos inicial.
3. Crear spec de API minima.
4. Implementar backend, base de datos y CRUD de arboles.
5. Crear mapa publico basico y panel privado inicial.

Criterio de salida:

- Se puede registrar un arbol real y verlo en mapa publico sin exponer datos privados.

### Fase 2: Captura movil

Metodologia:

- SDD obligatorio por GPS, fotos y alumnos.

Pasos:

1. Especificar flujo alumno-docente-admin.
2. Definir datos capturados en campo.
3. Definir validacion administrativa.
4. Implementar captura GPS, foto y registro pendiente.

Criterio de salida:

- Un alumno puede capturar un cuidado y un docente puede aprobarlo o rechazarlo.

### Fase 3: QR y ficha publica

Metodologia:

- SDD por seguridad de URLs y visibilidad publica.

Pasos:

1. Definir formato de token publico.
2. Definir ficha publica sin datos sensibles.
3. Generar QR unico por arbol.
4. Probar escaneo movil.

Criterio de salida:

- Escanear un QR abre la ficha publica correcta con datos aprobados.

### Fase 4: IA asistida

Metodologia:

- SDD obligatorio.

Pasos:

1. Definir proveedor y costos.
2. Definir contrato de analisis IA.
3. Guardar confianza, incertidumbre y respuesta cruda referenciada.
4. Crear revision humana de resultados.

Criterio de salida:

- La IA genera sugerencias utiles, pero un humano valida antes de afectar datos finales.

### Fase 5: Reportes y operacion

Metodologia:

- Persistent Context + SDD para reportes oficiales, backups y seguridad.

Pasos:

1. Definir indicadores institucionales.
2. Crear exportaciones.
3. Crear alertas.
4. Documentar backups, logs y operacion.

Criterio de salida:

- El equipo puede presentar avances con datos trazables y operables.

## Regla de oro

ForestData debe poder avanzar rapido, pero no a costa de perder trazabilidad. Si una tarea toca datos reales, privacidad, arquitectura o mas de 3 archivos, primero se especifica. Si es pequena y clara, se ejecuta y se registra solo lo necesario.
