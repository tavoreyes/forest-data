# Modelo de Datos

Este modelo es una propuesta inicial. Debe ajustarse al flujo real del programa.

## Entidades principales

### users

Usuarios del sistema.

Campos sugeridos:

- id
- name
- email
- role
- group_id
- status
- created_at
- updated_at

Roles sugeridos:

- student
- teacher
- admin
- public_viewer

### groups

Grupos escolares o equipos de trabajo.

Campos:

- id
- name
- school_cycle
- teacher_id

### trees

Registro maestro de arboles.

Campos:

- id
- public_code
- species_id
- proposed_species_name
- zone_id
- planted_at
- registered_by
- validated_by
- validation_status
- health_status
- current_height_cm
- initial_height_cm
- public_slug
- qr_token
- created_at
- updated_at

Estados de validacion:

- draft
- pending_review
- approved
- rejected
- archived

Estados de salud:

- good
- fair
- poor
- unknown

### tree_locations

Ubicaciones del arbol.

Campos:

- id
- tree_id
- latitude
- longitude
- gps_accuracy_m
- source
- captured_by
- captured_at
- is_current

Fuentes:

- mobile_gps
- manual_map
- admin_correction

### species

Catalogo de especies.

Campos:

- id
- scientific_name
- common_name
- native_region
- notes
- active

### zones

Zonas o sectores del plantel/proyecto.

Campos:

- id
- name
- description
- polygon_geojson

### care_logs

Historial de cuidados y mediciones.

Campos:

- id
- tree_id
- captured_by
- captured_at
- water_liters
- height_cm
- health_observation
- notes
- photo_id
- ai_analysis_id
- validation_status
- validated_by
- validated_at

### photos

Evidencias fotograficas.

Campos:

- id
- tree_id
- care_log_id
- storage_url
- thumbnail_url
- captured_by
- captured_at
- latitude
- longitude
- gps_accuracy_m
- public_visibility
- consent_status

### ai_analyses

Resultados de IA.

Campos:

- id
- tree_id
- care_log_id
- model_provider
- model_name
- species_guess
- species_confidence
- estimated_height_cm
- height_confidence
- health_signals
- recommendations
- raw_response_ref
- reviewed_by
- review_status
- created_at

### audit_logs

Auditoria de cambios.

Campos:

- id
- actor_id
- entity_type
- entity_id
- action
- before_json
- after_json
- created_at

## Reglas de consistencia

- Un arbol puede tener muchas ubicaciones historicas, pero solo una actual.
- Una ficha publica solo debe usar datos aprobados.
- Las fotos pueden ser privadas aunque el arbol sea publico.
- El resultado de IA no debe modificar `trees` directamente sin validacion.
- Los conteos del tablero deben calcularse desde la base de datos, no escribirse a mano.

