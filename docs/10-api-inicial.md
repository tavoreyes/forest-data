# API Inicial Propuesta

Esta API es una guia conceptual para construir el backend. No representa endpoints existentes.

## Convenciones

- Todas las rutas privadas requieren autenticacion.
- Las rutas publicas solo devuelven datos aprobados.
- Las respuestas deben ser JSON.
- Los errores deben incluir codigo, mensaje y detalles validables.

## Rutas publicas

### GET /public/trees

Lista arboles aprobados para el mapa publico.

Filtros:

- species_id
- zone_id
- health_status
- planted_from
- planted_to

Respuesta esperada:

```json
{
  "data": [
    {
      "public_code": "A-01",
      "species": "Pinus pseudostrobus",
      "zone": "Zona A",
      "health_status": "good",
      "latitude": 19.468,
      "longitude": -101.877
    }
  ]
}
```

### GET /public/trees/{public_code}

Devuelve ficha publica de un arbol.

Debe excluir datos privados de alumnos.

### GET /public/stats

Devuelve indicadores agregados:

- Total de arboles aprobados.
- Total por estado.
- Total por zona.
- Crecimiento promedio.
- Ultimos cuidados aprobados.

## Rutas privadas

### POST /auth/login

Inicio de sesion.

### GET /admin/trees

Lista arboles con informacion administrativa.

### POST /admin/trees

Crea arbol desde panel administrativo.

### POST /mobile/trees

Crea solicitud de registro enviada por alumno.

Estado inicial: `pending_review`.

### PATCH /admin/trees/{id}/approve

Aprueba un arbol pendiente.

### PATCH /admin/trees/{id}/reject

Rechaza un arbol pendiente con motivo.

### POST /mobile/trees/{id}/care-logs

Crea registro de cuidado desde movil.

Debe aceptar:

- water_liters
- height_cm
- notes
- photo_id
- latitude
- longitude
- gps_accuracy_m

### POST /admin/care-logs/{id}/approve

Aprueba un cuidado y actualiza datos derivados del arbol.

### POST /photos

Carga una foto.

La implementacion puede usar subida directa a storage con URL firmada.

### POST /ai/analyze-photo

Solicita analisis de IA para una foto.

Debe ejecutarse desde backend, no directamente desde frontend, para proteger llaves de API y controlar costos.

### GET /admin/audit-logs

Consulta auditoria.

## Reglas importantes

- Un alumno no debe aprobar sus propios registros.
- Un visitante publico no debe ver registros pendientes.
- Una foto no aprobada no debe aparecer en ficha publica.
- El backend debe validar que las coordenadas sean razonables.
- La API debe registrar quien hizo cada cambio.

