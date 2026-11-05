# Prototipo navegable · RegistraUX

> Fase 2 (v1) · Responsable v1: **Integrante 3** · Issue: #10
> Fase 4 (v2) · C1 **Integrante 2**, C2 **Integrante 3**, C3 **Integrante 4** · Issues: #12, #13, #14

## Cómo abrirlo

- **Local:** doble clic en `prototipo/index.html` (elige v1 o v2) o directamente en `prototipo/v1/index.html`. No necesita internet ni instalar nada.
- **En línea (GitHub Pages):** *Settings ▸ Pages ▸ Deploy from a branch ▸ `main` / `(root)`* y abrir `https://<usuario>.github.io/<repo>/APE4-integral/prototipo/`.

| Para mostrar… | Abrir |
|---|---|
| Ruta exitosa | `v2/index.html#/inicio` |
| Ruta de error de envío y reintento | `v2/index.html?fallo=una#/inicio` |
| Sesión expirada | `v2/index.html?fallo=sesion#/inicio` |
| Error permanente (salir y volver) | `v2/index.html?fallo=siempre#/inicio` |
| Panel del observador (pruebas) | `v1/index.html#/observador` |

> Los datos se guardan en el navegador (`localStorage`). Para empezar de cero: panel del observador ▸ *Comenzar sesión*, o en la consola `localStorage.clear()`.

## Técnica y fidelidad (justificación)

Basado en [Mauri10G/Grupo_3_Exposicion](https://github.com/Mauri10G/Grupo_3_Exposicion) (técnicas y ciclo v1 → prueba → v2) y en las dimensiones de fidelidad de McCurdy et al. (2006).

| Decisión | Elección | Por qué |
|---|---|---|
| Técnica | **Prototipo en código** (HTML, CSS, JavaScript sin librerías) | El caso exige probar validaciones, autoguardado, foco y teclado reales; en papel o clic a clic esas interacciones no existen. También permite cambiarlo en vivo durante la incidencia. |
| Alcance | **Horizontal** en la navegación (inicio, mis evaluaciones, ayuda) y **vertical** en la tarea crítica (registrar evaluación) | Se prueba a fondo lo que importa (T1–T3) sin construir todo el sistema. |
| Fidelidad visual | Media | Paleta, tipografía y jerarquía finales; sin pulido de marca. |
| Fidelidad de interacción | Alta | Validación real, estados, foco, diálogos, reintento. |
| Fidelidad de datos | Simulada | Proyectos, registros y fallos de red ficticios (tipo *Mago de Oz* controlado por parámetros). |
| **Lo que NO permite probar** | Rendimiento con servidor real, concurrencia, lectores de pantalla en profundidad, uso en móvil con conexión real, seguridad e inicio de sesión. | Se declara para no sobreinterpretar los resultados. |

## Pantallas y estados (≥ 6)

| ID | Pantalla / estado | Ruta |
|---|---|---|
| S1 | Inicio (normal / con borrador pendiente) | `#/inicio` |
| S2 | Paso 1 · Datos generales (normal / error de validación) | `#/registrar/datos` |
| S3 | Paso 2 · Hallazgos (vacío / con lista / editando / eliminado con deshacer / error) | `#/registrar/hallazgos` |
| S4 | Paso 3 · Revisión | `#/registrar/revision` |
| S5 | **Carga** · Enviando | `#/enviando` |
| S6 | **Error** de envío (red / sesión) | `#/error-envio` |
| S7 | **Éxito** · Confirmación con código | `#/exito` |
| S8 | Mis evaluaciones (cargando / lista) y detalle | `#/evaluaciones` |
| S9 | Ayuda | `#/ayuda` |

## Flujos (3)

1. **F1 Ruta exitosa:** Inicio → Paso 1 → Paso 2 (3 hallazgos) → Revisión → Enviando → Confirmación → Ver registro.
2. **F2 Error de validación y corrección:** datos inválidos → resumen + mensaje en el campo → corrige sin perder lo escrito.
3. **F3 Error de envío y recuperación:** `?fallo=una` → error → *Reintentar* → éxito; o *Salir* → el borrador espera en el inicio (*Continuar borrador*).

## Retroalimentación, microinteracciones y teclado

- Indicador «Borrador guardado a las HH:MM» (cambia de color mientras guarda).
- Contador de caracteres, descripción del nivel de severidad al elegirlo, aviso flotante al agregar/editar.
- Visto animado en la confirmación (se desactiva con *movimiento reducido*).
- Foco: contorno violeta de 3 px; al cambiar de pantalla va al título; tras un error va al resumen; tras eliminar va a *Deshacer*.
- Teclado: Tab/Mayús+Tab, flechas en la escala y en los radios, Enter envía, Esc cierra diálogos; enlace «Saltar al contenido».

## Dónde cambiar cosas durante la incidencia sorpresa

| Si el docente pide… | Archivo y lugar |
|---|---|
| Cambiar límites (caracteres, número de hallazgos, formato de código) | `app.js` ▸ objeto `CONFIG` |
| Agregar un proyecto, tipo o heurística | `app.js` ▸ `PROYECTOS`, `TIPOS`, `HEURISTICAS` |
| Agregar un campo obligatorio | `app.js` ▸ `nuevoBorrador()`, el HTML de `pantallaDatos()` o `pantallaHallazgos()`, y `validarDatos()` / `validarHallazgo()` |
| Cambiar un mensaje de error | `app.js` ▸ `validarDatos()`, `validarHallazgo()` o `pantallaErrorEnvio()` |
| Cambiar colores o contraste | `styles.css` ▸ `:root` |
| Nuevo fallo simulado | `app.js` ▸ `resolverEnvio()` |

## Registro reproducible de pruebas

El panel `#/observador` registra eventos con marca de tiempo (pantallas, errores, envíos) del participante `P##` y calcula el tiempo de T1, T2 y T3. Exporta `resumen-v1.csv` y `eventos-v1.csv` para `pruebas/`.
