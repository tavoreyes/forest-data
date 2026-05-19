---
marp: true
theme: default
size: 16:9
paginate: true
title: ForestData - Plataforma de monitoreo forestal escolar
description: Presentacion general del proyecto ForestData basada en la documentacion del repositorio
author: ForestData
style: |
  :root {
    --ink: #14221b;
    --muted: #5b6d62;
    --paper: #f7f4ec;
    --panel: #fffaf0;
    --leaf: #2f7d4f;
    --moss: #86a66a;
    --clay: #b65f3a;
    --sky: #3e7fa6;
    --line: rgba(20, 34, 27, 0.16);
  }

  section {
    background: var(--paper);
    color: var(--ink);
    font-family: "Segoe UI", Arial, sans-serif;
    padding: 48px 62px 42px;
    letter-spacing: 0;
  }

  h1, h2, h3, p, li {
    letter-spacing: 0;
  }

  h1 {
    font-size: 50px;
    line-height: 1.02;
    margin: 0 0 18px;
    max-width: 980px;
  }

  h2 {
    font-size: 40px;
    line-height: 1.08;
    margin: 0 0 18px;
    max-width: 980px;
  }

  h3 {
    font-size: 20px;
    line-height: 1.2;
    margin: 0 0 10px;
    color: var(--leaf);
  }

  p, li {
    font-size: 22px;
    line-height: 1.35;
  }

  ul {
    margin: 0;
    padding-left: 24px;
  }

  li {
    margin: 8px 0;
  }

  strong {
    color: var(--leaf);
  }

  footer {
    font-size: 13px;
    color: rgba(20, 34, 27, 0.48);
  }

  section::after {
    color: rgba(20, 34, 27, 0.48);
    font-size: 13px;
  }

  .kicker {
    color: var(--clay);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .lead {
    font-size: 27px;
    line-height: 1.3;
    max-width: 770px;
    color: var(--muted);
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 38px;
    align-items: stretch;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-top: 26px;
  }

  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 22px 24px;
  }

  .metric {
    font-size: 48px;
    line-height: 1;
    font-weight: 800;
    color: var(--leaf);
    margin-bottom: 8px;
  }

  .small {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.35;
  }

  .image-slot {
    min-height: 290px;
    border: 2px dashed rgba(47, 125, 79, 0.45);
    border-radius: 10px;
    background:
      linear-gradient(135deg, rgba(47,125,79,0.08), rgba(62,127,166,0.08)),
      var(--panel);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding: 28px;
  }

  .image-slot b {
    font-size: 18px;
    color: var(--leaf);
  }

  .image-slot span {
    font-size: 18px;
    line-height: 1.35;
    color: var(--muted);
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-top: 36px;
  }

  .step {
    border-top: 5px solid var(--leaf);
    background: var(--panel);
    padding: 16px 14px 18px;
    min-height: 122px;
  }

  .step b {
    display: block;
    color: var(--clay);
    font-size: 15px;
    margin-bottom: 8px;
  }

  .step span {
    font-size: 16px;
    line-height: 1.25;
    color: var(--ink);
  }

  .flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 26px;
  }

  .flow div {
    background: var(--panel);
    border-left: 5px solid var(--sky);
    padding: 20px 18px;
    min-height: 130px;
  }

  .flow b {
    display: block;
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--sky);
  }

  .flow span {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.3;
  }

  .cover {
    background:
      linear-gradient(90deg, rgba(20,34,27,0.86), rgba(20,34,27,0.34)),
      var(--paper);
    color: white;
  }

  .cover h1 {
    font-size: 64px;
    max-width: 760px;
  }

  .cover .lead {
    color: rgba(255,255,255,0.84);
  }

  .cover .kicker {
    color: #d7e8c4;
  }

  .cover .image-slot {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.42);
  }

  .cover .image-slot b,
  .cover .image-slot span {
    color: rgba(255,255,255,0.86);
  }
---

<!-- _class: cover -->
<!-- _paginate: skip -->

<div class="grid-2">
<div>
<div class="kicker">Presentacion general</div>

# ForestData convierte cada arbol escolar en evidencia ambiental trazable.

<p class="lead">Una plataforma para registrar, geolocalizar, cuidar y publicar el crecimiento de arboles con datos validados, privacidad y aprendizaje tecnico.</p>
</div>

<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Hero fotografico: alumnos registrando un arbol joven con telefono, mapa sutil sobrepuesto, ambiente escolar realista.</span>
</div>
</div>

<!-- Gemini/Nano Banana prompt:
Fotografia editorial realista de estudiantes de bachillerato registrando un arbol joven con un telefono movil en un plantel escolar mexicano, luz natural, composicion limpia, mapa digital sutil sobrepuesto, tono esperanzador, sin texto, sin logos, sin rostros identificables en primer plano.
-->

---

<div class="kicker">01 Vision del producto</div>

## El proyecto no busca un tablero bonito; busca datos ambientales confiables.

<div class="grid-2">
<div>

- Responde donde esta cada arbol, que especie es y como crece.
- Separa una capa publica de transparencia y una capa privada de validacion.
- Convierte captura de campo en aprendizaje de geografia, biologia, estadistica e IA.

</div>
<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Mapa del plantel con puntos de arboles y fichas publicas flotantes, estilo producto educativo moderno.</span>
</div>
</div>

<!-- Gemini/Nano Banana prompt:
Ilustracion editorial semi-realista de un mapa de campus escolar con puntos verdes que representan arboles monitoreados, pequenas tarjetas de datos ambientales, interfaz limpia, colores naturales, sin marcas ni texto legible.
-->

---

<div class="kicker">02 Alcance funcional</div>

## El sistema se organiza alrededor de un ciclo: registrar, cuidar, validar y publicar.

<div class="flow">
<div><b>Registrar</b><span>Arbol, especie propuesta, GPS, foto inicial y observaciones.</span></div>
<div><b>Cuidar</b><span>Riego, altura, estado visible, foto y seguimiento periodico.</span></div>
<div><b>Validar</b><span>Docentes o administradores aprueban antes de publicar.</span></div>
<div><b>Publicar</b><span>Ficha publica, QR, mapa e indicadores agregados.</span></div>
</div>

<p class="small">Fuera del MVP: diagnostico botanico definitivo, medicion exacta sin referencia, prediccion cientifica e IoT automatico.</p>

<!-- Gemini/Nano Banana prompt:
Diagrama visual limpio de cuatro pasos para monitoreo de arboles escolares: registrar, cuidar, validar, publicar. Iconografia ambiental, estilo editorial, sin texto legible para poder rotular despues.
-->

---

<div class="kicker">03 Arquitectura tecnica</div>

## La maqueta debe separarse en cuatro piezas mantenibles antes de crecer.

<div class="grid-2">
<div class="panel">
<h3>Arquitectura objetivo</h3>

- Web publica
- Panel administrativo
- PWA movil para alumnos
- API backend con base de datos

</div>
<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Arquitectura en capas: usuarios, aplicaciones, API, base de datos geoespacial y almacenamiento de imagenes.</span>
</div>
</div>

<p class="small">PostGIS aparece como base seria para ubicaciones, distancias, zonas y busqueda geografica.</p>

<!-- Gemini/Nano Banana prompt:
Diagrama isometrico minimalista de arquitectura de software para una plataforma ambiental: app publica, panel admin, PWA movil, API, base de datos geoespacial, almacenamiento de fotos, lineas de conexion limpias, sin texto.
-->

---

<div class="kicker">04 Modelo de datos</div>

## La confianza nace del modelo: cada dato importante tiene estado, evidencia y auditoria.

<div class="grid-3">
<div class="panel"><h3>Nucleo</h3><p class="small">trees, species, zones, tree_locations</p></div>
<div class="panel"><h3>Seguimiento</h3><p class="small">care_logs, photos, ai_analyses</p></div>
<div class="panel"><h3>Gobierno</h3><p class="small">users, groups, roles, audit_logs</p></div>
</div>

<div class="image-slot" style="min-height: 160px; margin-top: 22px;">
<b>IMAGEN SUGERIDA</b>
<span>Mini ERD visual del dominio: arbol al centro conectado con ubicaciones, cuidados, fotos, IA y auditoria.</span>
</div>

<!-- Gemini/Nano Banana prompt:
Diagrama de entidades minimalista para un sistema de monitoreo de arboles, arbol al centro conectado con ubicacion, cuidados, fotos, analisis IA, usuarios y auditoria, estilo limpio, sin texto legible.
-->

---

<div class="kicker">05 Modulo de IA</div>

## La IA solo aumenta la calidad de captura si queda subordinada a validacion humana.

<div class="grid-2">
<div>

- Sugiere especie probable, altura estimada y senales visibles.
- Debe devolver confianza, incertidumbre y advertencias.
- No confirma datos finales ni reemplaza criterio docente.
- Necesita fotos claras, referencia de escala y validacion contra mediciones reales.

</div>
<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Telefono analizando una foto de arbol joven con regla visible; etiquetas de confianza e incertidumbre.</span>
</div>
</div>

<!-- Gemini/Nano Banana prompt:
Escena realista de un telefono mostrando una foto de arbol joven con una regla de escala al lado, interfaz de analisis con indicadores abstractos de confianza e incertidumbre, estilo producto, sin texto legible, sin logos.
-->

---

<div class="kicker">06 Privacidad y seguridad</div>

## Los resultados pueden ser publicos; los datos de alumnos no.

<div class="grid-2">
<div class="panel">
<h3>Publico</h3>

- Codigo del arbol
- Especie y zona general
- Estado e historial aprobado
- Fotos sin personas identificables

</div>
<div class="panel">
<h3>Privado</h3>

- Nombre, matricula, correo
- Registros pendientes
- Fotos originales sensibles
- Auditoria y cambios administrativos

</div>
</div>

<p class="small">La seguridad minima incluye HTTPS, roles, validacion backend, rate limiting, backups y separacion de ambientes.</p>

<!-- Gemini/Nano Banana prompt:
Composicion conceptual de privacidad para plataforma ambiental escolar: mapa publico de arboles y capa privada protegida, candado sutil, estudiantes fuera de foco sin rostros identificables, colores naturales, sin texto.
-->

---

<div class="kicker">07 Roadmap</div>

## El avance se ordena por confianza: primero base mantenible, luego datos reales e IA.

<div class="timeline">
<div class="step"><b>Fase 0</b><span>Ordenar maqueta y crear base mantenible.</span></div>
<div class="step"><b>Fase 1</b><span>MVP web local con CRUD y mapa.</span></div>
<div class="step"><b>Fase 2</b><span>Captura movil con GPS, foto y validacion.</span></div>
<div class="step"><b>Fase 3</b><span>QR y ficha publica por arbol.</span></div>
<div class="step"><b>Fase 4</b><span>IA asistida con revision humana.</span></div>
<div class="step"><b>Fase 5</b><span>Reportes, indicadores y operacion.</span></div>
</div>

<!-- Gemini/Nano Banana prompt:
Linea de tiempo visual para desarrollo de una plataforma escolar ambiental, seis etapas representadas con iconos de codigo, mapa, movil, QR, IA y reportes, estilo editorial limpio, sin texto.
-->

---

<div class="kicker">08 Guia para alumnos</div>

## El alumno no llena formularios: levanta evidencia que debe poder auditarse.

<div class="grid-2">
<div>

- Esperar buena precision GPS.
- Tomar fotos claras, sin rostros innecesarios.
- Usar referencia visual para estimar altura.
- Escribir observaciones concretas, no genericas.
- No duplicar arboles ni inventar mediciones.

</div>
<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Guia visual de captura: telefono, arbol completo, regla visible, GPS estable y foto sin personas.</span>
</div>
</div>

<!-- Gemini/Nano Banana prompt:
Infografia visual sin texto de buenas practicas para fotografiar un arbol joven: telefono vertical, arbol completo, regla visible, buena luz, GPS estable, sin rostros, estilo educativo moderno.
-->

---

<div class="kicker">09 Analisis de la maqueta</div>

## La maqueta comunica la vision, pero no debe confundirse con producto funcional.

<div class="grid-2">
<div class="panel">
<h3>Ya comunica</h3>

- Dashboard administrativo
- Mapa, detalle e historial
- Grafica de crecimiento
- Idea de QR e IA

</div>
<div class="panel">
<h3>Aun falta</h3>

- Backend y base de datos
- Auth, privacidad y permisos
- GPS, fotos, QR e IA reales
- Persistencia, reportes y tests

</div>
</div>

<p class="small">Prioridad inmediata: limpiar estructura, separar datos/estilos/logica y dejar de sumar pantallas al HTML unico.</p>

<!-- Gemini/Nano Banana prompt:
Composicion dividida entre maqueta de dashboard ambiental en una pantalla y cimientos tecnicos debajo: base de datos, seguridad, API, pruebas, estilo editorial, sin texto legible.
-->

---

<div class="kicker">10 API inicial propuesta</div>

## La API separa lo publico aprobado de lo privado operativo.

<div class="flow">
<div><b>Publico</b><span>/public/trees, ficha publica y stats solo con datos aprobados.</span></div>
<div><b>Admin</b><span>Gestion, aprobacion, rechazo, auditoria y exportacion.</span></div>
<div><b>Movil</b><span>Captura de arboles y cuidados como pendientes de revision.</span></div>
<div><b>Servicios</b><span>Fotos e IA desde backend para proteger llaves y costos.</span></div>
</div>

<p class="small">Regla clave: un visitante nunca ve pendientes y un alumno no aprueba sus propios registros.</p>

<!-- Gemini/Nano Banana prompt:
Diagrama de API para plataforma ambiental: rutas publicas, admin, movil y servicios conectadas a una base central, estilo tecnico limpio, sin texto legible.
-->

---

<div class="kicker">11 Backlog tecnico</div>

## El backlog protege el orden: fundacion antes de datos reales.

<div class="grid-3">
<div class="panel"><div class="metric">P0</div><p class="small">Git, estructura, maqueta limpia, stack y .gitignore.</p></div>
<div class="panel"><div class="metric">P1-P3</div><p class="small">Datos reales, captura de campo, QR y ficha publica.</p></div>
<div class="panel"><div class="metric">P4-P5</div><p class="small">IA asistida, pruebas, backups, logs y operacion.</p></div>
</div>

<p class="small">Deuda a vigilar: accesibilidad, XSS, permisos backend, imagenes pesadas, costos IA y consentimiento.</p>

<!-- Gemini/Nano Banana prompt:
Tablero de prioridades tecnicas para proyecto de software ambiental, columnas de fundacion, datos, captura, QR, IA y operacion, estilo limpio y profesional, sin texto legible.
-->

---

<div class="kicker">12 Metodologia de desarrollo</div>

## La velocidad se permite; la perdida de trazabilidad no.

<div class="grid-2">
<div>

- Bootstrap, contexto persistente y eficiencia de sesion siempre activos.
- SDD + Plan First cuando haya arquitectura, datos, privacidad, API, auth, GPS, fotos, IA o mas de tres archivos.
- Cada cierre debe actualizar contexto, decisiones y aprendizajes si aplica.

</div>
<div class="image-slot">
<b>IMAGEN SUGERIDA</b>
<span>Sistema de trabajo: documentos, decisiones, roadmap y codigo conectados por un flujo de especificacion a implementacion.</span>
</div>
</div>

<!-- Gemini/Nano Banana prompt:
Ilustracion conceptual de metodologia de desarrollo: documentos, decision journal, roadmap, codigo y pruebas conectados en un flujo ordenado, estetica editorial tecnica, colores naturales, sin texto legible.
-->
