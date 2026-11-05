# Protocolo de prueba de usabilidad y accesibilidad

> Fase 3 (50 min) · Responsable: **Integrante 4** (facilitador) con apoyo de **Integrante 1** (observador/cronómetro) · Issue: #11
> Versión probada: **v1** (`prototipo/v1/`). Opcional: repetir T2 y T3 con v2 para comparar.

## 1. Objetivo

Comprobar si dos personas que no diseñaron el prototipo pueden **localizar** (T1), **operar y corregir** (T2) y **finalizar con confirmación** (T3) el registro de una evaluación UX, y observar cómo responden en los dos momentos de verdad (MV1 envío fallido, MV2 confirmación).

## 2. Participantes

| Código | Perfil (sin datos personales) | Criterio |
|---|---|---|
| P01 | Estudiante universitario, no pertenece al equipo ni diseñó la interfaz | Uso habitual de computador |
| P02 | Estudiante universitario, no pertenece al equipo ni diseñó la interfaz | Uso habitual de computador; hará la tarea A1 solo con teclado |

No se registran nombres, cédulas, correos ni fotos del rostro. Solo códigos P01/P02, carrera o semestre aproximado si es relevante.

## 3. Consentimiento básico (leer en voz alta)

> «Gracias por ayudarnos. Vamos a probar un prototipo para una tarea de la materia de Interacción Humano–Computador. **Evaluamos el sistema, no a ti**: si algo cuesta, es un problema del diseño. Te pediremos que pienses en voz alta. Anotaremos tiempos, errores y comentarios con el código P01/P02, sin tu nombre. Puedes detenerte cuando quieras. ¿Aceptas participar?»

Registrar en la hoja: «Consentimiento verbal: Sí — hora __:__».

## 4. Preparación (5 min)

1. Abrir `prototipo/v1/index.html#/observador`.
2. Escribir el código del participante (P01), elegir **«Falla el primer envío (red)»** y pulsar **Comenzar sesión de prueba**. El prototipo vuelve al inicio y empieza a registrar tiempos.
3. Entregar el equipo y la **tarjeta de datos** (sección 6). Cronómetro de respaldo listo.
4. Roles: **facilitador** lee las tareas y no ayuda salvo bloqueo de 2 min; **observador** anota en la hoja; **fotógrafo** captura la pantalla (no el rostro) en los momentos clave.

## 5. Tareas y guion

| Tarea | Consigna (leer tal cual) | Éxito | Heurística a observar |
|---|---|---|---|
| **T1** Localizar | «Terminaste una evaluación de la App Biblioteca FISEI. Encuentra dónde se registra.» | Llega al paso 1 sin ayuda | H6 (¿reconoce la acción?) |
| **T2** Operar / corregir | «Registra la evaluación con los datos de esta tarjeta. Si el sistema marca algo, corrígelo.» | Llega a la revisión con 3 hallazgos correctos | **H5** prevención de errores |
| **T3** Finalizar / confirmar | «Envía la evaluación. Cuando termines, dime cómo sabes que quedó registrada.» | Ve el código de registro (tras reintentar) | **H9** recuperación de errores · **H1** estado del sistema |
| **A1** (solo P02, después de T3) | «Sin usar el mouse, empieza otra evaluación y completa el primer paso con los datos de la tarjeta.» | Llega al paso 2 solo con teclado | Accesibilidad: teclado y foco visible |

**Preguntas durante la tarea (solo si guarda silencio):** «¿Qué estás buscando?», «¿Qué esperas que pase?».
**En MV1 (aparece el error de envío), preguntar:** «¿Qué crees que pasó con lo que escribiste?» → anotar textual.
**Después de cada tarea:** «Del 1 (muy difícil) al 7 (muy fácil), ¿qué tan fácil fue?» (SEQ).

## 6. Tarjeta de datos para T2 (imprimir o mostrar)

| Campo | Valor |
|---|---|
| Proyecto | App Biblioteca FISEI |
| Tipo | Evaluación heurística |
| Fecha | hoy |
| Código del evaluador | **E7** |
| Tarea evaluada | Reservar un libro desde el catálogo |
| Hallazgo 1 | H1 · severidad **Mayor** · «Al pulsar Reservar no aparece confirmación y el usuario pulsa varias veces.» · Dónde: botón Reservar |
| Hallazgo 2 | H9 · severidad **Catastrófico** · «El error de la reserva solo dice Error 0x12 y no explica qué hacer.» · Dónde: pantalla de reserva fallida |
| Hallazgo 3 | H4 · severidad **Cosmético** · «Los íconos de la barra inferior no siguen el estándar del sistema.» · Dónde: barra inferior |

> Notas para el equipo (no mostrar al participante): el código **E7** está incompleto a propósito para provocar la ruta de error **T2-E** (el formato correcto es E07). Las severidades se dan **por nombre** para observar si la escala de la v1 (solo números) se entiende. El fallo de red simulado en el primer envío provoca la ruta **T3-E**.

## 7. Qué se mide

| Métrica | Cómo | Dónde se anota |
|---|---|---|
| Tiempo por tarea (s) | Automático en el panel del observador (respaldo con cronómetro) | `resultados.csv` › `tiempo_s` |
| Éxito | `completa` / `con_ayuda` / `no` | `exito` |
| Errores | Errores de validación y envíos fallidos (panel) + desvíos observados | `errores` |
| Ayudas | Veces que el facilitador intervino | `ayudas` |
| Facilidad percibida | SEQ 1–7 | `seq` |
| Emoción observada | Escala −2 a +2 **según evidencia**: verbalizaciones («uy, ¿se borró?»), pausas largas, suspiros, sonrisa, autocorrección | `emocion_observada` + `comentario_textual` |
| Emoción por touchpoint | Al final, mostrar TP1–TP8 y pedir que el participante califique de −2 a +2 lo que sintió (autorreporte) | `recorrido-emocional.csv` › `valor_v1_observado_P0#` |

**Regla de honestidad:** no se inventan ni redondean métricas. Si un dato no se midió, la celda queda vacía y se explica en `hallazgos.md`. Las predicciones de la v2 se marcan como «predicción».

## 8. Cierre (2 min por participante)

1. «¿Qué fue lo más confuso?» y «¿Qué cambiarías primero?» → textual.
2. Calificación por touchpoint (−2 a +2).
3. En el panel: **Terminar sesión** → **Descargar resumen** y **Descargar eventos** → guardar en `pruebas/` como `resumen-P01-v1.csv` y `eventos-P01-v1.csv`.
4. Repetir desde el paso 4.2 con P02.

## 9. Hoja de observación (copiar una por participante)

```
Participante: P0_   Fecha: __/__/2026   Hora inicio: __:__   Consentimiento: Sí / No
Versión: v1   Fallo simulado: primer envío (red)

T1  Tiempo: ___ s  Éxito: completa / con_ayuda / no  Ayudas: __  SEQ: _/7
    Ruta seguida / dudas: ______________________________________________
T2  Tiempo: ___ s  Éxito: ______  Errores: __  Ayudas: __  SEQ: _/7
    ¿Corrigió E7 → E07 sin perder datos?  Sí / No
    ¿Entendió la severidad por nombre (Mayor=3, Catastrófico=4, Cosmético=1)?  Sí / No / Preguntó
    ¿Pulsó «Siguiente» con un hallazgo escrito sin agregar?  Sí / No   ¿Lo notó?  Sí / No
T3  Tiempo: ___ s  Éxito: ______  Errores: __  Ayudas: __  SEQ: _/7
    Ante el error de envío dijo (textual): "_________________________________"
    ¿Reintentó sin reescribir?  Sí / No    ¿Mencionó el código al final?  Sí / No
A1 (P02)  ¿Completó solo con teclado?  Sí / No   ¿Siempre vio dónde estaba el foco?  Sí / No
Emoción por touchpoint (−2..+2): TP1 __ TP2 __ TP3 __ TP4 __ TP5 __ TP6 __ TP7 __ TP8 __
Comentarios finales: ____________________________________________________
```
