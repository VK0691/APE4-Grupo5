# Hallazgos de la prueba (v1)

> Fase 3 → 4 · Responsable: **Integrante 4** · Issues de hallazgos: #12, #13, #14 (una por hallazgo)
> Datos: [`resultados.csv`](resultados.csv), `resumen-P0#-v1.csv`, `eventos-P0#-v1.csv`, hojas de observación y capturas en [`../evidencias/`](../evidencias/).

## Cómo se completa este archivo

Antes de la prueba, el equipo dejó escritas tres **hipótesis** (lo que creemos que va a fallar en la v1, a partir del diagnóstico y del recorrido cognitivo). Después de probar con P01 y P02:

1. Si la hipótesis **se observó**, se completa la evidencia (qué pasó, quién, cita textual, dato del CSV) y pasa a ser **hallazgo confirmado**.
2. Si **no se observó**, se marca «No observado» y **no** se usa para justificar la v2. En su lugar se registra el hallazgo que sí apareció y se ajusta la corrección correspondiente (ver `../iteracion/antes-despues.md`).
3. Nada se inventa: lo que no se midió queda vacío.

## Hipótesis y evidencia

### H-01 · Hallazgo escrito y no agregado se pierde al pulsar «Siguiente»

| Campo | Valor |
|---|---|
| Hipótesis | Tras completar el tercer hallazgo, el participante pulsa *Siguiente: revisar* sin pulsar *Agregar hallazgo*; la v1 descarta lo escrito sin avisar. |
| Heurísticas | H5 Prevención de errores · H3 Control y libertad |
| Requisitos | R3, R4 |
| Señal en los datos | Evento `hallazgo_descartado` en `eventos-P0#-v1.csv`; en revisión aparecen 2 hallazgos en vez de 3 |
| ¿Se observó? | ☐ P01 ☐ P02 ☐ No observado |
| Evidencia | *(qué pasó, cita textual, captura)* |
| Severidad asignada | *(0–4)* |
| Decisión | Corrección **v2-C1** (Integrante 2) |

### H-02 · La escala de severidad con solo números obliga a recordar su significado

| Campo | Valor |
|---|---|
| Hipótesis | Con severidades dadas por nombre (Mayor, Catastrófico, Cosmético), el participante duda, pregunta o abre *Ayuda* (sale del formulario) para traducir el nombre al número. |
| Heurísticas | H6 Reconocer antes que recordar · H2 Lenguaje del usuario · H10 Ayuda |
| Requisitos | R3 |
| Señal en los datos | Evento `pantalla /ayuda` durante T2; preguntas al facilitador; severidad incorrecta en la revisión |
| ¿Se observó? | ☐ P01 ☐ P02 ☐ No observado |
| Evidencia | |
| Severidad asignada | |
| Decisión | Corrección **v2-C2** (Integrante 3) |

### H-03 · El error de envío no aclara si los datos se perdieron (MV1)

| Campo | Valor |
|---|---|
| Hipótesis | Ante «Error de conexión (NET-01). Inténtalo de nuevo.», el participante cree que perdió lo escrito, duda antes de reintentar o vuelve a la revisión para comprobarlo. |
| Heurísticas | H9 Recuperarse de errores · H1 Visibilidad del estado |
| Requisitos | R5 · Momento de verdad MV1 |
| Señal en los datos | Respuesta a «¿Qué crees que pasó con lo que escribiste?»; tiempo entre `envio_fallido` y `reintento`; visita a `/registrar/revision` antes de reintentar |
| ¿Se observó? | ☐ P01 ☐ P02 ☐ No observado |
| Evidencia | |
| Severidad asignada | |
| Decisión | Corrección **v2-C3** (Integrante 4) |

## Hallazgos adicionales (no previstos)

| ID | Observación | Participante | Heurística | Severidad | Decisión (v2 / pendiente) |
|---|---|---|---|---|---|
| H-04 | | | | | |
| H-05 | | | | | |

## Revisión de heurísticas en la prueba

| Heurística | Pregunta guía | P01 | P02 |
|---|---|---|---|
| H1 Visibilidad del estado | ¿Supo en qué paso estaba, que se guardaba el borrador y si el envío terminó? | | |
| H5 Prevención de errores | ¿El diseño evitó errores (listas, escala, límites) o solo los reportó? | | |
| H9 Recuperarse de errores | ¿Entendió cada error y lo corrigió sin perder datos ni pedir ayuda? | | |

## Priorización para la iteración

Prioridad = severidad × frecuencia (1 o 2 participantes). Se corrigen en v2 los **3 de mayor prioridad**; el resto queda como Issue abierta con etiqueta `pendiente`.

| Hallazgo | Severidad | Frecuencia | Prioridad | ¿Se corrige en v2? |
|---|---|---|---|---|
| H-01 | | | | |
| H-02 | | | | |
| H-03 | | | | |
