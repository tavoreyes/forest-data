---
name: ForestData
description: Plataforma educativa de monitoreo forestal para CECyTE Michoacan
colors:
  primary: "#16a34a"
  primary-light: "#dcfce7"
  primary-border: "#86efac"
  warning: "#d97706"
  warning-light: "#fef3c7"
  warning-border: "#fcd34d"
  danger: "#dc2626"
  danger-light: "#fee2e2"
  danger-border: "#fca5a5"
  neutral-bg: "#f5f6f7"
  neutral-surface: "#ffffff"
  neutral-surface-2: "#f9fafb"
  neutral-surface-3: "#f3f4f6"
  neutral-border: "rgba(0,0,0,0.07)"
  neutral-border-medium: "rgba(0,0,0,0.11)"
  neutral-ink: "#111827"
  neutral-ink-2: "#6b7280"
  neutral-ink-3: "#9ca3af"
typography:
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.03em"
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
  eyebrow:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "7px"
  md: "10px"
  pill: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#15803d"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink-2}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  chip-good:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
  chip-fair:
    backgroundColor: "{colors.warning-light}"
    textColor: "{colors.warning}"
    rounded: "{rounded.pill}"
  chip-poor:
    backgroundColor: "{colors.danger-light}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
    padding: "9px 12px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "20px"
---

# Design System: ForestData

## 1. Overview

**Creative North Star: "El Cuaderno de Campo"**

ForestData se siente como un cuaderno de campo vivo: organizado, preciso, con datos que crecen. Cada arbol tiene su ficha, cada cuidado queda registrado, cada zona se mide. La interfaz es el contenedor invisible de esa informacion — no grita, no decora, solo presenta.

La paleta es minimalista: grises verdaderos dominan, verde aparece solo en acciones (botones primarios) y estados (salud). Las superficies se diferencian por tonalidad, no por sombras excesivas. Los componentes tienen bordes suaves (7-10px) que dan amabilidad sin perder estructura.

Lo que ForestData rechaza explicitamente: dashboards corporativos oscuros, apps de redes sociales, landing pages de startup, simulacras de datos, y cualquier patron que haga la interfaz mas importante que la informacion.

**Key Characteristics:**
- Minimalismo funcional: cada elemento tiene un proposito
- Verde como acento, no como dominante
- Superficies limpias con diferenciacion tonal sutil
- Tipografia clara con jerarquia definida
- Componentes amigables con bordes suaves
- Elevacion funcional para modals y dropdowns

## 2. Colors

La paleta es intencionalmente restraint: grises neutros como base, verde como unico acento cromatico, y semaforo de salud (verde/amarillo/rojo) como sistema de estados.

### Primary
- **Forest Green** (#16a34a): Color de accion principal. Botones primarios, links activos, focus rings, indicadores de estado saludable. Aparece en <=10% de cualquier pantalla.

### Semantic States
- **Amber Warning** (#d97706): Estado "regular" — arboles que necesitan atencion. Chips, badges, indicadores de alerta suave.
- **Danger Red** (#dc2626): Estado "critico" — arboles en riesgo. Borrado, errores de validacion, alertas urgentes.

### Neutral
- **Ink** (#111827): Texto principal. Titulos, datos primarios, contenido que se lee primero.
- **Ink 2** (#6b7280): Texto secundario. Descripciones, metadata, contexto de apoyo.
- **Ink 3** (#9ca3af): Texto terciario. Labels, placeholders, timestamps. Nunca para contenido principal.
- **Surface** (#ffffff): Fondo de cards, modals, elementos elevados.
- **Surface 2** (#f9fafb): Fondo de tablas, secciones alternas, sidebar.
- **Surface 3** (#f3f4f6): Fondo de inputs, areas de contenido secundario.
- **Background** (#f5f6f7): Fondo de pagina. Gris verdadero, sin tinte calido.
- **Border** (rgba(0,0,0,0.07)): Bordes sutiles entre secciones.
- **Border Medium** (rgba(0,0,0,0.11)): Bordes en inputs, separadores mas visibles.

### Named Rules
**The 10% Green Rule.** El verde Forest Green aparece en maximo 10% de cualquier pantalla. Su rareza es el punto — cuando aparece, significa accion o estado positivo.

**The True Gray Rule.** Los neutros son grises verdaderos, sin tinte calido ni frio. El fondo no es crema, no es arena, no es papel. Es gris puro con un toque de profundidad.

## 3. Typography

**Display Font:** Inter (with system-ui fallback)
**Body Font:** Inter (with system-ui fallback)

**Character:** Una sola familia sans-serif en multiples pesos. Inter es tecnica pero legible, moderna pero no fria. Ideal para datos que necesitan claridad sin sacrificar personalidad.

### Hierarchy
- **Display** (700, 24px/-0.04em, 1.2): Numeros grandes, estadisticas destacadas. Aparece en sidebar de stats y headers de seccion.
- **Title** (700, 16px, 1.3): Titulos de pagina, nombre del arbol en ficha. Presencia sin gritar.
- **Body** (400, 13px, 1.5): Contenido principal, descripciones, notas. Longitud maxima 65-75ch.
- **Label** (600, 11px/0.03em): Labels de formularios, headers de columna, metadata. Siempre uppercase visual por el letter-spacing.
- **Eyebrow** (600, 10px/0.04em): Secciones de estadisticas, labels de chips, timestamps. La escala mas pequena del sistema.

### Named Rules
**The Data Hierarchy Rule.** Los numeros grandes (stats) siempre van primero. El ojo del usuario debe ir del dato al contexto, nunca al reves.

## 4. Elevation

ForestData usa elevacion funcional: sombras que indican capa, no decoracion. Las superficies base son planas. Las sombras aparecen en elementos que se elevan sobre el contenido (modals, dropdowns, tooltips).

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`): Cards en estado normal. Sutil, casi invisible. Solo sugiere separacion del fondo.
- **Raised** (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`): Cards en hover, dropdowns abiertos. Indica interactividad.
- **Modal** (`box-shadow: 0 8px 32px rgba(0,0,0,0.12)`): Modals, overlays, tooltips. Capa mas alta, separacion clara del contenido.

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas en reposo. Las sombras aparecen solo como respuesta a estado (hover, elevacion, focus). Sin sombras decorative.

## 5. Components

### Buttons
- **Shape:** Gently curved (7px radius)
- **Primary:** Forest Green background (#16a34a), white text, 8px/16px padding. Hover: darken to #15803d, translateY(-1px). Active: scale(0.97).
- **Ghost:** Transparent background, Ink 2 text, 1px border medium. Hover: Surface 3 background, Ink text. Sin transform.
- **Danger:** Danger Red background, white text. Mismo tratamiento que primary.

### Chips
- **Style:** Pill shape (20px radius), colored background + matching text + matching border.
- **States:** Good = Forest Green on light green. Fair = Amber on light amber. Danger = Red on light red.
- **Usage:** Estado de salud del arbol, indicadores de zona, filtros activos.

### Cards
- **Corner Style:** Gently curved (10px radius)
- **Background:** Surface (#ffffff)
- **Shadow Strategy:** Flat by default. Ambient shadow on hover ( Raised ).
- **Border:** 1px solid Border (rgba(0,0,0,0.07))
- **Internal Padding:** 20px

### Inputs
- **Style:** Surface background, Border Medium stroke, 7px radius, 9px/12px padding.
- **Focus:** Forest Green border with 3px green glow (rgba(22,163,74,0.08)). Smooth transition.
- **Placeholder:** Ink 3 color. Same contrast requirements as body text.

### Navigation (Page Header)
- **Style:** Surface background, bottom border, flex layout with space-between.
- **Typography:** Title weight for app name, Label for location.
- **Actions:** Ghost button for secondary, Primary button for main CTA.

## 6. Do's and Don'ts

### Do:
- **Do** use Forest Green only for actions and positive states — never for backgrounds, borders, or decorative elements.
- **Do** maintain 4.5:1 contrast ratio for all text. Ink 3 (#9ca3af) on white is 3.0:1 — use Ink 2 (#6b7280) for body text when contrast matters.
- **Do** use true grays for neutrals — no warm tints, no cool tints. The background is #f5f6f7, not cream, not sand.
- **Do** keep borders subtle (rgba(0,0,0,0.07) to 0.11). Heavy borders fight with content.
- **Do** use the chip system for health states: green/amber/red consistently across the entire UI.
- **Do** put data first — stats, numbers, measurements before descriptions or decoration.

### Don't:
- **Don't** use Forest Green as a background color, page tint, or card accent. It's for actions only. Quote from PRODUCT.md: *"Los nombres de alumnos nunca se exponen. Los datos sensibles se protegen por defecto."* — the same restraint applies to color.
- **Don't** add gradient text, glassmorphism, or decorative blur effects. Quote from PRODUCT.md anti-references: *"no landing page de startup, no hero con gradiente."*
- **Don't** use border-left or border-right greater than 1px as a colored accent. Never intentional.
- **Don't** pair Inter with another sans-serif. One family, multiple weights — the pairing is on the weight axis, not the family axis.
- **Don't** make cards nest inside other cards. One level of elevation, always.
- **Don't** use hero-metric templates (big number + small label + gradient accent). Quote from PRODUCT.md: *"no SaaS dashboard corporativo oscuro."*
- **Don't** animate layout properties unless truly needed. Motion is for feedback, not decoration.
- **Don't** ship content hidden behind CSS transitions that depend on visibility. Default state must be visible.
