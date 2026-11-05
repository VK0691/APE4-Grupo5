"""Verificación técnica de accesibilidad (contraste y teclado) del prototipo.

Uso (desde APE4-integral):  python herramientas/verificar_accesibilidad.py
Requiere: pip install playwright && python -m playwright install chromium
Opcional: variable CHROME con la ruta de un Chrome instalado.
Imprime una tabla de contrastes (WCAG 1.4.3 / 1.4.11) y el recorrido con Tab del paso 1.
"""
import os, pathlib
from playwright.sync_api import sync_playwright
RAIZ = pathlib.Path(__file__).resolve().parent.parent
CHROME = os.environ.get("CHROME")
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
pares=[('Texto principal','#1C2740','#FFFFFF'),('Texto principal sobre fondo','#1C2740','#F3F5F8'),('Texto secundario/ayuda','#4A5468','#FFFFFF'),('Texto secundario sobre fondo','#4A5468','#F3F5F8'),
('Botón primario (blanco sobre verde azulado)','#FFFFFF','#0B5E63'),('Enlace','#0B5E63','#FFFFFF'),('Mensaje de error','#B42318','#FFFFFF'),('Error sobre fondo de error','#B42318','#FDF1F0'),
('Aviso (plazo)','#7A4F00','#FFF6DB'),('Éxito','#1B6B3A','#ECF7EF'),('Borde de campo (no textual)','#727C8F','#FFFFFF'),('Indicador de foco (no textual)','#5B21B6','#F3F5F8'),('Indicador de foco sobre blanco','#5B21B6','#FFFFFF')]
for i in range(5):
    c=['#5B6475','#2F6688','#7A5600','#AD4207','#A1123A'][i]; pares.append((f'Etiqueta severidad {i} (blanco sobre color)','#FFFFFF',c))
print('| Par de colores | Primer plano | Fondo | Contraste | Mínimo WCAG | Resultado |'); print('|---|---|---|---|---|---|')
for n,a,b in pares:
    m = 3.0 if 'no textual' in n else 4.5
    r=cr(a,b); print(f'| {n} | `{a}` | `{b}` | {r:.2f}:1 | {m}:1 | {"Cumple" if r>=m else "NO cumple"} |')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()
    for ver in ('v1','v2'):
        pg=b.new_page(viewport={'width':1280,'height':900})
        base=(RAIZ/'prototipo'/ver/'index.html').as_uri()
        pg.goto(base+'#/inicio'); pg.evaluate('localStorage.clear()'); pg.goto(base+'#/registrar/datos'); pg.wait_for_timeout(300)
        # recorrer con teclado el paso 1 completo
        pasos=[]; sin_foco=0
        for i in range(14):
            pg.keyboard.press('Tab')
            info=pg.evaluate("""(()=>{const a=document.activeElement;const cs=getComputedStyle(a);const lab=a.labels&&a.labels[0]?a.labels[0].innerText.trim().split('\\n')[0]:(a.getAttribute('aria-label')||a.innerText||'').trim().split('\\n')[0];
              return {tag:a.tagName.toLowerCase(), tipo:a.type||'', nombre:lab.slice(0,40), outline:cs.outlineStyle+' '+cs.outlineWidth}})()""")
            pasos.append(info)
            if info['outline'].startswith('none') and info['tag']!='body': sin_foco+=1
        # Labels: inputs sin etiqueta
        sin_label=pg.evaluate("""[...document.querySelectorAll('input,select,textarea')].filter(e=>!(e.labels&&e.labels.length)&&!e.getAttribute('aria-label')).length""")
        # Errores: enviar vacío y verificar aria-invalid + describedby
        pg.goto(base+'#/registrar/datos'); pg.wait_for_timeout(200); pg.click('button[type=submit]'); pg.wait_for_timeout(200)
        inval=pg.evaluate("""[...document.querySelectorAll('[aria-invalid=true]')].map(e=>e.name)""")
        desc=pg.evaluate("""[...document.querySelectorAll('[aria-invalid=true]')].every(e=>{const ids=(e.getAttribute('aria-describedby')||e.closest('fieldset')?.getAttribute('aria-describedby')||'').split(' ');return ids.some(id=>document.getElementById(id)&&document.getElementById(id).textContent.trim())})""")
        foco=pg.evaluate('document.activeElement.id')
        print(f'\n{ver}: secuencia Tab en paso 1:', [f"{x['tag']}:{x['nombre']}({x['outline']})" for x in pasos])
        print(f'{ver}: elementos con foco sin contorno visible: {sin_foco}; controles sin etiqueta: {sin_label}; campos marcados inválidos: {inval}; mensaje asociado a cada campo: {desc}; foco tras enviar vacío: {foco}')
        # escala con flechas
        pg.goto(base+'#/inicio'); pg.evaluate('localStorage.clear()')
    b.close()
