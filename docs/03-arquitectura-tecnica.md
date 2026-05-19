# Arquitectura Tecnica

## Estado actual

Actualmente existe una maqueta en un solo archivo HTML. Usa dependencias por CDN:

- Leaflet para mapa.
- Chart.js para graficas.
- Iconify para iconos.
- Google Fonts para tipografia.

Esto es suficiente para una demo visual, pero no para una aplicacion mantenible.

## Arquitectura objetivo

Se recomienda separar el sistema en cuatro piezas:

1. Aplicacion publica web.
2. Panel administrativo web.
3. App movil o PWA para alumnos.
4. API backend con base de datos.

## Opcion recomendada para primera version

Para un equipo educativo, conviene evitar complejidad excesiva.

Stack sugerido:

- Frontend web: React, Vue o Svelte.
- App movil inicial: PWA responsive con acceso a GPS y camara.
- Mapas: Leaflet.
- Backend: Node.js con Express/NestJS o Python con FastAPI.
- Base de datos: PostgreSQL con PostGIS.
- Almacenamiento de imagenes: S3 compatible, Supabase Storage, Cloudflare R2 o almacenamiento institucional.
- Autenticacion: JWT/session cookies con roles.
- IA: servicio externo por API, encapsulado desde backend.

## Por que PostGIS

El sistema depende de ubicaciones reales. PostGIS permite:

- Consultas geograficas.
- Distancias.
- Validacion por poligonos o zonas.
- Busqueda por radio.
- Mapas con datos confiables.

Guardar latitud y longitud como numeros es posible al inicio, pero PostGIS da una base mas seria para crecimiento futuro.

## Componentes

### Frontend publico

Responsable de:

- Mostrar mapa publico.
- Renderizar fichas publicas.
- Mostrar indicadores agregados.
- Filtrar informacion aprobada.

### Panel administrativo

Responsable de:

- Gestionar datos.
- Revisar capturas.
- Validar resultados de IA.
- Exportar reportes.
- Administrar permisos.

### PWA movil

Responsable de:

- Capturar GPS.
- Capturar fotos.
- Escanear QR.
- Enviar registros.
- Mostrar estado de sincronizacion.

### API

Responsable de:

- Autenticacion.
- Reglas de permisos.
- Validacion de datos.
- Persistencia.
- Auditoria.
- Integracion con IA.
- Generacion de URLs y QR.

## Principios tecnicos

- El frontend no debe decidir permisos criticos.
- La IA no debe escribir datos finales sin validacion.
- Los datos publicos deben salir de vistas aprobadas.
- Cada cambio importante debe quedar auditado.
- Las imagenes deben almacenarse fuera de la base de datos.
- La precision GPS debe guardarse siempre.

## Ambientes

Se recomiendan al menos tres:

- Local: desarrollo de alumnos/equipo.
- Staging: pruebas con datos ficticios o anonimizados.
- Produccion: datos reales.

## Pruebas minimas

- Pruebas de modelo de datos.
- Pruebas de API para permisos.
- Pruebas de creacion y validacion de arbol.
- Pruebas de carga de foto.
- Pruebas de ficha publica sin datos privados.
- Pruebas de responsive movil.

