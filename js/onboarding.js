// ===== Test de perfil inicial (país + edad/etapa + objetivo) — personaliza el camino =====
import { estado } from './state.js';
import { dialogo } from './mascots.js';
import { NOMBRES_PAIS } from './platforms.js';
import { ETAPAS } from './perfil.js';

const PAISES = [
  { id: 'CL', nombre: 'Chile' },
  { id: 'AR', nombre: 'Argentina' },
  { id: 'PE', nombre: 'Perú' },
  { id: 'CO', nombre: 'Colombia' },
  { id: 'EC', nombre: 'Ecuador' },
  { id: 'MX', nombre: 'México' },
  { id: 'OTRO', nombre: 'Otro país' },
];

const OBJETIVOS = [
  { id: 'pasivo', titulo: 'Que alguien lo arme por mí', desc: 'Quiero lo más simple: elijo mi perfil y listo.' },
  { id: 'aprender', titulo: 'Quiero aprender a hacerlo yo', desc: 'Quiero entender cada paso y decidir con criterio propio.' },
];

const PASOS = 4; // pasos con barra (país, edad, objetivo, confirmación); la bienvenida es 0

export function renderOnboarding(host, onDone){
  let pais = null, edad = null, objetivo = null;
  let paso = 0; // 0 bienvenida · 1 país · 2 edad · 3 objetivo · 4 confirmación

  function pintar(){
    if(paso === 0) return pintarBienvenida();
    if(paso === 1) return pintarPais();
    if(paso === 2) return pintarEdad();
    if(paso === 3) return pintarObjetivo();
    return pintarConfirmacion();
  }

  function shell(cuerpo, boton, disabled){
    host.innerHTML = `
      <section class="leccion">
        <div class="leccion-top">
          <div class="barra-prog"><i style="width:${(paso/PASOS)*100}%"></i></div>
        </div>
        <div class="card-cuerpo">${cuerpo}</div>
        <div class="pie-fijo"><button class="btn ${disabled?'btn--gris':''}" id="sig" ${disabled?'disabled':''}>${boton}</button></div>
      </section>`;
  }

  // selector genérico de opciones (una sola selección → habilita el botón)
  function cablearOpciones(onPick){
    const btns = [...host.querySelectorAll('.opcion')];
    btns.forEach(b=> b.onclick = ()=>{
      onPick(b.dataset.id);
      btns.forEach(x=>x.classList.toggle('sel', x===b));
      const sig = document.getElementById('sig');
      sig.disabled = false; sig.classList.remove('btn--gris');
    });
  }

  function pintarBienvenida(){
    shell(dialogo('colmillo', 'Antes de arrancar, cuéntame un poco de ti — así te armo un camino a <b>tu</b> medida. No a todos les sirve lo mismo. Toma 30 segundos.'),
      'Empezar', false);
    document.getElementById('sig').onclick = ()=>{ paso=1; pintar(); };
  }

  function pintarPais(){
    shell(`
      <p class="pregunta">¿Desde qué país vas a invertir?</p>
      <div class="opciones">
        ${PAISES.map(p=>`<button class="opcion" data-id="${p.id}">${p.nombre}</button>`).join('')}
      </div>`, 'Continuar', true);
    cablearOpciones(id => pais = id);
    document.getElementById('sig').onclick = ()=>{ if(pais){ paso=2; pintar(); } };
  }

  function pintarEdad(){
    shell(`
      <p class="pregunta">¿Qué edad tienes?</p>
      <p class="subpregunta">Esto cambia mucho el plan: no invierte igual alguien de 17 que alguien de 50.</p>
      <div class="opciones">
        ${ETAPAS.map(e=>`<button class="opcion" data-id="${e.id}">${e.label}</button>`).join('')}
      </div>`, 'Continuar', true);
    cablearOpciones(id => edad = id);
    document.getElementById('sig').onclick = ()=>{ if(edad){ paso=3; pintar(); } };
  }

  function pintarObjetivo(){
    shell(`
      <p class="pregunta">¿Qué buscas?</p>
      <div class="opciones">
        ${OBJETIVOS.map(o=>`<button class="opcion" data-id="${o.id}" style="display:block">
          <b style="display:block;margin-bottom:4px">${o.titulo}</b>
          <span class="txt-mini" style="font-size:13px">${o.desc}</span>
        </button>`).join('')}
      </div>`, 'Continuar', true);
    cablearOpciones(id => objetivo = id);
    document.getElementById('sig').onclick = ()=>{ if(objetivo){ paso=4; pintar(); } };
  }

  function pintarConfirmacion(){
    const nombrePais = NOMBRES_PAIS[pais] || pais;
    const etapa = ETAPAS.find(e => e.id === edad);
    const frase = `Listo. Con lo que me contaste — ${nombrePais}, tu etapa (${etapa ? etapa.label : ''}) y tu objetivo — te armo un camino a tu medida. `
      + (objetivo === 'pasivo' ? 'Directo y sin vueltas.' : 'Paso a paso y con todo el detalle.');
    shell(dialogo('colmillo', frase), 'Empezar mi camino', false);
    document.getElementById('sig').onclick = ()=>{
      estado.setPerfil(pais, objetivo, edad);
      onDone();
    };
  }

  pintar();
}
