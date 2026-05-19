# Modulo de IA

## Objetivo

El modulo de IA debe ayudar a capturar mejor informacion, no sustituir criterio tecnico, biologico o docente.

La IA puede ser util para:

- Sugerir especie probable.
- Estimar altura aproximada cuando exista referencia visual.
- Detectar cambios de crecimiento.
- Identificar senales visibles de deterioro.
- Redactar recomendaciones preliminares.

## Entradas necesarias

Para que el analisis tenga valor, cada captura debe incluir:

- Foto clara del arbol.
- Referencia fisica visible, por ejemplo regla de 30 cm.
- Distancia razonable y angulo estable.
- Fecha.
- Ubicacion.
- Especie esperada o contexto botanico.
- Altura medida manualmente cuando sea posible.

## Salidas esperadas

La IA debe devolver:

- Especie probable.
- Nivel de confianza.
- Altura estimada.
- Senales visuales detectadas.
- Recomendaciones.
- Advertencias sobre incertidumbre.

Ejemplo de salida conceptual:

```json
{
  "species_guess": "Pinus pseudostrobus",
  "species_confidence": 0.72,
  "estimated_height_cm": 114,
  "height_confidence": 0.61,
  "health_signals": ["color verde uniforme", "sin dano visible severo"],
  "recommendations": ["validar medicion manual", "mantener riego moderado"],
  "warnings": ["la regla no esta completamente alineada con el plano del arbol"]
}
```

## Limitaciones honestas

La IA puede fallar por:

- Mala iluminacion.
- Fotos borrosas.
- Falta de referencia de escala.
- Angulo incorrecto.
- Especies similares.
- Plantas jovenes sin rasgos distintivos.
- Oclusiones.
- Datos de entrenamiento insuficientes para especies locales.

Por eso el sistema debe mostrar "sugerido por IA" y no "confirmado" hasta que una persona valide.

## Flujo recomendado

1. Alumno captura foto y datos.
2. Backend guarda el registro como pendiente.
3. Backend envia la foto al servicio de IA.
4. La IA devuelve sugerencias.
5. El administrador revisa foto, datos y sugerencias.
6. El administrador aprueba, corrige o rechaza.
7. Solo los datos aprobados se publican.

## Medicion de crecimiento

La medicion visual debe tratarse como estimacion. Para mejorarla:

- Estandarizar distancia y angulo de foto.
- Usar una regla o patron de referencia.
- Guardar instrucciones visuales para alumnos.
- Comparar contra medicion manual ocasional.
- Registrar margen de error.

## Evaluacion del modulo

Antes de confiar en IA, se debe crear un conjunto de validacion:

- 30 a 50 fotos reales por especie prioritaria.
- Mediciones manuales verificadas.
- Etiquetas revisadas por docente o asesor tecnico.
- Comparacion entre estimacion IA y medicion real.

Metricas utiles:

- Error promedio de altura.
- Porcentaje de identificacion correcta de especie.
- Porcentaje de falsos positivos en alertas.
- Casos donde la IA declara baja confianza.

