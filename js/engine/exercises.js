// ===== Motor de ejercicios: renderiza una card y expone un controlador =====
import { dialogo } from '../mascots.js';
import { estado } from '../state.js';
import { recomendarPlataforma, todasLasPlataformas, NOMBRES_PAIS } from '../platforms.js';
import { PORTRAITS, posterBigShort } from '../maestros.js';
import { etapaActual, calcPersonalizado } from '../perfil.js';

// Contrato del controlador que devuelve cada montaje:
//   { graded:boolean, listo():boolean, onCambio(fn), evaluar():{correct,explicacion},
//     textoBoton:string }
// Para cards no evaluables (intro/calc/cierre/accion) graded=false y evaluar()=null.

export function montar(card, el){
  switch(card.tipo){
    case 'intro':   return montarIntro(card, el);
    case 'quiz':    return montarQuiz(card, el);
    case 'vf':      return montarVF(card, el);
    case 'ordenar': return montarOrdenar(card, el);
    case 'slider':  return montarSlider(card, el);
    case 'calc':    return montarCalc(card, el);
    case 'accion':  return montarAccion(card, el);
    case 'cierre':  return montarCierre(card, el);
    case 'guia':    return montarGuia(card, el);
    case 'guia-plataformas': return montarGuiaPlataformas(card, el);
    case 'maestro': return montarMaestro(card, el);
    case 'pelicula': return montarPelicula(card, el);
    case 'etapa':   return montarEtapa(card, el);
    default:        return montarIntro({...card, texto:'(card desconocida: '+card.tipo+')'}, el);
  }
}

// ---------- INTRO (no evaluable) ----------
function montarIntro(card, el){
  el.innerHTML = `
    ${card.titulo ? `<p class="pregunta">${(card.titulo)}</p>` : ''}
    ${dialogo(card.mascota || 'colmillo', (card.texto))}
    ${card.extra ? `<p class="centro txt-mini">${(card.extra)}</p>` : ''}`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- QUIZ (opción múltiple) ----------
function montarQuiz(card, el){
  let sel = -1; let cambio = ()=>{};
  el.innerHTML = `
    <p class="pregunta">${(card.pregunta)}</p>
    ${card.mascota ? dialogo(card.mascota, (card.pista||'¿Cuál crees que es?')) : ''}
    <div class="opciones">
      ${card.opciones.map((o,i)=>`<button class="opcion" data-i="${i}">${(o)}</button>`).join('')}
    </div>`;
  const btns = [...el.querySelectorAll('.opcion')];
  btns.forEach(b => b.onclick = ()=>{
    sel = +b.dataset.i;
    btns.forEach(x => x.classList.toggle('sel', x===b));
    cambio();
  });
  return {
    graded:true, textoBoton:'Comprobar',
    listo:()=> sel >= 0,
    onCambio(fn){ cambio = fn; },
    evaluar(){
      const correct = sel === card.correcta;
      btns.forEach((b,i)=>{
        b.disabled = true;
        if(i===card.correcta) b.classList.add('ok');
        else if(i===sel) b.classList.add('mal');
      });
      return { correct, explicacion: card.explicacion || '' };
    }
  };
}

// ---------- VERDADERO / FALSO ----------
function montarVF(card, el){
  let sel = null; let cambio = ()=>{};
  el.innerHTML = `
    <p class="pregunta">${(card.afirmacion)}</p>
    ${card.mascota ? dialogo(card.mascota, '¿Verdadero o falso?') : ''}
    <div class="opciones">
      <button class="opcion" data-v="true">✅ Verdadero</button>
      <button class="opcion" data-v="false">❌ Falso</button>
    </div>`;
  const btns = [...el.querySelectorAll('.opcion')];
  btns.forEach(b => b.onclick = ()=>{
    sel = b.dataset.v === 'true';
    btns.forEach(x => x.classList.toggle('sel', x===b));
    cambio();
  });
  return {
    graded:true, textoBoton:'Comprobar',
    listo:()=> sel !== null,
    onCambio(fn){ cambio = fn; },
    evaluar(){
      const correct = sel === card.esVerdadero;
      btns.forEach(b=>{
        b.disabled = true;
        const v = b.dataset.v === 'true';
        if(v === card.esVerdadero) b.classList.add('ok');
        else if(v === sel) b.classList.add('mal');
      });
      return { correct, explicacion: card.explicacion || '' };
    }
  };
}

// ---------- ORDENAR pasos ----------
function montarOrdenar(card, el){
  // barajado estable a partir del índice (sin Math.random para el orden inicial no importa aquí; usamos shuffle simple)
  let orden = card.pasos.map((_,i)=>i);
  for(let i=orden.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [orden[i],orden[j]]=[orden[j],orden[i]]; }
  let cambio = ()=>{};
  const pintar = ()=>{
    cont.innerHTML = orden.map((idx,pos)=>`
      <button class="opcion" data-pos="${pos}" style="display:flex;justify-content:space-between;align-items:center">
        <span>${(card.pasos[idx])}</span>
        <span style="color:var(--gris)">${pos>0?'▲':''} ${pos<orden.length-1?'▼':''}</span>
      </button>`).join('');
    [...cont.querySelectorAll('.opcion')].forEach(b=>{
      b.onclick = ()=>{ const p=+b.dataset.pos; if(p>0){[orden[p-1],orden[p]]=[orden[p],orden[p-1]]; pintar(); cambio();} };
    });
  };
  el.innerHTML = `<p class="pregunta">${(card.pregunta)}</p>
    <p class="subpregunta">Toca un paso para subirlo. Ordénalos de primero a último.</p>
    <div class="opciones" id="ord"></div>`;
  const cont = el.querySelector('#ord');
  pintar();
  return {
    graded:true, textoBoton:'Comprobar',
    listo:()=> true,
    onCambio(fn){ cambio = fn; },
    evaluar(){
      const correct = orden.every((idx,pos)=> idx === pos);
      [...cont.querySelectorAll('.opcion')].forEach((b,pos)=>{
        b.disabled=true; b.classList.add(orden[pos]===pos ? 'ok':'mal');
      });
      return { correct, explicacion: card.explicacion || 'El orden correcto es el de arriba.' };
    }
  };
}

// ---------- SLIDER (estimar un número) ----------
function montarSlider(card, el){
  let val = card.min; let cambio = ()=>{};
  const fmt = (v)=> (card.formato==='pesos' ? '$'+Number(v).toLocaleString('es') : v+(card.sufijo||''));
  el.innerHTML = `
    <p class="pregunta">${(card.pregunta)}</p>
    <div class="calc-box">
      <div class="calc-grande" id="sv">${fmt(val)}</div>
      <input class="rango" type="range" min="${card.min}" max="${card.max}" step="${card.paso||1}" value="${val}" />
      <div class="rango-fila"><span>${fmt(card.min)}</span><span>${fmt(card.max)}</span></div>
    </div>`;
  const r = el.querySelector('input'); const sv = el.querySelector('#sv');
  r.oninput = ()=>{ val=+r.value; sv.textContent=fmt(val); cambio(); };
  return {
    graded:true, textoBoton:'Comprobar',
    listo:()=> true,
    onCambio(fn){ cambio = fn; },
    evaluar(){
      const tol = card.tolerancia ?? (card.max-card.min)*0.1;
      const correct = Math.abs(val - card.respuesta) <= tol;
      return { correct, explicacion: (card.explicacion||'') + ` La respuesta era ~${fmt(card.respuesta)}.` };
    }
  };
}

// ---------- CALC (juguete de interés compuesto, no evaluable) ----------
// card.personalizar=true → arranca con el horizonte y monto de la etapa del usuario
function montarCalc(card, el){
  const base = { aporte:20, anios:20, tasa:8, periodo:'semana' };
  const perso = card.personalizar ? calcPersonalizado() : null;
  const c = Object.assign(base, card.calc||{}, perso||{});
  const etapa = card.personalizar ? etapaActual() : null;
  el.innerHTML = `
    ${card.texto ? dialogo(card.mascota||'colmillo', (card.texto)) : ''}
    ${etapa ? `<p class="centro txt-mini" style="margin-bottom:10px">Ajustado a tu etapa: <b>~${etapa.horizonteCalc} años</b> por delante. Muévelo si quieres.</p>` : ''}
    <div class="calc-box">
      <div class="txt-mini">Si inviertes</div>
      <div class="calc-grande" id="c-res">$0</div>
      <label class="txt-mini">Aporte por ${c.periodo}: <b id="l-ap">$${c.aporte}</b></label>
      <input class="rango" id="r-ap" type="range" min="5" max="200" step="5" value="${c.aporte}" />
      <label class="txt-mini">Durante: <b id="l-an">${c.anios}</b> años</label>
      <input class="rango" id="r-an" type="range" min="1" max="40" step="1" value="${c.anios}" />
      <div class="rango-fila"><span>a un ${c.tasa}% anual histórico del índice</span></div>
    </div>`;
  const ap=el.querySelector('#r-ap'), an=el.querySelector('#r-an');
  const lap=el.querySelector('#l-ap'), lan=el.querySelector('#l-an'), res=el.querySelector('#c-res');
  const calcular=()=>{
    const aporte=+ap.value, anios=+an.value, r=c.tasa/100;
    const porAnio = c.periodo==='semana'?52 : c.periodo==='mes'?12 : 1;
    const n = anios*porAnio, iP = Math.pow(1+r/porAnio, 1)-1;
    // valor futuro de una anualidad
    const fv = aporte * ((Math.pow(1+iP, n)-1)/iP);
    lap.textContent='$'+aporte; lan.textContent=anios;
    res.textContent='$'+Math.round(fv).toLocaleString('es');
  };
  ap.oninput=calcular; an.oninput=calcular; calcular();
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- ACCIÓN (nivel jefe / just-in-time) ----------
function montarAccion(card, el){
  let cambio=()=>{};
  el.innerHTML = `
    ${dialogo(card.mascota||'colmillo', (card.texto))}
    <div class="accion-box">
      <h3>🎯 ${(card.titulo||'Tu misión real')}</h3>
      <ul class="checklist">
        ${card.pasos.map((p,i)=>`<li><input type="checkbox" data-i="${i}"><span>${(p)}</span></li>`).join('')}
      </ul>
      ${card.link ? `<a class="link-oficial" href="${card.link}" target="_blank" rel="noopener">${(card.linkTexto||'Recurso oficial')} ↗</a>` : ''}
      ${card.aviso ? `<p class="aviso">${(card.aviso)}</p>` : ''}
    </div>`;
  const chks=[...el.querySelectorAll('input')];
  chks.forEach(c=> c.onchange=()=>cambio());
  return {
    graded:false, textoBoton:'Lo hice ✓',
    listo:()=> chks.every(c=>c.checked),
    onCambio(fn){ cambio=fn; },
    evaluar:null,
  };
}

// ---------- CIERRE ----------
function montarCierre(card, el){
  el.innerHTML = `
    ${dialogo(card.mascota||'colmillo', (card.texto||'¡Lección completada, campeón!'))}
    ${card.resumen ? `<div class="accion-box" style="border-color:var(--verde);box-shadow:var(--sombra) var(--verde-osc)">
      <h3 style="color:var(--verde-osc)">📌 Para llevarte</h3>
      <ul class="checklist">${card.resumen.map(r=>`<li><span>✅</span><span>${(r)}</span></li>`).join('')}</ul></div>` : ''}`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Terminar' };
}

// ---------- GUÍA (contenido de referencia — no todo cabe en un quiz) ----------
// { tipo:'guia', mascota, titulo, intro, secciones:[{titulo,texto}], ejemplo:{titulo,texto} }
function montarGuia(card, el){
  el.innerHTML = `
    ${card.titulo ? `<p class="pregunta">${(card.titulo)}</p>` : ''}
    ${card.intro ? dialogo(card.mascota||'colmillo', (card.intro)) : ''}
    <div class="guia">
      ${(card.secciones||[]).map(s=>`
        <div class="guia-seccion">
          <h4>${(s.titulo)}</h4>
          <p>${(s.texto)}</p>
        </div>`).join('')}
      ${card.ejemplo ? `
        <div class="guia-ejemplo">
          <h4>🔎 ${(card.ejemplo.titulo||'Ejemplo concreto')}</h4>
          <p>${(card.ejemplo.texto)}</p>
        </div>` : ''}
    </div>`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- GUÍA DE PLATAFORMAS (comparativa completa + destaca la del país del perfil) ----------
function montarGuiaPlataformas(card, el){
  const pais = estado.get().perfilPais;
  const recomendada = recomendarPlataforma(pais);
  const nombrePais = pais ? (NOMBRES_PAIS[pais] || pais) : null;
  const todas = todasLasPlataformas();
  el.innerHTML = `
    <p class="pregunta">Las 7 plataformas, en detalle</p>
    ${dialogo('colmillo', recomendada && nombrePais
      ? `Para <b>${nombrePais}</b> te destaco <b>${recomendada.nombre}</b> abajo — pero léelas todas, la decisión es tuya.`
      : 'Repásalas todas con calma. No hay una única correcta: depende de tu país y tu estilo.')}
    <div class="guia">
      ${todas.map(p => `
        <div class="guia-plataforma ${recomendada && p.id===recomendada.id ? 'destacada' : ''}">
          ${recomendada && p.id===recomendada.id ? '<span class="guia-tag">Para ti</span>' : ''}
          <h4>${(p.nombre)} <small>· ${(p.regulador)}</small></h4>
          <p>${(p.que_es)}</p>
          <p class="txt-mini"><b>Ideal para:</b> ${(p.ideal_para)}</p>
          ${p.deposito ? `<p class="txt-mini"><b>Para cargar dinero:</b> ${(p.deposito.resumen)}</p>` : ''}
          ${p.deposito?.url ? `<a class="link-oficial" href="${p.deposito.url}" target="_blank" rel="noopener">${(p.deposito.texto||'Ver tutorial oficial')} ↗</a>` : ''}
        </div>`).join('')}
    </div>`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- ETAPA (contenido personalizado según la edad del onboarding) ----------
function montarEtapa(card, el){
  const e = etapaActual();
  if(!e){
    el.innerHTML = dialogo('colmillo', 'No tengo tu etapa guardada — pero la idea es simple: mientras más años tengas por delante, más puedes aguantar las caídas del mercado.');
    return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
  }
  el.innerHTML = `
    ${dialogo(card.mascota || 'colmillo', 'Esto es para <b>tu</b> etapa. Otra persona vería un consejo distinto — y está bien que así sea.')}
    <div class="accion-box" style="border-color:var(--oro)">
      <h3>🧭 ${(e.titulo)}</h3>
      <p class="txt-mini" style="font-size:14px;line-height:1.55">${(e.texto)}</p>
      <div class="etapa-riesgo"><b>Sobre el riesgo:</b> ${(e.riesgo)}</div>
      <div class="etapa-regla">
        <span>Guía rápida (heurística, no una orden):</span>
        <b>~${e.pctAcciones}%</b> en acciones/índice · <b>~${100 - e.pctAcciones}%</b> en algo más estable.
      </div>
      ${e.nota ? `<p class="aviso">${(e.nota)}</p>` : ''}
    </div>
    <p class="aviso centro">Es educación general por etapa, no un consejo personalizado sobre tu dinero.</p>`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- MAESTRO (caricatura + por qué es leyenda + cita) ----------
// { tipo:'maestro', maestro:'buffett'|'bogle'|'burry', nombre, anios, rol, intro, mascota, bullets:[], cita }
function montarMaestro(card, el){
  const retrato = PORTRAITS[card.maestro] || '';
  el.innerHTML = `
    ${card.intro ? dialogo(card.mascota || 'lauta', (card.intro)) : ''}
    <div class="maestro">
      <div class="maestro-medallon">${retrato}</div>
      <h3 class="maestro-nombre">${(card.nombre)}</h3>
      <div class="maestro-meta">${(card.anios||'')}${card.rol ? ' · '+(card.rol) : ''}</div>
      ${card.bullets ? `<ul class="maestro-bullets">${card.bullets.map(b=>`<li>${(b)}</li>`).join('')}</ul>` : ''}
      ${card.cita ? `<blockquote class="maestro-cita">“${(card.cita)}”</blockquote>` : ''}
    </div>`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}

// ---------- PELÍCULA (póster propio + tráiler oficial + dónde verla) ----------
// { tipo:'pelicula', titulo, anio, director, sinopsis, trailer, dondeVer, mascota, texto }
function montarPelicula(card, el){
  el.innerHTML = `
    ${card.texto ? dialogo(card.mascota || 'cadete', (card.texto)) : ''}
    <div class="pelicula">
      <div class="pelicula-poster">${posterBigShort()}</div>
      <div class="pelicula-info">
        <h3>${(card.titulo)}</h3>
        <div class="maestro-meta">${(card.anio||'')}${card.director ? ' · Dir. '+(card.director) : ''}</div>
        ${card.sinopsis ? `<p>${(card.sinopsis)}</p>` : ''}
        <div class="pelicula-acciones">
          ${card.trailer ? `<a class="btn btn--azul" href="${card.trailer}" target="_blank" rel="noopener">▶ Ver tráiler oficial</a>` : ''}
          ${card.dondeVer ? `<a class="btn btn--fantasma" href="${card.dondeVer}" target="_blank" rel="noopener">¿Dónde verla? ↗</a>` : ''}
        </div>
        <p class="aviso">Enlaces a fuentes oficiales/legales (tráiler de Paramount · buscador de plataformas).</p>
      </div>
    </div>`;
  return { graded:false, listo:()=>true, onCambio(){}, evaluar:null, textoBoton:'Continuar' };
}
