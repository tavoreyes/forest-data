# Alcance Funcional

## Modulos principales

### 1. Registro de arboles

Debe permitir crear un arbol con:

- Codigo unico.
- Especie propuesta.
- Fecha de plantacion o fecha de identificacion.
- Ubicacion GPS.
- Zona o sector.
- Responsable o grupo.
- Fotografia inicial.
- Estado inicial.
- Observaciones.

El registro enviado por alumnos debe quedar como pendiente hasta que un administrador lo valide.

### 2. Geolocalizacion

La app movil debe capturar:

- Latitud.
- Longitud.
- Precision estimada del GPS.
- Fecha y hora de captura.
- Metodo de captura: GPS, seleccion manual en mapa o correccion administrativa.

La ubicacion debe poder corregirse en panel privado, guardando auditoria del cambio.

### 3. Seguimiento de cuidados

Cada cuidado debe registrar:

- Arbol asociado.
- Fecha.
- Alumno o usuario que captura.
- Agua suministrada.
- Fotografia.
- Altura estimada o medida.
- Estado visible.
- Observaciones.
- Resultado del analisis IA, si aplica.
- Estado de validacion.

### 4. Ficha publica del arbol

Cada arbol debe tener una ficha publica accesible por URL y QR.

Debe mostrar:

- Codigo.
- Especie validada.
- Zona.
- Fecha de plantacion.
- Estado general.
- Historial visual aprobado.
- Grafica de crecimiento.
- Ultimo cuidado validado.

No debe mostrar nombres completos, matriculas, datos personales ni informacion sensible de alumnos.

### 5. Panel publico

Debe incluir:

- Mapa general.
- Filtros por especie, zona, estado y fecha.
- Indicadores agregados.
- Conteo de arboles activos.
- Supervivencia estimada.
- Crecimiento promedio.
- Arboles que requieren atencion.

### 6. Panel administrativo

Debe incluir:

- Inicio de sesion.
- Listado de arboles.
- Mapa privado con mas detalle.
- Revision de registros pendientes.
- Gestion de usuarios, roles, zonas y especies.
- Exportacion CSV/XLSX.
- Reportes.
- Auditoria.

### 7. Codigos QR

Cada arbol debe tener un QR unico.

El QR debe apuntar a:

- Ficha publica del arbol para visitantes.
- Modo privado de captura si el usuario autenticado tiene permisos.

### 8. Modulo de IA

Debe asistir en:

- Reconocimiento probable de especie.
- Estimacion de altura o crecimiento a partir de fotos con referencia.
- Deteccion visual de riesgos: sequedad, amarillamiento, perdida de hojas, dano visible.
- Generacion de recomendaciones preliminares.

Toda salida de IA debe mostrarse como sugerencia y quedar sujeta a validacion humana.

## Fuera de alcance inicial

Para la primera version no deberia prometerse:

- Diagnostico botanico definitivo.
- Medicion exacta de altura sin referencia fisica confiable.
- Prediccion cientifica de supervivencia.
- Identificacion perfecta de especies.
- Operacion offline completa con sincronizacion compleja.
- Integracion automatica con sensores IoT.

Estas capacidades pueden explorarse despues de tener datos reales y flujo operativo estable.

