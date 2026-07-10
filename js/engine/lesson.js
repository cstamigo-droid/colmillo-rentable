// ===== Reproductor de lección =====
import { montar } from './exercises.js';
import { estado } from '../state.js';
import { fraseAleatoria } from '../mascots.js';
import { svgIcon } from '../icons.js';

// abrirLeccion(unidad, leccion, host, onSalir, opts)
//   opts.modoRepaso = true  → sesión de repaso (las cards traen _itemId)
export function abrirLeccion(unidad, leccion, host, onSalir, opts = {}){
  const modoRepaso = !!opts.modoRepaso;
  const cards = leccion.cards || [];

  // cola de trabajo: cada card evaluable fallada vuelve al final hasta acertarla
  let cola = cards.map((card, i) => ({
    card,
    key: modoRepaso ? (card._itemId || 'r'+i) : String(i),
    itemId: modoRepaso ? card._itemId : `${leccion.id}#${i}`,
  }));
  const total = cola.length;
  const acertadas = new Set();   // keys ya resueltas (avance real)
  let tropiezos = 0;             // respuestas incorrectas (para reforzar)

  estado.tocarDia();

  function pintar(){
    const item = cola[0];
    const prog = Math.round((acertadas.size / total) * 100);
    host.innerHTML = `
      <section class="leccion">
        <div class="leccion-top">
          <button class="cerrar" id="cerrar">✕</button>
          <div class="barra-prog"><i style="width:${prog}%"></i></div>
        </div>
        <div class="card-cuerpo" id="cuerpo"></div>
        <div class="pie-fijo"><button class="btn btn--gris" id="accion" disabled>Continuar</button></div>
      </section>
      <div class="feedback" id="feedback"></div>`;

    document.getElementById('cerrar').onclick = ()=> confirmarSalir();
    const cuerpo = document.getElementById('cuerpo');
    const boton = document.getElementById('accion');
    const ctrl = montar(item.card, cuerpo);

    boton.textContent = ctrl.textoBoton || 'Continuar';
    const refrescar = ()=>{
      const ok = ctrl.listo();
      boton.disabled = !ok;
      boton.classList.toggle('btn--gris', !ok);
      boton.classList.add('btn');
    };
    ctrl.onCambio(refrescar);
    refrescar();

    boton.onclick = ()=>{
      if(!ctrl.listo()) return;
      if(ctrl.graded && ctrl.evaluar){
        const { correct, explicacion } = ctrl.evaluar();
        if(item.itemId) estado.programarRepaso(item.itemId, correct);
        if(!correct) tropiezos++;
        mostrarFeedback(correct, explicacion, ()=> resolver(correct, item));
      } else {
        acertadas.add(item.key);
        cola.shift();
        siguiente();
      }
    };
  }

  function resolver(correct, item){
    if(correct){
      acertadas.add(item.key);
      cola.shift();
    } else {
      // re-encolar al final: se vuelve a preguntar hasta acertarla
      cola.push(cola.shift());
    }
    siguiente();
  }

  function siguiente(){
    if(cola.length === 0) return finalizar();
    pintar();
  }

  function mostrarFeedback(correct, explicacion, next){
    const fb = document.getElementById('feedback');
    fb.className = 'feedback ' + (correct ? 'ok' : 'mal');
    const cola_msg = correct ? '' : '<div class="feedback-exp" style="opacity:.85">Sin drama — te la vuelvo a preguntar más adelante.</div>';
    fb.innerHTML = `
      <div class="feedback-titulo">${correct ? '✅ '+fraseAleatoria('ok') : '❌ '+fraseAleatoria('mal')}</div>
      ${explicacion ? `<div class="feedback-exp">${explicacion}</div>` : ''}
      ${cola_msg}
      <button class="btn" id="fb-cont">Continuar</button>`;
    setTimeout(()=> fb.classList.add('show'), 20);
    document.getElementById('fb-cont').onclick = ()=>{ fb.classList.remove('show'); next(); };
  }

  function finalizar(){
    let xpGanado;
    if(modoRepaso){
      xpGanado = 10;
      estado.sumarXP(xpGanado);
    } else {
      const nueva = estado.completarLeccion(leccion.id, leccion.xp || 15);
      xpGanado = nueva ? (leccion.xp || 15) : 5;
      if(!nueva) estado.sumarXP(5);
    }
    const guia = modoRepaso ? 'colmillo' : (unidad.mascota || 'colmillo');
    const titulo = modoRepaso ? '¡Repaso completo!' : '¡Lección completa!';
    host.innerHTML = `
      <section class="celebra">
        <img src="assets/mascots/${guia}.png" alt="mascota" />
        <h2>${titulo}</h2>
        <p class="txt-mini">${leccion.titulo || ''}</p>
        <div class="premios">
          <div class="premio">${svgIcon('zap',22)}+${xpGanado}<small>XP</small></div>
          <div class="premio">${svgIcon('flame',22)}${estado.get().racha}<small>Racha</small></div>
          <div class="premio">${svgIcon('star',22)}${tropiezos===0?'Perfecto':tropiezos}<small>${tropiezos===0?'Sin fallos':'a reforzar'}</small></div>
        </div>
        <button class="btn" id="volver">${modoRepaso ? 'Volver al mapa' : 'Seguir aprendiendo'}</button>
      </section>`;
    document.getElementById('volver').onclick = onSalir;
  }

  function confirmarSalir(){
    if(acertadas.size === 0 || confirm('¿Salir? Se guarda lo que ya respondiste.')) onSalir();
  }

  pintar();
}
