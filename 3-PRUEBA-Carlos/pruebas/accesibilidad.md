# Revisión de accesibilidad

> Fase 3 · Responsable: **Integrante 4** · Issue: #11
> Dos condiciones exigidas por la guía: **A1 operación completa con teclado y foco visible** y **A2 errores perceptibles y comprensibles**. Se verifican de dos formas: técnicamente (herramienta) y con participantes.

## Parte 1 · Verificación técnica (reproducible)

Ejecutada con `python herramientas/verificar_accesibilidad.py` sobre v1 y v2 (navegador Chromium sin interfaz). Vuelvan a ejecutarla si cambian colores o campos.

### Contraste (WCAG 2.2 · 1.4.3 texto, 1.4.11 elementos no textuales)

| Par de colores | Primer plano | Fondo | Contraste | Mínimo | Resultado |
|---|---|---|---|---|---|
| Texto principal | `#1C2740` | `#FFFFFF` | 14,86:1 | 4,5:1 | Cumple |
| Texto principal sobre fondo | `#1C2740` | `#F3F5F8` | 13,60:1 | 4,5:1 | Cumple |
| Texto secundario / ayuda | `#4A5468` | `#FFFFFF` | 7,61:1 | 4,5:1 | Cumple |
| Texto secundario sobre fondo | `#4A5468` | `#F3F5F8` | 6,97:1 | 4,5:1 | Cumple |
| Botón primario (blanco sobre verde azulado) | `#FFFFFF` | `#0B5E63` | 7,51:1 | 4,5:1 | Cumple |
| Enlace | `#0B5E63` | `#FFFFFF` | 7,51:1 | 4,5:1 | Cumple |
| Mensaje de error | `#B42318` | `#FFFFFF` | 6,57:1 | 4,5:1 | Cumple |
| Error sobre fondo de error | `#B42318` | `#FDF1F0` | 5,95:1 | 4,5:1 | Cumple |
| Aviso (plazo 18:00) | `#7A4F00` | `#FFF6DB` | 6,60:1 | 4,5:1 | Cumple |
| Éxito | `#1B6B3A` | `#ECF7EF` | 5,95:1 | 4,5:1 | Cumple |
| Borde de campo (no textual) | `#727C8F` | `#FFFFFF` | 4,20:1 | 3:1 | Cumple |
| Indicador de foco (no textual) | `#5B21B6` | `#F3F5F8` | 8,22:1 | 3:1 | Cumple |
| Etiquetas de severidad 0–4 (blanco sobre color) | `#FFFFFF` | `#5B6475`…`#A1123A` | 5,90–7,89:1 | 4,5:1 | Cumple (las 5) |

La interfaz **original** usa texto `#999` sobre `#FAFAFA` (≈ 2,7:1) y quita el contorno de foco (`outline: none`): no cumple 1.4.3 ni 2.4.7.

### Teclado, foco y errores (paso 1 de v1 y v2)

| Comprobación | Resultado medido |
|---|---|
| Orden de tabulación | Proyecto → Tipo (grupo de radios) → Fecha (día, mes, año, calendario) → Código → Tarea → *Guardar y salir* → *Siguiente*: sigue el orden visual. |
| Foco visible | Contorno violeta de 3 px en todos los controles. En los radios el contorno se dibuja en la tarjeta que los contiene (decisión de diseño); el selector de calendario usa el foco nativo del navegador. |
| Controles sin etiqueta | 0 |
| Al enviar vacío | Los 5 campos quedan con `aria-invalid="true"`, cada uno con su mensaje asociado por `aria-describedby`, y el foco pasa al resumen de errores (`role="alert"`). |
| Escala de severidad | Radios nativos: flechas ← → cambian el nivel; Espacio selecciona. |
| Diálogos | `showModal()`: el foco queda dentro, Esc cierra, el foco inicial está en la opción segura (Cancelar / Conservar). |

## Parte 2 · Verificación con participantes (completar en la prueba)

| Condición | Criterio | P01 | P02 | Evidencia |
|---|---|---|---|---|
| **A1** Teclado y foco | P02 completa el paso 1 sin mouse (tarea A1) y en ningún momento pierde de vista el foco | — | ☐ Sí ☐ No | captura / nota |
| **A2** Errores perceptibles | En T2, ante el código **E7**, el participante identifica qué campo falla y lo corrige leyendo el mensaje, sin ayuda | ☐ Sí ☐ No | ☐ Sí ☐ No | cita textual |

Observaciones: *(completar)*
