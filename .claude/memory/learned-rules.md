# Learned Rules - ForestData

- Mantener documentos de metodologia cortos y operativos; si no guian una decision o una tarea, son ruido.
- Separar tareas pequenas de cambios estructurales: ejecutar directo cuando el alcance es claro, especificar primero cuando hay riesgo de arquitectura o privacidad.
- No confundir especificacion con implementacion: 12 docs de spec sin codigo ejecutable es deuda tecnica, no progreso. El Spec-Driven Illusion es real y documentado en el vault.
- La memoria persistente (DECISIONS, learned-rules, sessions) solo es util si hay actividad que recordar. Infraestructura de memoria sobredimensionada para un proyecto con 0 commits activos es ruido.
- Ejecutar antes de planificar mas: cuando el proyecto esta en Fase 0 y todos los docs estan escritos, el siguiente paso es codigo, no mas documentos.
- El pipeline de distilacion Karpathy (Captura -> Destilacion -> Consolidacion -> Invariante) aplica a vaults de conocimiento, no a proyectos de software. Para software usar Phase Loop de Learnship.
- En Windows sin Visual Studio Build Tools, better-sqlite3 funciona via prebuilt binaries que npm descarga automaticamente. No intentar compilar desde fuente.
- sql.js (WASM) no funciona con webpack en Next.js App Router — el bundle rompe la carga del WASM. Externalizar con `serverComponentsExternalPackages` tampoco lo resuelve. Usar better-sqlite3 en su lugar.
- pnpm 11 en Windows tiene un bloqueo硬核 con `ERR_PNPM_IGNORED_BUILDS`: no hay forma no-interactiva de aprobar builds de dependencias transitive. Si el proyecto esta en Windows y no se puede resolver, usar npm.
- En Next.js 14 App Router, `params` en page components es un objeto synchronous, no un Promise. No usar `use()` de React 19. En Next.js 15+ si es Promise.
- El skill impeccable requiere PRODUCT.md antes de cualquier comando de diseno. Ejecutar init primero, luego document para DESIGN.md, y despues polis/craft/audit.
- Los select inputs en CSS necesitan appearance: none + background-image SVG custom para flecha. El default de browser no respeta border-radius ni padding consistente.
- Lucide React es la libreria de iconografia para todo el proyecto. No usar emojis en codigo fuente. Los emojis no son consistentes entre dispositivos y no se pueden personalizar (tamano, color, peso).
- Cuando se trabaja con pruebas en movil con conexion de uso medido, evitar descargas grandes y pruebas que consuman mucho ancho de banda. Priorizar funcionalidad offline sobre pruebas de conectividad.
- La documentacion del proyecto debe reflejar el estado real, no el estado aspiracional. Actualizar README, roadmap y contexto con lo que realmente esta implementado, no con lo que se planea hacer.
