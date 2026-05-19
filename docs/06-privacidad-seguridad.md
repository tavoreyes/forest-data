# Privacidad y Seguridad

## Principio central

La plataforma puede ser publica en sus resultados ambientales, pero debe ser privada y cuidadosa con los datos de alumnos.

## Datos que no deben publicarse

En la interfaz publica no se deben mostrar:

- Nombre completo del alumno.
- Matricula.
- Correo.
- Telefono.
- Grupo si permite identificar directamente al alumno.
- Fotografias donde aparezcan rostros sin consentimiento.
- Metadatos sensibles de imagen.

## Datos publicos permitidos

Pueden mostrarse si fueron aprobados:

- Codigo del arbol.
- Especie.
- Zona general.
- Fecha de plantacion.
- Estado general.
- Historial de crecimiento.
- Fotografias del arbol sin personas identificables.
- Indicadores agregados.

## Geolocalizacion

La ubicacion de los arboles es parte esencial del proyecto, pero debe manejarse con cuidado.

Recomendaciones:

- Publicar ubicaciones de arboles dentro del plantel o zonas autorizadas.
- Evitar publicar ubicaciones que comprometan domicilios particulares.
- Permitir precision reducida en casos sensibles.
- Guardar precision GPS para auditoria.

## Roles y permisos

Roles minimos:

- Alumno: crear registros y ver sus capturas.
- Docente: revisar registros de su grupo.
- Administrador: administrar todo el proyecto.
- Visitante: consultar datos publicos aprobados.

## Auditoria

Debe registrarse:

- Quien creo un arbol.
- Quien corrigio ubicacion.
- Quien aprobo una foto.
- Quien cambio especie o estado.
- Fecha y datos antes/despues.

## Imagenes

Las fotos deben pasar por revision antes de publicarse.

Buenas practicas:

- Eliminar o controlar metadatos EXIF al publicar.
- Generar miniaturas.
- Separar imagen original privada de version publica.
- Ocultar fotos con rostros o informacion sensible.

## Seguridad tecnica

Minimos necesarios:

- HTTPS.
- Autenticacion segura.
- Validacion de datos en backend.
- Rate limiting en endpoints publicos.
- Permisos revisados por rol.
- Backups de base de datos.
- Separacion de ambiente de pruebas y produccion.

