# Matriz de trazabilidad · requisito → flujo → componente → pantalla → prueba → hallazgo/commit

> Fase 2 (creación) y Fase 4 (actualización) · Responsable: **Integrante 2** · Issue: #8
> Regla del equipo: ninguna decisión de UX se aprueba sin relacionarla con un requisito, una heurística, un componente, una observación o un momento de verdad.
> Las columnas **Hallazgo** y **Commit/PR** se completan con los enlaces reales de GitHub (formato `#número` o el hash corto del commit).

## Matriz principal

| Req. | Necesidad de usuario | Flujo / decisión | Wireframe | Pantalla / componente | Caso de prueba | Hallazgo | Commit / PR |
|---|---|---|---|---|---|---|---|
| **R1** | Acceder a la operación sin buscar en menús | Inicio → «Registrar evaluación» → Paso 1 · decisión «¿Hay borrador?» | W1 | S1 Inicio / C04 botón primario, C01 navegación | **T1** | P2 (diagnóstico) | PR v1 (#__) |
| **R2** | Ingresar datos generales comprensibles | Paso 1 → validar → «¿Datos válidos?» | W2 (paso 1), W3-A | S2 / C07 campos, C08 lista, C09 opciones | **T2** | P5 | PR v1 (#__) |
| **R3** | Registrar hallazgos con heurística y severidad | Paso 2 → «¿Hallazgo válido?» → «¿Agregar otro?» | W2 | S3 / C10 escala, C11 contador, C12 tarjeta | **T2** | H-02 → **v2-C2** | commit C2 (`_____`) |
| **R4** | Modificar sin perder datos | Editar / Eliminar → confirmar → Deshacer · autoguardado | W2 | S3 / C12, C15 diálogo, C03 indicador | **T2** | H-01 → **v2-C1** | commit C1 (`_____`) |
| **R5** | Corregir errores (validación y envío) | No → error contextual → corrige · Envío fallido → Reintentar | W3-A, W3-B | S2, S3, S6 / C14 resumen, C17 error de envío | **T2-E**, **T3-E** | H-03 → **v2-C3** · MV1 | commit C3 (`_____`) |
| **R6** | Finalizar con confirmación | Revisión → Enviar → Cargando → «¿Envío exitoso?» → Sí → Confirmación | W5, W4 | S4, S5, S7 / C16 carga, C18 código | **T3** | P4 · MV2 | PR v1 (#__) |
| RNF1–2 | Usar todo con teclado y ver el foco | Todo el flujo | — | Todas / C02, `:focus-visible` | **A1** | — | PR v1 (#__) |
| RNF3–4 | Errores perceptibles; buen contraste | Errores | W3 | C07, C14 | **A2** | — | PR v1 (#__) |

## Trazabilidad de la iteración (v1 → v2)

| Hallazgo | Observación (P01/P02) | Heurística | Cambio en v2 | Archivo y marca | Requisito | Commit / PR |
|---|---|---|---|---|---|---|
| H-01 | *(completar tras la prueba)* | H5, H3 | Aviso «Tienes un hallazgo sin agregar» al pulsar Siguiente | `prototipo/v2/app.js` · `[v2-C1]` | R3, R4 | `_____` |
| H-02 | *(completar tras la prueba)* | H6, H2, H10 | Escala con nombres visibles y ayuda en el formulario | `prototipo/v2/app.js`, `styles.css` · `[v2-C2]` | R3 | `_____` |
| H-03 | *(completar tras la prueba)* | H9, H1 | Error de envío que confirma «Tu evaluación está a salvo» y ofrece 3 salidas | `prototipo/v2/app.js` · `[v2-C3]` | R5 · MV1 | `_____` |
| INC-1 | Incidencia sorpresa del docente | — | *(describir)* | *(archivo)* | *(R#)* | `_____` |

## Relación con los momentos de verdad

| Momento | Touchpoint | Requisitos | Pantallas | Cómo se verifica |
|---|---|---|---|---|
| MV1 · el envío falla | TP7 | R4, R5 | S6 error de envío | T3 con `?fallo=una` o `?fallo=sesion`: ¿el participante reintenta sin reescribir? ¿qué dice? |
| MV2 · ¿quedó registrado? | TP8 | R6 | S7 confirmación, detalle | T3: «¿Cómo sabes que quedó registrado?» → menciona el código |
