# Contexto Activo - ForestData

## Estado actual

ForestData contiene una maqueta estatica en `forestdata-dash.html`, documentacion base en `docs/` y una presentacion Marp en `presentations/forestdata-presentacion.marp.md`. Todavia no hay backend, base de datos, autenticacion, app movil, persistencia ni integracion real de IA.

El proyecto no tiene repositorio Git inicializado en esta carpeta.

## Metodologia acordada

Se adopta una base permanente de Project Bootstrap + Persistent Context + Session Efficiency para mantener continuidad y reducir desperdicio de tokens.

SDD + Plan First se activa de forma obligatoria en cambios estructurales: stack, arquitectura, base de datos, API, autenticacion, permisos, privacidad, GPS, fotos, IA o cambios que afecten mas de 3 archivos.

## Proximo paso recomendado

Completar Fase 0 del roadmap:

- Inicializar Git.
- Separar la maqueta en archivos mantenibles.
- Crear `.gitignore`.
- Documentar como abrir la maqueta.
- Definir el stack tecnico final mediante una especificacion breve.
- Reemplazar placeholders de la presentacion con imagenes generadas o seleccionadas.

## Bloqueos o decisiones pendientes

- Stack final pendiente: frontend, backend, base de datos, almacenamiento de fotos y autenticacion.
- Politica de privacidad y consentimiento pendiente antes de datos reales.
- Gobernanza de usuarios y roles pendiente.
