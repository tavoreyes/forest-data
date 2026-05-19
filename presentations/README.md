# Presentaciones ForestData

## Archivo principal

- `forestdata-presentacion.marp.md`: deck Marp de 13 diapositivas.
- `assets/`: carpeta sugerida para imagenes generadas o seleccionadas.

## Como exportar con Marp

Marp separa diapositivas con `---` y configura el deck con front matter YAML. Este deck ya incluye:

- `marp: true`
- `size: 16:9`
- `paginate: true`
- CSS embebido
- placeholders visibles para imagenes
- prompts sugeridos en comentarios HTML

Comandos sugeridos si se instala Marp CLI:

```powershell
npx @marp-team/marp-cli presentations/forestdata-presentacion.marp.md --html
npx @marp-team/marp-cli presentations/forestdata-presentacion.marp.md --pdf
npx @marp-team/marp-cli presentations/forestdata-presentacion.marp.md --pptx
```

Para previsualizar mientras se edita:

```powershell
npx @marp-team/marp-cli presentations/forestdata-presentacion.marp.md --preview
```

## Buenas practicas usadas

- Una idea fuerte por diapositiva.
- Titulos como afirmacion, no como etiqueta generica.
- Texto breve: bullets cortos y pocos por slide.
- Tipografia sans serif legible.
- Alto contraste entre fondo y texto.
- Paleta consistente pero no monotono-verde.
- Evidencia visual por slide: diagrama, flujo, timeline, KPI o imagen.
- Placeholders de imagen con instruccion especifica para generacion posterior.
- No usar imagenes decorativas sin funcion narrativa.

## Flujo para imagenes con Gemini / Nano Banana

1. Abrir `forestdata-presentacion.marp.md`.
2. Buscar `Gemini/Nano Banana prompt`.
3. Generar la imagen en formato 16:9 o suficientemente amplia para recorte.
4. Guardar en `presentations/assets/`, por ejemplo `slide-01-vision.png`.
5. Reemplazar el bloque:

```html
<div class="image-slot">
...
</div>
```

por:

```markdown
![w:520](assets/slide-01-vision.png)
```

Para una imagen de fondo:

```markdown
![bg right:45% cover](assets/slide-01-vision.png)
```

## Criterios de revision

Antes de presentar:

- Revisar que cada slide se lea en menos de 20 segundos.
- Confirmar que ningun texto quede demasiado pequeno.
- Verificar que las imagenes no tengan texto falso, logos inventados o rostros identificables.
- Exportar a PDF y revisar el resultado final, no solo el Markdown.
- Mantener la slide 1 como vision general y las slides 2-13 como resumen de cada documento.
