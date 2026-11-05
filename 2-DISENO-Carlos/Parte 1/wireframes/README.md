# Wireframes Lo-Fi

> Fase 2 · Responsable: **Integrante 2** · Issue: #9
> Baja fidelidad (escala de grises, sin tipografía final, textos de relleno con barras). Las notas amarillas numeradas justifican cada decisión con requisito, heurística o momento de verdad.

| Archivo | Pantalla | Requisitos | Decisiones clave |
|---|---|---|---|
| [`W1-inicio.png`](W1-inicio.png) | Inicio | R1, R4 | Acción principal visible; aviso de borrador; plazo de las 18:00 visible |
| [`W2-formulario.png`](W2-formulario.png) | Formulario (paso 2: hallazgos) | R2, R3, R4 | Asistente de 3 pasos; escala de severidad 0–4; editar/eliminar; autoguardado |
| [`W3-error.png`](W3-error.png) | Error de validación (A) y de envío (B) | R5 | Resumen con enlaces + mensaje junto al campo; datos conservados; reintento |
| [`W4-exito.png`](W4-exito.png) | Confirmación | R6 | Código de registro, resumen, siguientes pasos |
| [`W5-revision.png`](W5-revision.png) | Revisión y envío *(adicional)* | R4, R6 | Revisar antes de un envío irreversible; atajos «Editar» |

**Fuente editable:** [`fuente/wireframes.html`](fuente/wireframes.html). Para regenerar las imágenes: `python herramientas/capturar_pantallas.py`.

## Diferencia entre artefactos (pregunta de defensa)

| Artefacto | Qué responde | Archivo |
|---|---|---|
| **Sitemap** | ¿Qué pantallas existen y cómo se agrupan? (árbol, sin flechas) | [`../sitemap.png`](../sitemap.png) |
| **User flow** | ¿En qué orden las recorre el usuario, qué decide y qué pasa si se equivoca? | [`../user-flow.png`](../user-flow.png) |
| **Wireframe** | ¿Qué contiene cada pantalla y dónde va cada elemento? (estructura, sin estética) | esta carpeta |
| **Prototipo** | ¿Cómo se siente usarlo? Se navega, valida y responde. | [`../prototipo/v1/`](../prototipo/v1/) |
