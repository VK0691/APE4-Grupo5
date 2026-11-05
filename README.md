# APE 4 integradora · RegistraUX

**Universidad Técnica de Ambato · FISEI · Carrera de Software** · Repositorio: [VK0691/APE4-Grupo5](https://github.com/VK0691/APE4-Grupo5)
Interacción Humano–Computador · Quinto nivel · Paralelo B · Docente: Ing. José Caiza, Mg.

> Prototipado — wireframes, arquitectura, experiencia emocional y validación.
> Caso asignado: **Registro de evaluaciones UX**.

## Caso

Valeria, evaluadora auxiliar del laboratorio de usabilidad, debe registrar los hallazgos de una evaluación heurística antes del cierre de las 18:00, con Wi-Fi intermitente y usando sobre todo el teclado. En el sistema actual la opción está escondida, la severidad se escribe a mano, los errores son genéricos y, si la sesión expira o se corta la red, **se borra todo el formulario**. Detalle en [`diagnostico.md`](diagnostico.md).

## Abrir el prototipo

- Selector de versiones: [`prototipo/index.html`](prototipo/index.html) (doble clic; funciona sin internet).
- **v1:** [`prototipo/v1/index.html`](prototipo/v1/index.html) · **v2:** [`prototipo/v2/index.html`](prototipo/v2/index.html)
- **Ruta de error:** añadir `?fallo=una` (falla el primer envío) o `?fallo=sesion` antes del `#`.
- Panel del observador para las pruebas: `prototipo/v1/index.html#/observador`.
- En línea (si activan GitHub Pages en *Settings ▸ Pages ▸ main / root*): https://vk0691.github.io/APE4-Grupo5/APE4-integral/prototipo/

Técnica, fidelidad, estados y flujos: [`prototipo/README.md`](prototipo/README.md).

## Entregables

| Fase | Archivo | Descripción |
|---|---|---|
| 1 Diagnóstico | [`diagnostico.md`](diagnostico.md) | Persona, T1–T3, 5 problemas priorizados con heurísticas, momentos de verdad |
| | [`recorrido-emocional.csv`](recorrido-emocional.csv) · [`.png`](recorrido-emocional.png) | 8 touchpoints, escala −2 a +2, 2 momentos de verdad |
| 2 Diseño | [`requisitos.md`](requisitos.md) | R1–R6 medibles + requisitos no funcionales |
| | [`sitemap.png`](sitemap.png) · [`user-flow.png`](user-flow.png) | Árbol de pantallas · flujo con decisiones, error y recuperación |
| | [`componentes.md`](componentes.md) | 20 componentes con estados, accesibilidad, requisito y heurística |
| | [`wireframes/`](wireframes/) | W1 inicio, W2 formulario, W3 error, W4 éxito (+ W5 revisión) |
| | [`trazabilidad.md`](trazabilidad.md) | Requisito → flujo → wireframe → pantalla → prueba → hallazgo → commit |
| | [`prototipo/v1/`](prototipo/v1/) | 9 pantallas, 3 flujos, carga/error/éxito, teclado y foco |
| 3 Prueba | [`pruebas/protocolo.md`](pruebas/protocolo.md) | Guion, consentimiento, tareas, métricas, hoja de observación |
| | [`pruebas/resultados.csv`](pruebas/resultados.csv) | Tiempos, éxito, errores, SEQ y emoción por participante y tarea |
| | [`pruebas/hallazgos.md`](pruebas/hallazgos.md) | Hallazgos con evidencia y priorización |
| | [`pruebas/accesibilidad.md`](pruebas/accesibilidad.md) | Contraste medido + A1 teclado y A2 errores |
| 4 Iteración | [`prototipo/v2/`](prototipo/v2/) | 3 correcciones marcadas `[v2-C1]`, `[v2-C2]`, `[v2-C3]` |
| | [`iteracion/antes-despues.md`](iteracion/antes-despues.md) | Comparación v1/v2, medición honesta, curva comparada |
| 5 Cierre | [`conclusiones.md`](conclusiones.md) | Conclusiones del equipo e individuales |
| | [`evidencias/`](evidencias/) | Interfaz original, capturas, fotos de la prueba, incidencia |
| | [`herramientas/`](herramientas/) | Scripts para regenerar gráficos, capturas y verificación de accesibilidad |

## Colaboración en GitHub

| Elemento | Enlace |
|---|---|
| Issues | https://github.com/VK0691/APE4-Grupo5/issues?q=is%3Aissue |
| Pull Requests | https://github.com/VK0691/APE4-Grupo5/pulls?q=is%3Apr |
| Commits | https://github.com/VK0691/APE4-Grupo5/commits/main |
Flujo de trabajo: una Issue por tarea → rama propia → commits pequeños con mensaje descriptivo → Pull Request que cierra la Issue (`Closes #n`) → revisión de otro integrante → merge a `main`.
Revisión cruzada: I1 revisa a I3 · I2 revisa a I4 · I3 revisa a I2 · I4 revisa a I1.

## Fuentes conceptuales

- [juANO2202/HCI-2026-G1](https://github.com/juANO2202/HCI-2026-G1) — curva emocional, touchpoints, momentos de verdad, mejora antes/después.
- [DavidPe1307/Grupo_2__Exposicion](https://github.com/DavidPe1307/Grupo_2__Exposicion) — R1–R6, sitemap, navegación, user flow, componentes, wireframes, trazabilidad.
- [Mauri10G/Grupo_3_Exposicion](https://github.com/Mauri10G/Grupo_3_Exposicion) — prototipo horizontal/vertical, fidelidad, técnicas, v1 → prueba → v2.

El caso, la persona, el sistema y todo el contenido de esta carpeta son originales del equipo; los repositorios se usan solo como referencia conceptual.
