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
