# Inventario de componentes · RegistraUX

> Fase 2 · Responsable: **Integrante 2** · Issue: #8
> Cada componente indica sus estados, el requisito que cumple, la heurística que aplica y dónde aparece. Implementación: [`prototipo/v1/`](prototipo/v1/) (clases CSS entre paréntesis).

| # | Componente | Estados implementados | Accesibilidad | Requisito | Heurística | Pantallas |
|---|---|---|---|---|---|---|
| C01 | Barra de navegación global (`.barra`, `.nav`) | normal, actual (`aria-current="page"`), hover, foco | `<nav aria-label="Principal">` | R1 | H4, H3 | Todas |
| C02 | Enlace «Saltar al contenido» (`.saltar`) | oculto, visible al recibir foco | primer elemento tabulable | RNF1 | — | Todas |
| C03 | Indicador de borrador (`.borrador`) | vacío, guardando, guardado «HH:MM» | `aria-live="polite"` | R4 | H1 | Todas |
| C04 | Botón primario (`.btn--primario`) | normal, hover, foco, deshabilitado | texto que dice la acción | R1, R6 | H4 | S1–S7 |
| C05 | Botón secundario / terciario / peligro | normal, hover, foco | — | R4 | H3 | S2–S8 |
| C06 | Pasos del asistente (`.pasos`) | pendiente, actual (`aria-current="step"`), completado | texto oculto «(paso actual)» | R2–R6 | H1 | S2–S4 |
| C07 | Campo con etiqueta, ayuda y error (`.campo`) | vacío, con valor, foco, inválido | `<label for>`, `aria-describedby`, `aria-invalid` | R2, R3, R5 | H5, H9 | S2, S3 |
| C08 | Lista desplegable (`select`) | idem C07 | etiqueta visible | R2, R3 | H6 | S2, S3 |
| C09 | Grupo de opciones (`.opciones`, radios) | sin elegir, elegido, foco en el contenedor | `<fieldset>` + `<legend>` | R2 | H6 | S2 |
| C10 | Escala de severidad 0–4 (`.escala`) | sin elegir, elegido (color + número), foco, inválido. **v2:** nombre visible y ayuda desplegable | radios nativos, flechas del teclado | R3 | H5, H6 (v2: H2, H10) | S3 |
| C11 | Área de texto con contador (`textarea` + `.contador`) | normal, excedido | contador `aria-hidden`, límite en la ayuda | R3 | H5 | S3 |
| C12 | Tarjeta de hallazgo (`.hallazgo`) | normal, en edición, eliminado con *Deshacer* | botones con `aria-label` «Editar hallazgo N» | R4 | H3 | S3, S4, detalle |
| C13 | Etiqueta de severidad (`.sev`) | 5 niveles: número + nombre + color | nunca solo color | R3 | H4 | S3, S4, S9 |
| C14 | Resumen de errores (`.alerta--error`) | oculto, visible con enlaces a cada campo | `role="alert"`, recibe el foco | R5 | H9 | S2, S3 |
| C15 | Diálogo de confirmación (`dialog`) | eliminar hallazgo, descartar borrador; **v2:** hallazgo sin agregar | `showModal()`, Esc cierra, foco en la opción segura | R4, R5 | H3, H5 | S1, S3 |
| C16 | Estado de carga (`.carga`, `.giro`, barra de progreso) | enviando; esqueleto en la lista | `role="status"`, `aria-busy` | R6 | H1 | S5, S8 |
| C17 | Pantalla de error de envío (`.alerta--error`) | red, sesión. **v2:** confirma datos a salvo + 3 salidas | `role="alert"` | R5 | H9, H1 | S6 |
| C18 | Confirmación con código (`.exito`, `.codigo`) | éxito con animación del visto (respeta movimiento reducido) | `role="status"` | R6 | H1 | S7 |
| C19 | Tabla de evaluaciones | cargando, vacía, con datos, borrador | `<caption>`, `scope="col"` | R6 | H6 | S1, S8 |
| C20 | Aviso flotante (`.aviso`) | oculto, visible 4 s | `role="status"` | R4 | H1 | Todas |

## Tokens de diseño

| Token | Valor | Uso |
|---|---|---|
| `--primario` | `#0B5E63` | acción principal, enlaces, pasos completados |
| `--tinta` / `--tinta-2` | `#1C2740` / `#4A5468` | texto principal / ayudas |
| `--foco` | `#5B21B6` | contorno de foco (distinto de todos los colores de estado) |
| `--error` / `--exito` / `--aviso` | `#B42318` / `#1B6B3A` / `#7A4F00` | estados; siempre con texto o ícono |
| `--sev0`…`--sev4` | `#5B6475` → `#A1123A` | escala de severidad |
| Tipografía | Atkinson Hyperlegible 400/700 (local, OFL) | diseñada para máxima legibilidad |

Contrastes medidos en [`pruebas/accesibilidad.md`](pruebas/accesibilidad.md).
