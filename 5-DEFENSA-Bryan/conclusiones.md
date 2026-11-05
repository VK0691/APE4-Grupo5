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

Cada integrante escribe 3–5 líneas sobre **su** aporte, qué aprendió y qué evidencia lo respalda (enlace a su commit o PR).

### Integrante 1 · Diagnóstico y coordinación
*(completar)*

### Integrante 2 · Arquitectura y C1
*(completar)*

### Integrante 3 · Prototipo v1 y C2
*(completar)*

### Integrante 4 · Pruebas, iteración y C3
*(completar)*

## Recomendaciones

- Re-probar la v2 con dos participantes nuevos para convertir las predicciones en datos.
- Probar con un lector de pantalla (NVDA) y en celular con conexión real.
- Evaluar si conviene permitir adjuntar una captura a cada hallazgo (quedó fuera del alcance del prototipo). *(Agregar aquí lo que pidan P01/P02.)*
