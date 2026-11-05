"""Regenera las imágenes de wireframes y las capturas de evidencia.

Uso (desde la carpeta APE4-integral):
    pip install playwright && python -m playwright install chromium
    python herramientas/capturar_pantallas.py

Produce:
    wireframes/W1-inicio.png ... W5-revision.png
    evidencias/capturas/original-*.png, v1-*.png, v2-*.png

Estas capturas documentan estados del prototipo. NO reemplazan la evidencia de las
pruebas con P01 y P02 (fotos de la sesión, hoja de observación y CSV exportado).
"""
import os
import pathlib

from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CAP = RAIZ / "evidencias" / "capturas"
CAP.mkdir(parents=True, exist_ok=True)
CHROME = os.environ.get("CHROME")  # opcional: ruta a un Chrome instalado


def url(rel, sufijo=""):
    return (RAIZ / rel).as_uri() + sufijo


def wireframes(b):
    pg = b.new_page(viewport={"width": 1100, "height": 800}, device_scale_factor=1.5)
    pg.goto(url("wireframes/fuente/wireframes.html"))
    nombres = {"W1": "W1-inicio", "W2": "W2-formulario", "W3": "W3-error", "W4": "W4-exito", "W5": "W5-revision"}
    for wid, nombre in nombres.items():
        pg.locator(f"#{wid}").screenshot(path=str(RAIZ / "wireframes" / f"{nombre}.png"))
    pg.close()


def original(b):
    pg = b.new_page(viewport={"width": 1024, "height": 640})
    for estado, nombre in (("#menu", "original-1-menu"), ("#form", "original-2-formulario"), ("#error", "original-3-error-y-formulario-vacio")):
        pg.goto(url("evidencias/interfaz-original/index.html", estado))
        pg.reload()
        pg.wait_for_timeout(200)
        pg.screenshot(path=str(CAP / f"{nombre}.png"))
    pg.close()


def prototipo(b, ver):
    base = url(f"prototipo/{ver}/index.html")
    pg = b.new_page(viewport={"width": 1280, "height": 860})
    foto = lambda n, completa=True: pg.screenshot(path=str(CAP / f"{ver}-{n}.png"), full_page=completa)
    pg.goto(base + "#/inicio"); pg.evaluate("localStorage.clear()")
    pg.goto(base + "?fallo=una#/inicio"); pg.wait_for_timeout(300); foto("01-inicio")
    pg.click("#btn-registrar"); pg.click("button[type=submit]"); pg.wait_for_timeout(200); foto("02-error-validacion")
    pg.select_option("#proyecto-control", "biblioteca"); pg.check("input[name=tipo][value=heuristica]")
    pg.fill("#fecha-control", "2026-11-05"); pg.fill("#evaluador-control", "E07")
    pg.fill("#tarea-control", "Reservar un libro desde el catálogo")
    pg.click("button[type=submit]"); pg.wait_for_timeout(200)

    def agregar(h, s, d, u):
        pg.select_option("#heuristica-control", h)
        pg.check(f'input[name=severidad][value="{s}"]', force=True)
        pg.fill("#descripcion-control", d); pg.fill("#ubicacion-control", u)
        pg.click("#form-hallazgo button[type=submit]"); pg.wait_for_timeout(200)

    agregar("H1", 3, "Al pulsar Reservar no aparece confirmación y el usuario repite la acción.", "Botón Reservar de la ficha")
    agregar("H9", 4, "El mensaje de error de la reserva no explica qué pasó ni cómo seguir.", "Pantalla de reserva fallida")
    pg.select_option("#heuristica-control", "H4"); pg.wait_for_timeout(100)
    foto("03-hallazgos")
    pg.fill("#descripcion-control", "Hallazgo escrito pero sin pulsar Agregar")
    pg.click("#btn-siguiente"); pg.wait_for_timeout(300)
    if pg.evaluate('document.getElementById("dialogo").open'):
        foto("04-aviso-hallazgo-sin-agregar", False)
        pg.click("#dialogo-acciones .btn--terciario"); pg.wait_for_timeout(300)
    foto("05-revision")
    pg.click("#btn-enviar"); pg.wait_for_timeout(600); foto("06-enviando", False)
    pg.wait_for_timeout(1500); foto("07-error-envio")
    pg.click("#btn-reintentar"); pg.wait_for_timeout(2600); foto("08-exito")
    pg.goto(base + "#/evaluaciones"); pg.wait_for_timeout(900); foto("09-mis-evaluaciones")
    pg.goto(base + "#/inicio"); pg.wait_for_timeout(200)
    for _ in range(3):
        pg.keyboard.press("Tab")
    foto("10-foco-teclado", False)
    m = b.new_page(viewport={"width": 390, "height": 844})
    m.goto(base + "#/inicio"); m.wait_for_timeout(300)
    m.screenshot(path=str(CAP / f"{ver}-11-movil.png"), full_page=True)
    m.close(); pg.close()


with sync_playwright() as p:
    navegador = p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()
    wireframes(navegador)
    original(navegador)
    prototipo(navegador, "v1")
    prototipo(navegador, "v2")
    navegador.close()
print("Listo:", RAIZ / "wireframes", "y", CAP)
