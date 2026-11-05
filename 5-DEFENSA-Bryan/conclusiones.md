# Conclusiones

> Responsable de la versión conjunta: **Integrante 1** · Issue: #16
> Las conclusiones 1–4 se apoyan en el proceso de diseño y en la verificación técnica. Las marcadas con ✎ se completan con los datos reales de P01 y P02; no se deben dar por ciertas antes de la prueba.

## Conclusiones del equipo

1. **El momento de verdad que más afecta la confianza es el envío fallido (MV1).** En la interfaz original, un corte de red o una sesión vencida borra el trabajo completo: la curva emocional estimada cae a −2 en TP7 y no se recupera en TP8. Por eso el diseño prioriza que *nunca* se pierdan datos (autoguardado, errores que conservan lo escrito, reintento) antes que cualquier mejora estética.
2. **Trazar requisitos evita decisiones arbitrarias.** Cada pantalla y componente del prototipo responde a uno de los requisitos R1–R6 y a una heurística (matriz en `trazabilidad.md`). Esto permitió justificar decisiones como el asistente de tres pasos (H1) o la escala de severidad cerrada (H5) en lugar de discutir gustos.
3. **El prototipo en código fue la técnica adecuada para este caso.** Las validaciones, el foco, el teclado y el reintento solo se pueden observar si existen de verdad; un prototipo en papel o clic a clic no habría mostrado si el participante pierde un hallazgo o entiende un error. Su límite: no prueba un servidor real, rendimiento ni lectores de pantalla en profundidad.
4. **La accesibilidad se verificó con datos, no con suposiciones.** Todos los pares de color medidos superan 4,5:1 (texto) y 3:1 (foco y bordes); el flujo completo funciona con teclado y los errores se anuncian en texto y asociados a su campo. La interfaz original no cumplía estos criterios.
5. ✎ **Resultado de las pruebas con P01 y P02:** *(ej.: «__ de 2 participantes completaron T3 sin ayuda; el tiempo de T2 fue de __ s y __ s; ante el error de envío P0_ dijo “…”».)*
6. ✎ **Efecto de la iteración:** *(qué hallazgo produjo cada cambio, en qué commit está y si la mejora es medida o predicha.)*
7. ✎ **Incidencia sorpresa:** *(qué pidió el docente, qué se modificó, en qué commit y cómo se probó la ruta de éxito y la de error.)*

## Conclusiones individuales

### Thomas Solis · Fase 1: Diagnóstico
Reconstruí la interfaz actual de registro de evaluaciones, identifiqué y prioricé los cinco problemas (P1–P5) con heurísticas de Nielsen y su severidad, y elaboré la curva emocional con ocho touchpoints y dos momentos de verdad. Aprendí que el momento de verdad que más pesa no siempre es el más visible: perder todo el formulario cuando falla el envío (MV1) destruye la confianza más que cualquier problema estético, y eso marcó la prioridad del rediseño. También aprendí a distinguir una curva estimada por el equipo de una medida con usuarios.
Evidencia: Issues #1–#5 · PR #__ · commits `_______`.

### Carlos Bejarano · Fases 2 y 3: Diseño y Prueba
En el diseño redacté los requisitos R1–R6 con criterios medibles, el sitemap, el user flow con ramas de error y recuperación, el inventario de componentes, los wireframes, la matriz de trazabilidad y el prototipo navegable v1. En la prueba preparé el protocolo, dirigí las sesiones con P01 y P02, registré tiempos, errores y comentarios, y verifiqué el contraste y el uso con teclado. Aprendí que cada artefacto responde una pregunta distinta (qué pantallas hay, en qué orden se recorren, qué contiene cada una y cómo se siente usarla) y que una prueba solo sirve si separa lo observado de lo supuesto.
Evidencia: Issues #6–#11 · PR #__ (diseño) · PR #__ (prueba) · commits `_______`.

### Karen Molina · Fase 4: Iteración
Prioricé los hallazgos de la prueba y construí la versión 2 con tres correcciones: C1, el aviso de hallazgo sin agregar (H5); C2, la escala de severidad con nombres y ayuda en el formulario (H6); y C3, el error de envío que confirma que los datos están a salvo (H9, MV1). Elaboré la comparación antes y después y la curva emocional comparada. Aprendí que cada cambio debe nacer de un hallazgo concreto y que la mejora de la v2 es una predicción hasta volver a probarla con usuarios.
Evidencia: Issues #12–#15 · PR #__ · commits C1 `_______`, C2 `_______`, C3 `_______`.

### Bryan Guatemal · Fase 5: Defensa
Implementé la incidencia sorpresa pedida por el docente ([describir el cambio]) en una rama propia y demostré en vivo la ruta exitosa y la ruta de error después del cambio. Además completé el README final con los enlaces a Issues, PR y commits, consolidé las conclusiones y preparé la entrega en Moodle. Aprendí que un prototipo bien organizado, con la configuración y las validaciones en un solo lugar, permite responder a un cambio inesperado en pocos minutos sin romper lo que ya funcionaba.
Evidencia: Issues #16–#17 · PR #__ (incidencia) · commit `_______`.

## Recomendaciones

- Re-probar la v2 con dos participantes nuevos para convertir las predicciones en datos.
- Probar con un lector de pantalla (NVDA) y en celular con conexión real.
- Evaluar si conviene permitir adjuntar una captura a cada hallazgo (quedó fuera del alcance del prototipo). *(Agregar aquí lo que pidan P01/P02.)*
