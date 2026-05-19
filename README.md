# ForestData

ForestData es una propuesta de plataforma educativa y ambiental para registrar, geolocalizar y dar seguimiento publico al crecimiento de arboles existentes y nuevos arboles plantados por alumnos.

El objetivo no es solo tener un tablero bonito. La aspiracion es construir un sistema verificable de monitoreo forestal escolar: cada arbol debe tener ubicacion, historial de cuidados, evidencia fotografica, mediciones periodicas, responsable academico y una ficha publica que permita a la comunidad ver el avance del programa.

## Estado actual

Este repositorio contiene actualmente una maqueta estatica:

- `forestdata-dash.html`: prototipo visual de panel administrativo con mapa, listado de arboles, detalle individual, registro de cuidado, grafica de crecimiento y simulacion de modulo de IA.

La maqueta ayuda a visualizar la direccion del producto, pero todavia no es un sistema funcional. No tiene backend, base de datos, autenticacion, app movil, carga real de fotos, geolocalizacion real, generacion real de QR, integracion real con IA ni persistencia.

## Vision

ForestData debe permitir que:

- Los alumnos registren arboles desde su telefono movil usando GPS.
- Cada arbol tenga una ficha unica con QR.
- La comunidad vea un mapa publico con los arboles, su estado general y su avance.
- Los administradores validen registros, corrijan datos, asignen responsables y generen reportes.
- Un modulo de IA ayude a identificar la planta, estimar crecimiento con evidencia fotografica y detectar posibles alertas.
- El proyecto sea pedagogico: que los alumnos aprendan captura de datos, geografia, biologia, estadistica, tecnologia e inteligencia artificial aplicada.

## Interfaces previstas

### Interfaz publica

Vista abierta para comunidad escolar, padres, docentes, autoridades y visitantes.

Debe mostrar:

- Mapa de arboles registrados.
- Ficha publica por arbol.
- Especie, zona, fecha de plantacion y estado general.
- Fotografias historicas aprobadas.
- Grafica de crecimiento.
- Indicadores agregados del programa.
- Historias o avances del proyecto.

No debe exponer datos personales sensibles de alumnos.

### Interfaz privada

Vista para administradores, docentes o coordinadores.

Debe permitir:

- Validar o rechazar registros enviados por alumnos.
- Administrar arboles, zonas, especies, usuarios y grupos.
- Revisar evidencias fotograficas.
- Consultar alertas de salud o falta de seguimiento.
- Exportar datos.
- Gestionar codigos QR.
- Auditar cambios.

### App movil para alumnos

Debe permitir:

- Capturar geolocalizacion GPS.
- Registrar arboles nuevos.
- Actualizar cuidados de arboles existentes.
- Tomar o subir fotografias.
- Escanear QR de un arbol.
- Registrar agua, observaciones y estado visible.
- Trabajar con conectividad limitada cuando sea posible.

## Documentacion

La documentacion base esta en `docs/`:

- [Vision del producto](docs/01-vision-producto.md)
- [Alcance funcional](docs/02-alcance-funcional.md)
- [Arquitectura tecnica](docs/03-arquitectura-tecnica.md)
- [Modelo de datos](docs/04-modelo-datos.md)
- [Modulo de IA](docs/05-modulo-ia.md)
- [Privacidad y seguridad](docs/06-privacidad-seguridad.md)
- [Roadmap](docs/07-roadmap.md)
- [Guia para alumnos](docs/08-guia-alumnos.md)
- [Analisis honesto de la maqueta](docs/09-analisis-maqueta.md)
- [API inicial propuesta](docs/10-api-inicial.md)
- [Backlog tecnico priorizado](docs/11-backlog-tecnico.md)
- [Metodologia de desarrollo](docs/12-metodologia-desarrollo.md)

## Presentacion

La presentacion general del proyecto esta en `presentations/forestdata-presentacion.marp.md`. Esta escrita en formato Marp, con 13 diapositivas: una vision general y una diapositiva por cada documento base.

La guia para exportar y reemplazar placeholders de imagen esta en `presentations/README.md`.

## Principios del desarrollo

1. Primero datos confiables, despues automatizaciones.
2. La IA debe asistir, no reemplazar la validacion humana.
3. La interfaz publica debe proteger privacidad.
4. Cada medicion debe tener evidencia y fecha.
5. El sistema debe funcionar en condiciones reales de campo.
6. El proyecto debe poder crecer por etapas y ser entendible para alumnos.
7. Los cambios estructurales deben seguir especificacion previa y registrar decisiones.

## Metodologia de trabajo

ForestData usa Project Bootstrap + Persistent Context + Session Efficiency como base permanente de trabajo. Esto mantiene una memoria minima del proyecto, reduce relecturas innecesarias y evita perder decisiones entre sesiones.

SDD + Plan First se activa cuando una tarea toca arquitectura, stack, base de datos, API, autenticacion, permisos, privacidad, fotos, GPS, IA, despliegue o mas de 3 archivos.

Archivos operativos:

- `CLAUDE.md`: reglas de trabajo para agentes.
- `CONTEXTO.md`: estado activo y proximo paso.
- `.claude/memory/DECISIONS.md`: decisiones cerradas.
- `.claude/memory/learned-rules.md`: aprendizajes reutilizables.
- `.claude/memory/sessions.jsonl`: historial compacto de sesiones.

## Primer objetivo tecnico

Convertir la maqueta actual en una aplicacion minima con:

- Estructura de proyecto limpia.
- Datos derivados desde una fuente unica.
- Registro real de arboles.
- Captura de geolocalizacion.
- Base de datos.
- Panel publico basico.
- Panel privado con autenticacion.

## Licencia y gobernanza

Antes de publicar datos reales, el equipo debe definir:

- Quien administra la informacion.
- Quien puede capturar y editar registros.
- Como se protegen fotografias, ubicaciones y datos de alumnos.
- Que datos seran publicos y cuales quedaran privados.
- Politica de uso de imagenes y consentimiento.
