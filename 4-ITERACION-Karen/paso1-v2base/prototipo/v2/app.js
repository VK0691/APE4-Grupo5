/* RegistraUX — Prototipo navegable (APE 4 · IHC · FISEI-UTA)
 *
 * Técnica: prototipo en código (HTML/CSS/JS), horizontal en la navegación general
 * (inicio, mis evaluaciones, ayuda) y vertical en la tarea crítica "registrar evaluación".
 * Fidelidad: visual media, de interacción alta, de datos simulados (no hay servidor).
 *
 * Parámetros de prueba en la URL:
 *   ?fallo=una      el primer envío falla por red y el reintento funciona
 *   ?fallo=siempre  todos los envíos fallan (para mostrar la ruta de error)
 *   ?fallo=sesion   el primer envío falla porque la sesión expiró
 *   ?p=P01          registra eventos de la sesión de prueba del participante P01
 * Panel del observador: abrir index.html#/observador
 *
 * VERSIÓN 2 — cambios respecto a v1 (buscar las marcas [v2-C1], [v2-C2], [v2-C3]):
 *   C1  Aviso de hallazgo sin agregar al pulsar "Siguiente" (antes se perdía sin avisar).
 *   C2  Escala de severidad con nombre visible y ayuda en el mismo formulario.
 *   C3  Error de envío que confirma que los datos están a salvo y cómo continuar.
 * Ver ../../iteracion/antes-despues.md
 */
'use strict';

const VERSION = document.body.dataset.version || 'v1';

/* ===================== CONFIGURACIÓN =====================
 * Durante la incidencia sorpresa, la mayoría de cambios se hacen aquí. */
const CONFIG = {
  usuaria: 'Valeria',
  cierreRegistro: '18:00',
  maxHallazgos: 10,
  descripcionMin: 20,
  descripcionMax: 300,
  tareaMin: 5,
  tareaMax: 80,
  patronEvaluador: /^E\d{2}$/,      // E01–E99: código, nunca el nombre real
  ejemploEvaluador: 'E07',
  demoraEnvioMs: 1600,
  demoraListaMs: 600,
  prefijoCodigo: 'EV-2026-',
};

const PROYECTOS = [
  { id: 'biblioteca', nombre: 'App Biblioteca FISEI' },
  { id: 'practicas', nombre: 'Portal de prácticas preprofesionales' },
  { id: 'kiosco', nombre: 'Kiosco de turnos del comedor' },
  { id: 'eventos', nombre: 'Sitio de eventos académicos' },
];

const TIPOS = [
  { id: 'heuristica', nombre: 'Evaluación heurística' },
  { id: 'usabilidad', nombre: 'Prueba de usabilidad con usuarios' },
  { id: 'cognitivo', nombre: 'Recorrido cognitivo' },
];

const HEURISTICAS = [
  { id: 'H1', nombre: 'Visibilidad del estado del sistema' },
  { id: 'H2', nombre: 'Relación entre el sistema y el mundo real' },
  { id: 'H3', nombre: 'Control y libertad del usuario' },
  { id: 'H4', nombre: 'Consistencia y estándares' },
  { id: 'H5', nombre: 'Prevención de errores' },
  { id: 'H6', nombre: 'Reconocer antes que recordar' },
  { id: 'H7', nombre: 'Flexibilidad y eficiencia de uso' },
  { id: 'H8', nombre: 'Diseño estético y minimalista' },
  { id: 'H9', nombre: 'Ayudar a reconocer, diagnosticar y recuperarse de errores' },
  { id: 'H10', nombre: 'Ayuda y documentación' },
];

const SEVERIDAD = [
  { v: 0, nombre: 'Sin problema', desc: 'No es un problema de usabilidad.' },
  { v: 1, nombre: 'Cosmético', desc: 'Corregir solo si sobra tiempo.' },
  { v: 2, nombre: 'Menor', desc: 'Prioridad baja de corrección.' },
  { v: 3, nombre: 'Mayor', desc: 'Importante corregir; prioridad alta.' },
  { v: 4, nombre: 'Catastrófico', desc: 'Imprescindible corregir antes de publicar.' },
];

/* ===================== ALMACENAMIENTO SEGURO ===================== */
const CLAVE = `registraux.${VERSION}`;
function guardar(k, v) { try { localStorage.setItem(`${CLAVE}.${k}`, JSON.stringify(v)); return true; } catch (e) { return false; } }
function leer(k, def) { try { const t = localStorage.getItem(`${CLAVE}.${k}`); return t ? JSON.parse(t) : def; } catch (e) { return def; } }
function borrar(k) { try { localStorage.removeItem(`${CLAVE}.${k}`); } catch (e) { /* sin almacenamiento */ } }

/* ===================== UTILIDADES ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hoyISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const hora = (iso) => new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const fecha = (iso) => { if (!iso) return ''; const [a, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${a}`; };
const nombreDe = (lista, id) => (lista.find((x) => x.id === id) || {}).nombre || '';
const sevDe = (v) => SEVERIDAD[Number(v)] || SEVERIDAD[0];
const etiquetaSev = (v) => `<span class="sev s${Number(v)}">${Number(v)} ${esc(sevDe(v).nombre)}</span>`;

const params = new URLSearchParams(location.search);

/* ===================== ESTADO ===================== */
const SEMILLA = [
  {
    codigo: 'EV-2026-0131', registrado: '2026-11-03T16:20:00', estado: 'Registrada',
    datos: { proyecto: 'eventos', tipo: 'usabilidad', fecha: '2026-11-03', evaluador: 'E07', tarea: 'Inscribirse a un taller' },
    hallazgos: [
      { heuristica: 'H1', severidad: 3, descripcion: 'Tras pulsar Inscribirme no aparece ningún mensaje y el usuario vuelve a pulsar dos veces.', ubicacion: 'Ficha del taller', recomendacion: 'Mostrar confirmación y deshabilitar el botón mientras procesa.' },
      { heuristica: 'H4', severidad: 1, descripcion: 'Los botones de la ficha usan tres estilos distintos para acciones equivalentes.', ubicacion: 'Ficha del taller', recomendacion: '' },
    ],
  },
  {
    codigo: 'EV-2026-0128', registrado: '2026-10-29T11:05:00', estado: 'Registrada',
    datos: { proyecto: 'kiosco', tipo: 'heuristica', fecha: '2026-10-29', evaluador: 'E07', tarea: 'Pedir un turno de almuerzo' },
    hallazgos: [
      { heuristica: 'H1', severidad: 3, descripcion: 'El kiosco no indica cuántas personas hay antes en la fila de turnos.', ubicacion: 'Pantalla de turno asignado', recomendacion: 'Mostrar la posición y el tiempo estimado.' },
      { heuristica: 'H6', severidad: 2, descripcion: 'El menú del día solo aparece después de elegir el turno, hay que recordarlo.', ubicacion: 'Inicio del kiosco', recomendacion: '' },
      { heuristica: 'H8', severidad: 1, descripcion: 'Exceso de banners publicitarios que compiten con el botón principal.', ubicacion: 'Inicio del kiosco', recomendacion: '' },
    ],
  },
];

const nuevoBorrador = () => ({
  datos: { proyecto: '', tipo: '', fecha: '', evaluador: '', tarea: '' },
  hallazgos: [],
  enCurso: { heuristica: '', severidad: '', descripcion: '', ubicacion: '', recomendacion: '' },
  actualizado: null,
});

const estado = {
  borrador: leer('borrador', null),
  registros: leer('registros', null) || SEMILLA.slice(),
  edicion: null,            // índice del hallazgo que se edita
  eliminado: null,          // { hallazgo, indice } para deshacer
  errores: {},              // errores visibles por formulario
  intentos: 0,              // intentos de envío del borrador actual
  fallo: null,              // 'red' | 'sesion' tras un envío fallido
  enviando: false,
  ultimoRegistro: null,
  listaLista: false,
  participante: params.get('p') || leer('participante', ''),
  modoFallo: params.get('fallo') || leer('modoFallo', 'ninguno'),
};
if (params.get('p')) guardar('participante', estado.participante);
if (params.get('fallo')) guardar('modoFallo', estado.modoFallo);

/* ===================== REGISTRO DE EVENTOS (pruebas) ===================== */
function registrarEvento(tipo, detalle = '') {
  if (!estado.participante) return;
  const log = leer('log', []);
  log.push({ t: Date.now(), p: estado.participante, v: VERSION, tipo, detalle: String(detalle) });
  guardar('log', log.slice(-2000));
}

/* ===================== BORRADOR Y AUTOGUARDADO ===================== */
let temporizadorGuardado = null;
function tieneContenido(b) {
  if (!b) return false;
  return Object.values(b.datos).some((v) => String(v).trim()) || b.hallazgos.length > 0;
}
function guardarBorrador(inmediato = false) {
  if (!estado.borrador) return;
  const indicador = $('#estado-borrador');
  indicador.classList.add('borrador--guardando');
  clearTimeout(temporizadorGuardado);
  const hacer = () => {
    estado.borrador.actualizado = new Date().toISOString();
    guardar('borrador', estado.borrador);
    actualizarIndicador();
  };
  if (inmediato) hacer(); else temporizadorGuardado = setTimeout(hacer, 450);
}
function actualizarIndicador() {
  const indicador = $('#estado-borrador');
  indicador.classList.remove('borrador--guardando');
  const b = estado.borrador;
  indicador.textContent = b && tieneContenido(b) && b.actualizado ? `Borrador guardado a las ${hora(b.actualizado)}` : '';
}
function descartarBorrador() {
  estado.borrador = null; estado.edicion = null; estado.eliminado = null; estado.intentos = 0; estado.fallo = null;
  borrar('borrador');
  actualizarIndicador();
}

/* ===================== VALIDACIONES ===================== */
function validarDatos(d) {
  const e = {};
  if (!d.proyecto) e.proyecto = 'Elige el proyecto que evaluaste.';
  if (!d.tipo) e.tipo = 'Elige el tipo de evaluación.';
  if (!d.fecha) e.fecha = 'Escribe la fecha de la sesión (día/mes/año).';
  else if (d.fecha > hoyISO()) e.fecha = `La fecha no puede ser posterior a hoy (${fecha(hoyISO())}).`;
  const ev = d.evaluador.trim().toUpperCase();
  if (!ev) e.evaluador = 'Escribe tu código de evaluador.';
  else if (!CONFIG.patronEvaluador.test(ev)) e.evaluador = `El código debe tener la letra E y dos dígitos, por ejemplo ${CONFIG.ejemploEvaluador}.`;
  const t = d.tarea.trim();
  if (t.length < CONFIG.tareaMin) e.tarea = `Describe la tarea evaluada con al menos ${CONFIG.tareaMin} caracteres.`;
  else if (t.length > CONFIG.tareaMax) e.tarea = `La tarea admite hasta ${CONFIG.tareaMax} caracteres (llevas ${t.length}).`;
  return e;
}
function validarHallazgo(h) {
  const e = {};
  if (!h.heuristica) e.heuristica = 'Elige la heurística que se incumple.';
  if (h.severidad === '' || h.severidad === null || h.severidad === undefined) e.severidad = 'Elige un nivel de severidad de 0 a 4.';
  const n = h.descripcion.trim().length;
  if (n < CONFIG.descripcionMin) e.descripcion = `Describe el problema con al menos ${CONFIG.descripcionMin} caracteres (llevas ${n}).`;
  else if (n > CONFIG.descripcionMax) e.descripcion = `La descripción admite hasta ${CONFIG.descripcionMax} caracteres (llevas ${n}).`;
  if (!h.ubicacion.trim()) e.ubicacion = 'Indica en qué pantalla o elemento ocurre.';
  return e;
}
const enCursoTieneContenido = (h) => !!(h && (h.heuristica || h.severidad !== '' || h.descripcion.trim() || h.ubicacion.trim() || h.recomendacion.trim()));

/* Muestra errores en línea + resumen con enlaces (H9, WCAG 3.3.1) */
function pintarErrores(form, errores, idResumen) {
  $$('[data-campo]', form).forEach((c) => {
    const nombre = c.dataset.campo;
    const msg = errores[nombre] || '';
    const salida = $(`#${nombre}-error`, form);
    if (salida) salida.textContent = msg;
    $$(`[name="${nombre}"]`, form).forEach((ctrl) => ctrl.setAttribute('aria-invalid', msg ? 'true' : 'false'));
    const escala = $(`[data-escala="${nombre}"]`, form);
    if (escala) escala.setAttribute('aria-invalid', msg ? 'true' : 'false');
  });
  const resumen = $(`#${idResumen}`);
  if (!resumen) return;
  const claves = Object.keys(errores);
  if (!claves.length) { resumen.hidden = true; resumen.innerHTML = ''; return; }
  resumen.hidden = false;
  resumen.innerHTML = `<h2>Revisa ${claves.length === 1 ? 'un dato' : `${claves.length} datos`} antes de continuar</h2>
    <ul>${claves.map((k) => `<li><a href="#${k}-control" data-enfocar="${k}">${esc(errores[k])}</a></li>`).join('')}</ul>`;
}
function enfocarCampo(nombre) {
  const ctrl = $(`[name="${nombre}"]:checked`) || $(`[name="${nombre}"]`);
  if (ctrl) { ctrl.focus(); ctrl.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}

/* ===================== DIÁLOGO Y AVISOS ===================== */
function confirmar({ titulo, texto, botones }) {
  return new Promise((resolver) => {
    const dlg = $('#dialogo');
    $('#dialogo-titulo').textContent = titulo;
    $('#dialogo-texto').textContent = texto;
    const cont = $('#dialogo-acciones');
    cont.innerHTML = botones.map((b, i) => `<button type="button" class="btn ${b.clase || 'btn--secundario'}" data-i="${i}">${esc(b.texto)}</button>`).join('');
    const cerrar = (valor) => { dlg.close(); resolver(valor); };
    $$('button', cont).forEach((btn) => btn.addEventListener('click', () => cerrar(botones[btn.dataset.i].valor)));
    dlg.addEventListener('cancel', (ev) => { ev.preventDefault(); cerrar('cancelar'); }, { once: true });
    dlg.showModal();
    const foco = botones.findIndex((b) => b.foco);
    $$('button', cont)[foco >= 0 ? foco : 0].focus();
  });
}
let temporizadorAviso = null;
function avisar(texto) {
  const a = $('#aviso');
  a.hidden = false; a.textContent = ''; a.dataset.t = String(Date.now());
  requestAnimationFrame(() => { a.textContent = texto; });
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { a.hidden = true; }, 4200);
}

/* ===================== COMPONENTES REUTILIZABLES ===================== */
function pasos(actual) {
  const nombres = ['Datos generales', 'Hallazgos', 'Revisión y envío'];
  return `<ol class="pasos" aria-label="Pasos del registro">${nombres.map((n, i) => {
    const num = i + 1;
    const cls = num < actual ? 'hecho' : '';
    const cur = num === actual ? ' aria-current="step"' : '';
    const extra = num < actual ? '<span class="solo-lector"> (completado)</span>' : num === actual ? '<span class="solo-lector"> (paso actual)</span>' : '';
    return `<li class="${cls}"${cur}><span class="pasos__n" aria-hidden="true">${num}</span>${n}${extra}</li>`;
  }).join('')}</ol>`;
}
function filaHallazgoLectura(h, i) {
  return `<li class="hallazgo">
    ${etiquetaSev(h.severidad)}
    <div class="hallazgo__texto">
      <p><strong>${esc(h.heuristica)} ${esc(nombreDe(HEURISTICAS, h.heuristica))}</strong></p>
      <p>${esc(h.descripcion)}</p>
      <p class="hallazgo__lugar">Dónde: ${esc(h.ubicacion)}${h.recomendacion ? ` · Recomendación: ${esc(h.recomendacion)}` : ''}</p>
    </div>
    <span class="solo-lector">Hallazgo ${i + 1}</span>
  </li>`;
}
function fichaDatos(d) {
  return `<dl class="ficha">
    <dt>Proyecto evaluado</dt><dd>${esc(nombreDe(PROYECTOS, d.proyecto))}</dd>
    <dt>Tipo de evaluación</dt><dd>${esc(nombreDe(TIPOS, d.tipo))}</dd>
    <dt>Fecha de la sesión</dt><dd>${fecha(d.fecha)}</dd>
    <dt>Código del evaluador</dt><dd>${esc(d.evaluador.toUpperCase())}</dd>
    <dt>Tarea o pantalla</dt><dd>${esc(d.tarea)}</dd>
  </dl>`;
}

/* ===================== PANTALLAS ===================== */

/* S1 · Inicio */
function pantallaInicio() {
  const b = estado.borrador;
  const conBorrador = b && tieneContenido(b);
  const recientes = estado.registros.slice(0, 3);
  return {
    titulo: 'Inicio',
    html: `<div class="columna">
      <div class="encabezado">
        <h1 tabindex="-1">Hola, ${esc(CONFIG.usuaria)}</h1>
        <p>Registra los resultados de tus evaluaciones UX para que el docente los revise.
        <span class="cierre">Cierre de registros: hoy ${esc(CONFIG.cierreRegistro)}</span></p>
      </div>
      ${conBorrador ? `<div class="alerta alerta--aviso" role="region" aria-labelledby="h-borrador">
        <h2 id="h-borrador">Tienes una evaluación sin enviar</h2>
        <p>${esc(nombreDe(PROYECTOS, b.datos.proyecto) || 'Proyecto sin elegir')} · ${b.hallazgos.length} ${b.hallazgos.length === 1 ? 'hallazgo' : 'hallazgos'} · guardada a las ${hora(b.actualizado)}</p>
        <div class="acciones"><a class="btn btn--primario btn--chico" href="#/registrar/datos">Continuar borrador</a>
        <button type="button" class="btn btn--terciario btn--chico" id="btn-descartar">Descartar borrador</button></div>
      </div>` : ''}
      <section class="inicio-accion" aria-labelledby="h-registrar">
        <h2 id="h-registrar">Registrar una evaluación</h2>
        <p>Datos de la sesión, hallazgos con su severidad y revisión antes de enviar.</p>
        <a class="btn btn--primario" href="#/registrar/datos" id="btn-registrar">${conBorrador ? 'Continuar evaluación' : 'Registrar evaluación'}</a>
      </section>
      <section aria-labelledby="h-recientes">
        <div class="titulo-seccion"><h2 id="h-recientes">Últimas evaluaciones registradas</h2><a href="#/evaluaciones">Ver todas</a></div>
        ${tablaRegistros(recientes)}
      </section>
    </div>`,
    montar() {
      const btn = $('#btn-descartar');
      if (btn) btn.addEventListener('click', async () => {
        const r = await confirmar({ titulo: '¿Descartar el borrador?', texto: 'Se borrarán los datos y hallazgos que no enviaste. Esta acción no se puede deshacer.',
          botones: [{ texto: 'Conservar borrador', valor: 'no', clase: 'btn--secundario', foco: true }, { texto: 'Descartar borrador', valor: 'si', clase: 'btn--peligro' }] });
        if (r === 'si') { descartarBorrador(); registrarEvento('borrador_descartado'); avisar('Borrador descartado.'); render(); }
      });
    },
  };
}

function tablaRegistros(lista, conBorrador = false) {
  const b = estado.borrador;
  const filas = [];
  if (conBorrador && b && tieneContenido(b)) {
    filas.push(`<tr><td>—</td><td>${esc(nombreDe(PROYECTOS, b.datos.proyecto) || 'Sin proyecto')}</td><td>${esc(nombreDe(TIPOS, b.datos.tipo))}</td><td>${fecha(b.datos.fecha)}</td><td class="num">${b.hallazgos.length}</td>
      <td><span class="estado-chip estado-chip--borrador">Borrador</span> <a href="#/registrar/datos">Continuar</a></td></tr>`);
  }
  lista.forEach((r) => {
    filas.push(`<tr><td><a href="#/evaluaciones/${encodeURIComponent(r.codigo)}">${esc(r.codigo)}</a></td><td>${esc(nombreDe(PROYECTOS, r.datos.proyecto))}</td>
      <td>${esc(nombreDe(TIPOS, r.datos.tipo))}</td><td>${fecha(r.datos.fecha)}</td><td class="num">${r.hallazgos.length}</td>
      <td><span class="estado-chip estado-chip--ok">${esc(r.estado)}</span></td></tr>`);
  });
  if (!filas.length) return '<p class="vacio">Todavía no registras evaluaciones. Empieza con “Registrar evaluación”.</p>';
  return `<div class="tabla-envoltura"><table>
    <caption class="solo-lector">Evaluaciones registradas</caption>
    <thead><tr><th scope="col">Código</th><th scope="col">Proyecto</th><th scope="col">Tipo</th><th scope="col">Fecha</th><th scope="col" class="num">Hallazgos</th><th scope="col">Estado</th></tr></thead>
    <tbody>${filas.join('')}</tbody></table></div>`;
}

/* S2 · Paso 1: datos generales */
function pantallaDatos() {
  if (!estado.borrador) { estado.borrador = nuevoBorrador(); }
  const d = estado.borrador.datos;
  const err = estado.errores.datos || {};
  const opt = (lista, sel) => lista.map((x) => `<option value="${x.id}"${x.id === sel ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('');
  return {
    titulo: 'Paso 1: datos generales',
    html: `<div class="columna">
      <div class="encabezado"><h1 tabindex="-1">Registrar evaluación</h1><p>Los datos se guardan solos mientras escribes.</p></div>
      ${pasos(1)}
      <div class="alerta alerta--error" id="resumen-datos" tabindex="-1" role="alert" hidden></div>
      <form id="form-datos" class="tarjeta" novalidate>
        <div class="campo" data-campo="proyecto">
          <label for="proyecto-control">Proyecto evaluado</label>
          <select id="proyecto-control" name="proyecto" aria-describedby="proyecto-error">
            <option value="">Elige un proyecto</option>${opt(PROYECTOS, d.proyecto)}
          </select>
          <p class="campo__error" id="proyecto-error"></p>
        </div>
        <fieldset class="campo" data-campo="tipo" aria-describedby="tipo-error">
          <legend>Tipo de evaluación</legend>
          <div class="opciones">${TIPOS.map((t, i) => `<label class="opcion"><input type="radio" name="tipo" value="${t.id}" ${i === 0 ? 'id="tipo-control"' : ''}${t.id === d.tipo ? ' checked' : ''}> ${esc(t.nombre)}</label>`).join('')}</div>
          <p class="campo__error" id="tipo-error"></p>
        </fieldset>
        <div class="campo" data-campo="fecha">
          <label for="fecha-control">Fecha de la sesión</label>
          <input type="date" id="fecha-control" name="fecha" max="${hoyISO()}" value="${esc(d.fecha)}" aria-describedby="fecha-error">
          <p class="campo__error" id="fecha-error"></p>
        </div>
        <div class="campo" data-campo="evaluador">
          <label for="evaluador-control">Código del evaluador</label>
          <span class="ayuda" id="evaluador-ayuda">Letra E y dos dígitos, por ejemplo ${CONFIG.ejemploEvaluador}. No escribas tu nombre.</span>
          <input type="text" class="corto" id="evaluador-control" name="evaluador" value="${esc(d.evaluador)}" autocomplete="off" spellcheck="false" aria-describedby="evaluador-ayuda evaluador-error">
          <p class="campo__error" id="evaluador-error"></p>
        </div>
        <div class="campo" data-campo="tarea">
          <label for="tarea-control">Tarea o pantalla evaluada</label>
          <span class="ayuda" id="tarea-ayuda">Por ejemplo: “Reservar un libro desde el catálogo”.</span>
          <input type="text" id="tarea-control" name="tarea" value="${esc(d.tarea)}" maxlength="${CONFIG.tareaMax + 20}" aria-describedby="tarea-ayuda tarea-error">
          <p class="campo__error" id="tarea-error"></p>
        </div>
        <div class="acciones">
          <a class="btn btn--terciario separa" href="#/inicio" id="btn-cancelar">Guardar y salir</a>
          <button type="submit" class="btn btn--primario">Siguiente: hallazgos</button>
        </div>
      </form>
    </div>`,
    montar() {
      const form = $('#form-datos');
      const tocados = new Set();
      if (Object.keys(err).length) pintarErrores(form, err, 'resumen-datos');
      form.addEventListener('input', (ev) => {
        const t = ev.target; if (!t.name) return;
        estado.borrador.datos[t.name] = t.value;
        guardarBorrador();
        if (tocados.has(t.name)) validarUno(t.name);
      });
      form.addEventListener('change', (ev) => { const t = ev.target; if (!t.name) return; estado.borrador.datos[t.name] = t.value; guardarBorrador(); tocados.add(t.name); validarUno(t.name); });
      form.addEventListener('focusout', (ev) => {
        const t = ev.target; if (!t.name || t.type === 'radio') return;
        if (t.value.trim()) { tocados.add(t.name); validarUno(t.name); }
      });
      function validarUno(nombre) {
        const e = validarDatos(estado.borrador.datos);
        const actuales = Object.assign({}, estado.errores.datos || {});
        if (e[nombre]) actuales[nombre] = e[nombre]; else delete actuales[nombre];
        estado.errores.datos = actuales;
        const salida = $(`#${nombre}-error`); if (salida) salida.textContent = actuales[nombre] || '';
        $$(`[name="${nombre}"]`, form).forEach((c) => c.setAttribute('aria-invalid', actuales[nombre] ? 'true' : 'false'));
        if ($('#resumen-datos').hidden === false) pintarErrores(form, actuales, 'resumen-datos');
      }
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        estado.borrador.datos.evaluador = estado.borrador.datos.evaluador.trim().toUpperCase();
        const e = validarDatos(estado.borrador.datos);
        estado.errores.datos = e;
        guardarBorrador(true);
        if (Object.keys(e).length) {
          pintarErrores(form, e, 'resumen-datos');
          registrarEvento('error_validacion', `datos:${Object.keys(e).join('|')}`);
          $('#resumen-datos').focus();
          return;
        }
        estado.errores.datos = {};
        navegar('/registrar/hallazgos');
      });
      $('#btn-cancelar').addEventListener('click', () => { guardarBorrador(true); if (tieneContenido(estado.borrador)) avisar('Tu borrador quedó guardado. Puedes continuarlo desde el inicio.'); });
    },
  };
}

/* S3 · Paso 2: hallazgos */
function controlSeveridad(valor) {
  return `<div class="escala" data-escala="severidad">
    ${SEVERIDAD.map((s) => `<label class="s${s.v}" title="${esc(s.nombre)}">
      <input type="radio" name="severidad" value="${s.v}" ${s.v === 0 ? 'id="severidad-control"' : ''} aria-label="Severidad ${s.v}"${String(valor) === String(s.v) ? ' checked' : ''}>
      <span class="n" aria-hidden="true">${s.v}</span>
    </label>`).join('')}
  </div>`;
}
function textoAyudaSeveridad() {
  return 'Escala de Nielsen de 0 a 4. <a href="#/ayuda">¿Qué significa cada nivel?</a>';
}

function pantallaHallazgos() {
  const b = estado.borrador;
  if (!b || Object.keys(validarDatos(b.datos)).length) { return { redirigir: '/registrar/datos' }; }
  const h = b.enCurso;
  const err = estado.errores.hallazgo || {};
  const editando = estado.edicion !== null;
  const lleno = b.hallazgos.length >= CONFIG.maxHallazgos && !editando;
  const items = b.hallazgos.map((x, i) => `<li class="hallazgo" id="hallazgo-${i}">
      ${etiquetaSev(x.severidad)}
      <div class="hallazgo__texto">
        <p><strong>${esc(x.heuristica)} ${esc(nombreDe(HEURISTICAS, x.heuristica))}</strong></p>
        <p>${esc(x.descripcion)}</p>
        <p class="hallazgo__lugar">Dónde: ${esc(x.ubicacion)}</p>
      </div>
      <div class="hallazgo__acciones">
        <button type="button" class="btn btn--secundario btn--chico" data-editar="${i}" aria-label="Editar hallazgo ${i + 1}">Editar</button>
        <button type="button" class="btn btn--terciario btn--chico" data-eliminar="${i}" aria-label="Eliminar hallazgo ${i + 1}">Eliminar</button>
      </div>
    </li>`);
  if (estado.eliminado) {
    const { hallazgo: x, indice } = estado.eliminado;
    items.splice(Math.min(indice, items.length), 0, `<li class="hallazgo hallazgo--eliminado"><p style="margin:0">Hallazgo eliminado: ${esc(x.heuristica)}, severidad ${x.severidad}.</p>
      <button type="button" class="btn btn--secundario btn--chico" id="btn-deshacer">Deshacer</button></li>`);
  }
  return {
    titulo: 'Paso 2: hallazgos',
    html: `<div class="columna">
      <div class="encabezado"><h1 tabindex="-1">Registrar evaluación</h1><p>${esc(nombreDe(PROYECTOS, b.datos.proyecto))} · ${esc(b.datos.tarea)}</p></div>
      ${pasos(2)}
      <div class="alerta alerta--error" id="resumen-hallazgo" tabindex="-1" role="alert" hidden></div>
      <section aria-labelledby="h-lista">
        <div class="titulo-seccion"><h2 id="h-lista" tabindex="-1">Hallazgos agregados</h2><span class="cuenta">${b.hallazgos.length} de ${CONFIG.maxHallazgos} como máximo</span></div>
        ${items.length ? `<ol class="hallazgos">${items.join('')}</ol>` : '<p class="vacio">Aún no agregas hallazgos. Completa el formulario y pulsa “Agregar hallazgo”.</p>'}
      </section>
      <form id="form-hallazgo" class="tarjeta" novalidate aria-labelledby="h-form">
        <h2 id="h-form">${editando ? `Editar hallazgo ${estado.edicion + 1}` : 'Nuevo hallazgo'}</h2>
        ${lleno ? `<p class="alerta alerta--aviso">Llegaste al máximo de ${CONFIG.maxHallazgos} hallazgos. Edita o elimina uno para agregar otro.</p>` : ''}
        <div class="campo" data-campo="heuristica">
          <label for="heuristica-control">Heurística que se incumple</label>
          <select id="heuristica-control" name="heuristica" aria-describedby="heuristica-error"${lleno ? ' disabled' : ''}>
            <option value="">Elige una heurística</option>
            ${HEURISTICAS.map((x) => `<option value="${x.id}"${x.id === h.heuristica ? ' selected' : ''}>${x.id} · ${esc(x.nombre)}</option>`).join('')}
          </select>
          <p class="campo__error" id="heuristica-error"></p>
        </div>
        <fieldset class="campo" data-campo="severidad" aria-describedby="severidad-ayuda severidad-error"${lleno ? ' disabled' : ''}>
          <legend>Severidad</legend>
          <span class="ayuda" id="severidad-ayuda">${textoAyudaSeveridad()}</span>
          ${controlSeveridad(h.severidad)}
          <p class="escala-desc" id="severidad-desc" aria-live="polite">${h.severidad !== '' ? esc(descripcionSeveridad(h.severidad)) : ''}</p>
          <p class="campo__error" id="severidad-error"></p>
        </fieldset>
        <div class="campo" data-campo="descripcion">
          <label for="descripcion-control">Descripción del problema</label>
          <span class="ayuda" id="descripcion-ayuda">Qué ocurrió y cómo afecta al usuario. Entre ${CONFIG.descripcionMin} y ${CONFIG.descripcionMax} caracteres.</span>
          <textarea id="descripcion-control" name="descripcion" aria-describedby="descripcion-ayuda descripcion-error"${lleno ? ' disabled' : ''}>${esc(h.descripcion)}</textarea>
          <div class="contador" id="descripcion-contador" aria-hidden="true">${h.descripcion.length}/${CONFIG.descripcionMax}</div>
          <p class="campo__error" id="descripcion-error"></p>
        </div>
        <div class="campo" data-campo="ubicacion">
          <label for="ubicacion-control">Dónde ocurre</label>
          <span class="ayuda" id="ubicacion-ayuda">Pantalla o elemento. Por ejemplo: “Botón Reservar de la ficha del libro”.</span>
          <input type="text" id="ubicacion-control" name="ubicacion" value="${esc(h.ubicacion)}" aria-describedby="ubicacion-ayuda ubicacion-error"${lleno ? ' disabled' : ''}>
          <p class="campo__error" id="ubicacion-error"></p>
        </div>
        <div class="campo" data-campo="recomendacion">
          <label for="recomendacion-control">Recomendación <span class="opcional">(opcional)</span></label>
          <textarea id="recomendacion-control" name="recomendacion" rows="2"${lleno ? ' disabled' : ''}>${esc(h.recomendacion)}</textarea>
        </div>
        <div class="acciones">
          <button type="submit" class="btn btn--secundario"${lleno ? ' disabled' : ''}>${editando ? 'Guardar cambios' : 'Agregar hallazgo'}</button>
          ${editando ? '<button type="button" class="btn btn--terciario" id="btn-cancelar-edicion">Cancelar edición</button>' : ''}
        </div>
      </form>
      <div class="acciones">
        <a class="btn btn--secundario separa" href="#/registrar/datos">Anterior</a>
        <button type="button" class="btn btn--primario" id="btn-siguiente">Siguiente: revisar</button>
      </div>
    </div>`,
    montar() {
      const form = $('#form-hallazgo');
      if (Object.keys(err).length) pintarErrores(form, err, 'resumen-hallazgo');
      const contador = $('#descripcion-contador');
      form.addEventListener('input', (ev) => {
        const t = ev.target; if (!t.name) return;
        b.enCurso[t.name] = t.value;
        if (t.name === 'descripcion') {
          const n = t.value.trim().length;
          contador.textContent = `${t.value.length}/${CONFIG.descripcionMax}`;
          contador.classList.toggle('contador--mal', n > CONFIG.descripcionMax);
        }
        if (t.name === 'severidad') $('#severidad-desc').textContent = descripcionSeveridad(t.value);
        guardarBorrador();
      });
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const e = validarHallazgo(b.enCurso);
        estado.errores.hallazgo = e;
        if (Object.keys(e).length) {
          pintarErrores(form, e, 'resumen-hallazgo');
          registrarEvento('error_validacion', `hallazgo:${Object.keys(e).join('|')}`);
          $('#resumen-hallazgo').focus();
          return;
        }
        const nuevo = { ...b.enCurso, severidad: Number(b.enCurso.severidad), descripcion: b.enCurso.descripcion.trim(), ubicacion: b.enCurso.ubicacion.trim(), recomendacion: b.enCurso.recomendacion.trim() };
        let msg;
        if (estado.edicion !== null) { b.hallazgos[estado.edicion] = nuevo; msg = `Hallazgo ${estado.edicion + 1} actualizado.`; registrarEvento('hallazgo_editado', estado.edicion + 1); }
        else { b.hallazgos.push(nuevo); msg = `Hallazgo ${b.hallazgos.length} agregado.`; registrarEvento('hallazgo_agregado', b.hallazgos.length); }
        b.enCurso = nuevoBorrador().enCurso;
        estado.edicion = null; estado.eliminado = null; estado.errores.hallazgo = {};
        guardarBorrador(true);
        render({ foco: '#heuristica-control' });
        avisar(msg);
      });
      $$('[data-editar]').forEach((btn) => btn.addEventListener('click', () => {
        const i = Number(btn.dataset.editar);
        estado.edicion = i; estado.eliminado = null; estado.errores.hallazgo = {};
        b.enCurso = { ...b.hallazgos[i], severidad: String(b.hallazgos[i].severidad) };
        guardarBorrador();
        render({ foco: '#heuristica-control' });
      }));
      $$('[data-eliminar]').forEach((btn) => btn.addEventListener('click', async () => {
        const i = Number(btn.dataset.eliminar);
        const x = b.hallazgos[i];
        const r = await confirmar({ titulo: `¿Eliminar el hallazgo ${i + 1}?`, texto: `${x.heuristica}, severidad ${x.severidad}: “${x.descripcion.slice(0, 70)}${x.descripcion.length > 70 ? '…' : ''}”`,
          botones: [{ texto: 'Cancelar', valor: 'no', clase: 'btn--secundario', foco: true }, { texto: 'Eliminar hallazgo', valor: 'si', clase: 'btn--peligro' }] });
        if (r !== 'si') { btn.focus(); return; }
        b.hallazgos.splice(i, 1);
        estado.eliminado = { hallazgo: x, indice: i };
        if (estado.edicion === i) { estado.edicion = null; b.enCurso = nuevoBorrador().enCurso; }
        else if (estado.edicion !== null && estado.edicion > i) estado.edicion -= 1;
        registrarEvento('hallazgo_eliminado', i + 1);
        guardarBorrador(true);
        render({ foco: '#btn-deshacer' });
      }));
      const deshacer = $('#btn-deshacer');
      if (deshacer) deshacer.addEventListener('click', () => {
        const { hallazgo, indice } = estado.eliminado;
        b.hallazgos.splice(indice, 0, hallazgo);
        estado.eliminado = null;
        registrarEvento('deshacer_eliminar', indice + 1);
        guardarBorrador(true);
        render({ foco: '#h-lista' });
        avisar('Hallazgo recuperado.');
      });
      const cancelarEd = $('#btn-cancelar-edicion');
      if (cancelarEd) cancelarEd.addEventListener('click', () => {
        const i = estado.edicion;
        estado.edicion = null; b.enCurso = nuevoBorrador().enCurso; estado.errores.hallazgo = {};
        guardarBorrador(); render({ foco: `[data-editar="${i}"]` });
      });
      $('#btn-siguiente').addEventListener('click', () => alSiguiente(form));
    },
  };
}
function descripcionSeveridad(v) { const s = sevDe(v); return `${s.v} · ${s.nombre}: ${s.desc}`; }

/* Comportamiento de "Siguiente" en v1:
 * si no hay hallazgos, muestra error; si hay hallazgos, lo escrito en el formulario
 * sin pulsar "Agregar hallazgo" se descarta sin avisar. (Hipótesis de problema H-01) */
async function alSiguiente(form) {
  const b = estado.borrador;
  if (!b.hallazgos.length) {
    const e = { lista: 'Agrega al menos un hallazgo antes de continuar.' };
    const resumen = $('#resumen-hallazgo');
    resumen.hidden = false;
    resumen.innerHTML = `<h2>No puedes continuar todavía</h2><p>${e.lista}</p>`;
    registrarEvento('error_validacion', 'hallazgos:lista_vacia');
    resumen.focus();
    return;
  }
  if (enCursoTieneContenido(b.enCurso)) registrarEvento('hallazgo_descartado', 'formulario con datos sin agregar');
  b.enCurso = nuevoBorrador().enCurso;
  estado.edicion = null; estado.eliminado = null; estado.errores.hallazgo = {};
  guardarBorrador(true);
  navegar('/registrar/revision');
}

/* S4 · Paso 3: revisión */
function pantallaRevision() {
  const b = estado.borrador;
  if (!b || Object.keys(validarDatos(b.datos)).length) return { redirigir: '/registrar/datos' };
  if (!b.hallazgos.length) return { redirigir: '/registrar/hallazgos' };
  const maxSev = Math.max(...b.hallazgos.map((h) => h.severidad));
  return {
    titulo: 'Paso 3: revisión y envío',
    html: `<div class="columna">
      <div class="encabezado"><h1 tabindex="-1">Revisa antes de enviar</h1><p>Después de enviar, la evaluación queda registrada y ya no podrás modificarla.</p></div>
      ${pasos(3)}
      <section class="bloque tarjeta" aria-labelledby="h-rev-datos">
        <div class="bloque__cab"><h2 id="h-rev-datos">Datos generales</h2><a href="#/registrar/datos">Editar datos</a></div>
        ${fichaDatos(b.datos)}
      </section>
      <section class="bloque" aria-labelledby="h-rev-hall">
        <div class="bloque__cab"><h2 id="h-rev-hall">${b.hallazgos.length} ${b.hallazgos.length === 1 ? 'hallazgo' : 'hallazgos'} · severidad máxima ${maxSev}</h2><a href="#/registrar/hallazgos">Editar hallazgos</a></div>
        <ol class="hallazgos">${b.hallazgos.map(filaHallazgoLectura).join('')}</ol>
      </section>
      <div class="acciones">
        <a class="btn btn--secundario separa" href="#/registrar/hallazgos">Anterior</a>
        <button type="button" class="btn btn--primario" id="btn-enviar">Enviar evaluación</button>
      </div>
    </div>`,
    montar() { $('#btn-enviar').addEventListener('click', enviar); },
  };
}

/* S5 · Enviando (estado de carga) */
function enviar() {
  if (estado.enviando) return;
  estado.enviando = true;
  registrarEvento('envio_intento', estado.intentos + 1);
  navegar('/enviando');
  setTimeout(resolverEnvio, CONFIG.demoraEnvioMs);
}
function resolverEnvio() {
  estado.enviando = false;
  estado.intentos += 1;
  const m = estado.modoFallo;
  let fallo = null;
  if (m === 'siempre') fallo = 'red';
  else if (m === 'una' && estado.intentos === 1) fallo = 'red';
  else if (m === 'sesion' && estado.intentos === 1) fallo = 'sesion';
  if (fallo) {
    estado.fallo = fallo;
    registrarEvento('envio_fallido', fallo);
    location.replace('#/error-envio');
    return;
  }
  const b = estado.borrador;
  const siguiente = 1 + Math.max(0, ...estado.registros.map((r) => Number(r.codigo.slice(-4)) || 0));
  const registro = { codigo: CONFIG.prefijoCodigo + String(siguiente).padStart(4, '0'), registrado: new Date().toISOString(), estado: 'Registrada',
    datos: { ...b.datos }, hallazgos: b.hallazgos.map((h) => ({ ...h })) };
  estado.registros.unshift(registro);
  guardar('registros', estado.registros);
  estado.ultimoRegistro = registro.codigo;
  registrarEvento('envio_exitoso', registro.codigo);
  descartarBorrador();
  location.replace('#/exito');
}
function pantallaEnviando() {
  if (!estado.enviando) return { redirigir: estado.borrador ? '/registrar/revision' : '/inicio' };
  return {
    titulo: 'Enviando evaluación',
    html: `<div class="columna">
      <h1 tabindex="-1">Enviando evaluación</h1>
      <div class="carga" role="status" aria-live="polite" aria-busy="true">
        <div class="giro" aria-hidden="true"></div>
        <div><p style="margin:0"><strong>Enviando tu evaluación al servidor…</strong></p>
        <p style="margin:0">No cierres esta ventana.</p>
        <div class="barra-progreso" aria-hidden="true" style="--dur:${CONFIG.demoraEnvioMs}ms"><span></span></div></div>
      </div>
    </div>`,
  };
}

/* S6 · Error de envío y recuperación */
function pantallaErrorEnvio() {
  if (!estado.fallo || !estado.borrador) return { redirigir: '/inicio' };
  const sesion = estado.fallo === 'sesion';
  return {
    titulo: 'No se pudo enviar',
    html: `<div class="columna">
      <h1 tabindex="-1">No se pudo enviar la evaluación</h1>
      <div class="alerta alerta--error" role="alert">
        <p>${sesion ? 'Tu sesión expiró (SES-15). Vuelve a ingresar para continuar.' : 'Error de conexión (NET-01). Inténtalo de nuevo.'}</p>
      </div>
      <div class="acciones">
        <button type="button" class="btn btn--primario" id="btn-reintentar">${sesion ? 'Volver a ingresar' : 'Reintentar'}</button>
        <a class="btn btn--secundario" href="#/registrar/revision">Volver a la revisión</a>
      </div>
    </div>`,
    montar() {
      $('#btn-reintentar').addEventListener('click', () => {
        registrarEvento('reintento', estado.fallo);
        if (sesion) { estado.fallo = null; avisar('Ingresaste nuevamente.'); navegar('/registrar/revision'); return; }
        estado.fallo = null; enviar();
      });
    },
  };
}

/* S7 · Éxito */
function pantallaExito() {
  const r = estado.registros.find((x) => x.codigo === estado.ultimoRegistro);
  if (!r) return { redirigir: '/inicio' };
  const maxSev = Math.max(...r.hallazgos.map((h) => h.severidad));
  return {
    titulo: 'Evaluación registrada',
    html: `<div class="columna">
      <div class="exito" role="status">
        <svg class="exito__icono" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="25"/><path d="M17 29l7 7 15-16"/></svg>
        <h1 tabindex="-1">Evaluación registrada</h1>
        <p>Código de registro: <strong class="codigo">${esc(r.codigo)}</strong></p>
        <p>Se registró el ${fecha(r.registrado)} a las ${hora(r.registrado)}.</p>
        <dl class="ficha">
          <dt>Proyecto</dt><dd>${esc(nombreDe(PROYECTOS, r.datos.proyecto))}</dd>
          <dt>Hallazgos</dt><dd>${r.hallazgos.length} (severidad máxima ${maxSev})</dd>
        </dl>
        <div class="acciones">
          <a class="btn btn--primario" href="#/evaluaciones/${encodeURIComponent(r.codigo)}">Ver registro</a>
          <a class="btn btn--secundario" href="#/registrar/datos" id="btn-otra">Registrar otra evaluación</a>
          <a class="btn btn--terciario" href="#/inicio">Volver al inicio</a>
        </div>
      </div>
    </div>`,
  };
}

/* S8 · Mis evaluaciones (con estado de carga) y detalle */
function pantallaEvaluaciones() {
  return {
    titulo: 'Mis evaluaciones',
    html: `<div class="columna">
      <div class="encabezado"><h1 tabindex="-1">Mis evaluaciones</h1><p>Evaluaciones enviadas y borradores pendientes.</p></div>
      <div id="contenedor-lista" aria-busy="${estado.listaLista ? 'false' : 'true'}" aria-live="polite">
        ${estado.listaLista ? tablaRegistros(estado.registros, true) : '<p class="solo-lector">Cargando evaluaciones…</p><div class="esqueleto"></div><div class="esqueleto" style="width:80%"></div><div class="esqueleto" style="width:60%"></div>'}
      </div>
      <div class="acciones"><a class="btn btn--primario" href="#/registrar/datos">Registrar evaluación</a></div>
    </div>`,
    montar() {
      if (estado.listaLista) return;
      setTimeout(() => {
        if (ruta() !== '/evaluaciones') return;
        estado.listaLista = true;
        const c = $('#contenedor-lista');
        c.setAttribute('aria-busy', 'false');
        c.innerHTML = tablaRegistros(estado.registros, true);
      }, CONFIG.demoraListaMs);
    },
  };
}
function pantallaDetalle(codigo) {
  const r = estado.registros.find((x) => x.codigo === codigo);
  if (!r) return { titulo: 'Registro no encontrado', html: `<div class="columna"><h1 tabindex="-1">No encontramos ese registro</h1><p>Revisa el código o vuelve a la lista.</p><a class="btn btn--secundario" href="#/evaluaciones">Ir a Mis evaluaciones</a></div>` };
  return {
    titulo: `Registro ${r.codigo}`,
    html: `<div class="columna">
      <p><a href="#/evaluaciones">Mis evaluaciones</a> / ${esc(r.codigo)}</p>
      <div class="encabezado"><h1 tabindex="-1">Registro ${esc(r.codigo)}</h1><p><span class="estado-chip estado-chip--ok">${esc(r.estado)}</span> el ${fecha(r.registrado)} a las ${hora(r.registrado)}</p></div>
      <section class="bloque tarjeta" aria-labelledby="h-det-datos"><div class="bloque__cab"><h2 id="h-det-datos">Datos generales</h2></div>${fichaDatos(r.datos)}</section>
      <section class="bloque" aria-labelledby="h-det-hall"><div class="bloque__cab"><h2 id="h-det-hall">Hallazgos (${r.hallazgos.length})</h2></div>
        <ol class="hallazgos">${r.hallazgos.map(filaHallazgoLectura).join('')}</ol></section>
      <a class="btn btn--secundario" href="#/evaluaciones">Volver a Mis evaluaciones</a>
    </div>`,
  };
}

/* S9 · Ayuda */
function pantallaAyuda() {
  return {
    titulo: 'Ayuda',
    html: `<div class="columna">
      <div class="encabezado"><h1 tabindex="-1">Ayuda</h1><p>Escala de severidad, heurísticas y uso con teclado.</p></div>
      <section class="bloque" aria-labelledby="h-ay-sev"><div class="bloque__cab"><h2 id="h-ay-sev">Escala de severidad (Nielsen)</h2></div>
        <div class="tabla-envoltura"><table><thead><tr><th scope="col">Nivel</th><th scope="col">Significado</th></tr></thead>
        <tbody>${SEVERIDAD.map((s) => `<tr><td>${etiquetaSev(s.v)}</td><td>${esc(s.desc)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="bloque" aria-labelledby="h-ay-heu"><div class="bloque__cab"><h2 id="h-ay-heu">Heurísticas de Nielsen</h2></div>
        <ol>${HEURISTICAS.map((x) => `<li><strong>${x.id}</strong> ${esc(x.nombre)}</li>`).join('')}</ol></section>
      <section class="bloque" aria-labelledby="h-ay-tec"><div class="bloque__cab"><h2 id="h-ay-tec">Uso con teclado</h2></div>
        <ul><li><kbd>Tab</kbd> avanza y <kbd>Mayús</kbd>+<kbd>Tab</kbd> retrocede.</li>
        <li>En la escala de severidad, usa las flechas para cambiar de nivel.</li>
        <li><kbd>Enter</kbd> envía el formulario activo y <kbd>Esc</kbd> cierra los diálogos.</li></ul></section>
      ${estado.borrador && tieneContenido(estado.borrador) ? '<a class="btn btn--primario" href="#/registrar/hallazgos">Volver a mi borrador</a>' : ''}
    </div>`,
  };
}

/* Panel del observador: no forma parte del recorrido del participante */
function resumenSesion(p) {
  const todos = leer('log', []).filter((e) => e.p === p);
  let ini = -1; todos.forEach((e, i) => { if (e.tipo === 'sesion_inicio') ini = i; });
  if (ini < 0) return null;
  const s = todos.slice(ini);
  const t0 = s[0].t;
  const busca = (desde, f) => s.find((e) => e.t >= desde && f(e));
  const f1 = busca(t0, (e) => e.tipo === 'pantalla' && e.detalle === '/registrar/datos');
  const f2 = f1 && busca(f1.t, (e) => e.tipo === 'pantalla' && e.detalle === '/registrar/revision');
  const f3 = f2 && busca(f2.t, (e) => e.tipo === 'envio_exitoso');
  const cuenta = (a, z, f) => s.filter((e) => e.t >= a && (z === null || e.t <= z) && f(e)).length;
  const seg = (a, z) => (a && z ? Math.round((z - a) / 1000) : '');
  return [
    { participante: p, version: VERSION, tarea: 'T1', tiempo_s: seg(t0, f1 && f1.t), exito: f1 ? 'si' : 'no', errores: 0 },
    { participante: p, version: VERSION, tarea: 'T2', tiempo_s: f1 ? seg(f1.t, f2 && f2.t) : '', exito: f2 ? 'si' : 'no',
      errores: f1 ? cuenta(f1.t, f2 ? f2.t : null, (e) => e.tipo === 'error_validacion') : 0,
      descartados: cuenta(t0, null, (e) => e.tipo === 'hallazgo_descartado') },
    { participante: p, version: VERSION, tarea: 'T3', tiempo_s: f2 ? seg(f2.t, f3 && f3.t) : '', exito: f3 ? 'si' : 'no',
      errores: f2 ? cuenta(f2.t, f3 ? f3.t : null, (e) => e.tipo === 'envio_fallido' || e.tipo === 'error_validacion') : 0 },
  ];
}
function descargar(nombre, texto) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + texto], { type: 'text/csv;charset=utf-8' }));
  a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
}
const csv = (filas, cols) => [cols.join(','), ...filas.map((f) => cols.map((c) => `"${String(f[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');

function pantallaObservador() {
  const log = leer('log', []);
  const participantes = [...new Set(log.map((e) => e.p))];
  const resumen = participantes.flatMap((p) => resumenSesion(p) || []);
  return {
    titulo: 'Panel del observador',
    html: `<div class="columna" style="max-width:60rem">
      <div class="encabezado"><h1 tabindex="-1">Panel del observador</h1></div>
      <p class="obs-nota">Solo para quien dirige la prueba. Prepara la sesión aquí y luego entrega el equipo al participante. Los tiempos se calculan a partir de los eventos; el éxito, las ayudas, los comentarios y las emociones se anotan en la hoja de observación.</p>
      <form id="form-obs" class="tarjeta" novalidate>
        <div class="rejilla-obs">
          <div class="campo"><label for="obs-p">Código del participante</label>
            <input type="text" id="obs-p" class="corto" value="${esc(estado.participante)}" placeholder="P01" autocomplete="off"></div>
          <div class="campo"><label for="obs-fallo">Fallo simulado al enviar</label>
            <select id="obs-fallo">${[['ninguno', 'Ninguno'], ['una', 'Falla el primer envío (red)'], ['sesion', 'Sesión expirada en el primer envío'], ['siempre', 'Falla siempre']]
              .map(([v, t]) => `<option value="${v}"${v === estado.modoFallo ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
        </div>
        <p class="campo__error" id="obs-error"></p>
        <div class="acciones" style="margin-top:.5rem">
          <button type="submit" class="btn btn--primario">Comenzar sesión de prueba</button>
          <button type="button" class="btn btn--secundario" id="obs-fin">Terminar sesión</button>
        </div>
      </form>
      <section class="bloque" style="margin-top:2rem" aria-labelledby="h-obs-res"><div class="bloque__cab"><h2 id="h-obs-res">Resumen calculado (${VERSION})</h2></div>
        ${resumen.length ? `<div class="tabla-envoltura"><table><thead><tr><th>Participante</th><th>Tarea</th><th class="num">Tiempo (s)</th><th>Llegó al final</th><th class="num">Errores</th></tr></thead>
        <tbody>${resumen.map((r) => `<tr><td>${esc(r.participante)}</td><td>${r.tarea}</td><td class="num">${r.tiempo_s}</td><td>${r.exito}</td><td class="num">${r.errores}${r.descartados ? ` (+${r.descartados} hallazgo descartado)` : ''}</td></tr>`).join('')}</tbody></table></div>` : '<p class="vacio">Sin sesiones registradas todavía.</p>'}
      </section>
      <section class="bloque" aria-labelledby="h-obs-log"><div class="bloque__cab"><h2 id="h-obs-log">Últimos eventos</h2><span class="cuenta">${log.length} en total</span></div>
        ${log.length ? `<div class="tabla-envoltura"><table><thead><tr><th>Hora</th><th>P</th><th>Evento</th><th>Detalle</th></tr></thead><tbody>
        ${log.slice(-25).reverse().map((e) => `<tr><td>${new Date(e.t).toLocaleTimeString('es-EC')}</td><td>${esc(e.p)}</td><td>${esc(e.tipo)}</td><td>${esc(e.detalle)}</td></tr>`).join('')}</tbody></table></div>` : ''}
      </section>
      <div class="acciones">
        <button type="button" class="btn btn--secundario" id="obs-csv-res"${resumen.length ? '' : ' disabled'}>Descargar resumen (.csv)</button>
        <button type="button" class="btn btn--secundario" id="obs-csv-log"${log.length ? '' : ' disabled'}>Descargar eventos (.csv)</button>
        <button type="button" class="btn btn--terciario" id="obs-borrar">Borrar eventos</button>
      </div>
    </div>`,
    montar() {
      $('#form-obs').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const p = $('#obs-p').value.trim().toUpperCase();
        if (!/^P\d{2}$/.test(p)) { $('#obs-error').textContent = 'Usa un código P y dos dígitos, por ejemplo P01.'; $('#obs-p').focus(); return; }
        estado.participante = p; guardar('participante', p);
        estado.modoFallo = $('#obs-fallo').value; guardar('modoFallo', estado.modoFallo);
        descartarBorrador(); estado.listaLista = false;
        registrarEvento('sesion_inicio', `fallo=${estado.modoFallo}`);
        navegar('/inicio');
      });
      $('#obs-fin').addEventListener('click', () => { registrarEvento('sesion_fin'); estado.participante = ''; guardar('participante', ''); avisar('Sesión terminada. Ya no se registran eventos.'); render(); });
      $('#obs-csv-res').addEventListener('click', () => descargar(`resumen-${VERSION}.csv`, csv(resumen, ['participante', 'version', 'tarea', 'tiempo_s', 'exito', 'errores', 'descartados'])));
      $('#obs-csv-log').addEventListener('click', () => descargar(`eventos-${VERSION}.csv`, csv(leer('log', []).map((e) => ({ ...e, hora: new Date(e.t).toISOString() })), ['hora', 'p', 'v', 'tipo', 'detalle'])));
      $('#obs-borrar').addEventListener('click', async () => {
        const r = await confirmar({ titulo: '¿Borrar todos los eventos?', texto: 'Descarga antes los CSV si los necesitas.', botones: [{ texto: 'Cancelar', valor: 'no', foco: true }, { texto: 'Borrar eventos', valor: 'si', clase: 'btn--peligro' }] });
        if (r === 'si') { borrar('log'); render(); }
      });
    },
  };
}

/* ===================== ENRUTADOR ===================== */
const RUTAS = {
  '/inicio': pantallaInicio,
  '/registrar/datos': pantallaDatos,
  '/registrar/hallazgos': pantallaHallazgos,
  '/registrar/revision': pantallaRevision,
  '/enviando': pantallaEnviando,
  '/error-envio': pantallaErrorEnvio,
  '/exito': pantallaExito,
  '/evaluaciones': pantallaEvaluaciones,
  '/ayuda': pantallaAyuda,
  '/observador': pantallaObservador,
};
const ruta = () => location.hash.replace(/^#/, '') || '/inicio';
function navegar(r) { if (ruta() === r) render(); else location.hash = r; }

let rutaAnterior = null;
function render(opciones = {}) {
  const r = ruta();
  if (r !== '/evaluaciones') estado.listaLista = false;
  let p;
  if (r.startsWith('/evaluaciones/')) p = pantallaDetalle(decodeURIComponent(r.slice('/evaluaciones/'.length)));
  else p = (RUTAS[r] || (() => ({ titulo: 'Página no encontrada', html: '<div class="columna"><h1 tabindex="-1">No encontramos esta página</h1><a class="btn btn--primario" href="#/inicio">Ir al inicio</a></div>' })))();
  if (p.redirigir) { location.replace(`#${p.redirigir}`); return; }
  const main = $('#contenido');
  main.innerHTML = p.html;
  document.title = `${p.titulo} – RegistraUX ${VERSION}`;
  const seccion = r.split('/')[1];
  $$('[data-nav]').forEach((a) => {
    const activo = a.dataset.nav === seccion || (seccion === 'registrar' && a.dataset.nav === 'inicio');
    if (activo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (p.montar) p.montar();
  actualizarIndicador();
  if (r !== rutaAnterior) {
    registrarEvento('pantalla', r);
    const aviso = $('#aviso');
    if (!aviso.hidden && Date.now() - Number(aviso.dataset.t || 0) > 800) aviso.hidden = true;
  }
  rutaAnterior = r;
  const foco = opciones.foco ? $(opciones.foco) : $('h1', main);
  if (foco) { foco.focus(); if (!opciones.foco) window.scrollTo(0, 0); }
}

/* Enlaces internos (#id) que no son rutas: saltar al contenido y resumen de errores */
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href.startsWith('#/')) return;
  ev.preventDefault();
  if (a.dataset.enfocar) { enfocarCampo(a.dataset.enfocar); return; }
  const destino = document.getElementById(href.slice(1));
  if (destino) destino.focus();
});

window.addEventListener('hashchange', () => render());
render();
