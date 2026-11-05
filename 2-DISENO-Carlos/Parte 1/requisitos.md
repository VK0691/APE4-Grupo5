# Requisitos R1–R6 · RegistraUX

> Fase 2 · Responsable: **Integrante 2** · Issue: #6
> Convención tomada de [DavidPe1307/Grupo_2__Exposicion](https://github.com/DavidPe1307/Grupo_2__Exposicion): un requisito por verbo, redactado desde el usuario y numerado R1…R6. Aquí además cada requisito es **medible** (criterio de aceptación verificable en la prueba).

**Historia de usuario base.** *Como evaluadora del laboratorio (Valeria), quiero registrar los hallazgos de una evaluación con su heurística y severidad, sin perder lo escrito si algo falla, para que el docente los revise antes del cierre de las 18:00.*

## Requisitos funcionales

| ID | Valeria debe poder… | Criterio de aceptación (medible) | Problema que atiende | Heurísticas |
|---|---|---|---|---|
| **R1** | **Acceder** al registro desde el inicio. | El botón «Registrar evaluación» está visible en el inicio sin abrir menús; el paso 1 se alcanza con **1 interacción** y en **≤ 30 s** (T1). | P2 | H2, H6 |
| **R2** | **Ingresar** los datos generales de la sesión. | Proyecto y tipo se eligen de listas con nombres completos; fecha con selector y sin fechas futuras; código del evaluador con formato `E##` (sin nombre real); tarea de 5–80 caracteres. Cada campo tiene etiqueta visible. | P5 | H2, H4, H5 |
| **R3** | **Registrar** hallazgos con heurística y severidad. | Permite de 1 a 10 hallazgos; heurística de una lista H1–H10; severidad en una escala de 5 opciones 0–4; descripción de 20–300 caracteres con contador; ubicación obligatoria. | P5 | H5, H6 |
| **R4** | **Modificar** la información antes de enviar. | Cada hallazgo se puede editar o eliminar; eliminar pide confirmación y ofrece *Deshacer*; el borrador se guarda solo y el indicador muestra «Borrador guardado a las HH:MM». | P1 | H3, H1 |
| **R5** | **Corregir** errores sin perder datos. | Ante datos inválidos: resumen de errores con enlaces + mensaje junto a cada campo + foco en el resumen; los datos escritos se conservan. Ante fallo de red o de sesión: pantalla de error con *Reintentar* y el borrador intacto. | P1, P3 | H9, H5 |
| **R6** | **Finalizar** con confirmación. | Antes de enviar, pantalla de revisión con atajos «Editar»; durante el envío, estado de carga visible; al terminar, confirmación con código `EV-2026-####`, fecha, hora y enlace «Ver registro». | P4 | H1, H5 |

## Requisitos no funcionales (accesibilidad y calidad)

| ID | Requisito | Verificación |
|---|---|---|
| RNF1 | Todo el flujo se completa **solo con teclado** (Tab, Mayús+Tab, Enter, Espacio, flechas, Esc). | Prueba de accesibilidad A1 en [`pruebas/accesibilidad.md`](pruebas/accesibilidad.md). |
| RNF2 | **Foco visible** en todos los controles (contorno de 3 px, contraste ≥ 3:1). | WCAG 2.4.7 y 1.4.11 – medido. |
| RNF3 | Errores identificados **en texto** y asociados al campo (`aria-invalid`, `aria-describedby`); nunca solo por color. | WCAG 3.3.1, 3.3.3, 1.4.1. |
| RNF4 | Contraste de texto ≥ 4,5:1. | WCAG 1.4.3 – medido. |
| RNF5 | Mensajes de estado anunciados a lectores de pantalla (`role="status"`, `aria-live`). | WCAG 4.1.3. |
| RNF6 | Sin datos personales de participantes ni evaluadores: códigos `P##` y `E##`. | Revisión del protocolo. |

## Fuera de alcance (prototipo)

Autenticación real, servidor y base de datos (se simulan), adjuntar archivos de evidencia, edición de registros ya enviados.
