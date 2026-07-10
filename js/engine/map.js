// ===== Render del mapa / skill tree =====
import { estado } from '../state.js';
import { svgIcon } from '../icons.js';
import { contarRepaso } from './review.js';

// desplazamiento serpenteante estilo Duolingo
const OFFSETS = [0, 46, 74, 46, 0, -46, -74, -46];

// Renderiza el banner + sendero de nodos de una unidad.
// `anteriorCompleta` entra como el estado de desbloqueo de la 1ª lección y se
// va encadenando dentro de la unidad. Devuelve el estado tras la última lección.
function renderUnidad(u, anteriorCompleta){
  const etiqueta = u.opcional
    ? `<span class="unidad-etiqueta">${u.etiqueta || 'Opcional'}</span>` : '';
  let html = `<div class="unidad-banner" style="background:${u.color};box-shadow:0 4px 0 ${sombra(u.color)}">
      <div><h2>${u.id} · ${u.titulo}</h2><small>${u.subtitulo||''}</small></div>
      ${etiqueta}
      <img class="u-guia" src="assets/mascots/${u.mascota||'colmillo'}.png" alt="guía"/>
    </div><div class="sendero">`;
  (u.lessons||[]).forEach((l, i)=>{
    const completa = estado.leccionCompleta(l.id);
    const desbloqueada = anteriorCompleta || completa;
    const estadoCls = completa ? 'completa' : (desbloqueada ? 'activa' : 'bloqueada');
    const icono = completa ? svgIcon('star') : (desbloqueada ? svgIcon(l.icono||'book') : svgIcon('lock'));
    const off = OFFSETS[i % OFFSETS.length];
    const activaAhora = desbloqueada && !completa;
    html += `<div class="nodo-fila">
        <button class="nodo-btn" data-u="${u.id}" data-l="${l.id}" style="transform:translateX(${off}px)" ${desbloqueada?'':'disabled'}>
          ${activaAhora?`<span class="burbuja-empezar">Empezar</span>`:''}
          <div class="nodo nodo--${estadoCls}">${icono}</div>
        </button>
      </div>
      <div class="nodo-titulo" style="transform:translateX(${off}px)">${l.titulo}</div>`;
    anteriorCompleta = completa;
  });
  html += `</div>`;
  return { html, anteriorCompleta };
}

export function renderMapa(curriculum, host, onAbrir, onRepaso){
  const s = estado.get();
  const pendientes = contarRepaso(curriculum);
  const objetivo = s.perfilObjetivo;

  const nucleo = curriculum.unidades.filter(u => !u.opcional);
  const opcionales = curriculum.unidades.filter(u => u.opcional);
  const nucleoCompleto = nucleo.every(u => (u.lessons||[]).every(l => estado.leccionCompleta(l.id)));

  let html = `
    <div class="mapa-header">
      <h1><img class="header-mascota" src="assets/mascots/colmillo.png" alt="Colmillo"/> Colmillo Rentable</h1>
      <p>Aprende a invertir de verdad. 5 minutos al día.</p>
    </div>`;

  if(pendientes > 0){
    html += `<button class="repaso-cta" id="repaso-cta">
      <span class="repaso-ic">${svgIcon('repeat',24)}</span>
      <span class="repaso-txt"><b>Repaso diario</b><small>${pendientes} pregunta${pendientes>1?'s':''} para no olvidar</small></span>
      <span class="repaso-num">${pendientes}</span>
    </button>`;
  }

  // --- NÚCLEO (obligatorio, desbloqueo secuencial encadenado) ---
  let anterior = true;
  nucleo.forEach(u => {
    const r = renderUnidad(u, anterior);
    html += r.html;
    anterior = r.anteriorCompleta;
  });

  // --- CHECKPOINT DE GRADUACIÓN ---
  const msg = nucleoCompleto
    ? (objetivo === 'pasivo'
        ? 'Terminaste lo esencial. Ya podés invertir tranquilo — parar acá es una decisión perfectamente válida.'
        : objetivo === 'aprender'
          ? 'Terminaste lo esencial. Ahora sí, vamos a profundizar 👇'
          : 'Terminaste lo esencial. Todo lo de abajo es opcional.')
    : 'Completa las unidades de arriba para llegar a tu graduación.';
  html += `<div class="graduacion ${nucleoCompleto ? 'lograda' : 'pendiente'}">
      <div class="graduacion-ic">${svgIcon('gradCap', 30)}</div>
      <div class="graduacion-txt">
        <b>${nucleoCompleto ? '🎓 ¡Ya sos inversor!' : 'Graduación'}</b>
        <small>${msg}</small>
      </div>
    </div>`;

  // --- SECCIÓN OPCIONAL (se desbloquea toda al graduarse; no encadena entre unidades) ---
  if(opcionales.length){
    const colapsado = objetivo === 'pasivo';
    html += `<button class="opcional-toggle" id="opcional-toggle">
        <span>Contenido opcional · para profundizar</span>
        <span class="opcional-flecha">${colapsado ? '▾' : '▴'}</span>
      </button>
      <div class="opcional-cont ${colapsado ? 'oculto' : ''}" id="opcional-cont">`;
    opcionales.forEach(u => {
      // cada unidad opcional arranca desbloqueada si ya te graduaste
      html += renderUnidad(u, nucleoCompleto).html;
    });
    html += `</div>`;
  }

  host.innerHTML = html;

  const cta = document.getElementById('repaso-cta');
  if(cta && onRepaso) cta.onclick = onRepaso;

  const toggle = document.getElementById('opcional-toggle');
  if(toggle){
    toggle.onclick = ()=>{
      const cont = document.getElementById('opcional-cont');
      const oculto = cont.classList.toggle('oculto');
      toggle.querySelector('.opcional-flecha').textContent = oculto ? '▾' : '▴';
    };
  }

  host.querySelectorAll('.nodo-btn').forEach(btn=>{
    if(btn.disabled) return;
    btn.onclick = ()=>{
      const u = curriculum.unidades.find(x=>x.id===btn.dataset.u);
      const l = u.lessons.find(x=>x.id===btn.dataset.l);
      onAbrir(u, l);
    };
  });
}

function sombra(hex){
  const n = hex.replace('#','');
  const r=parseInt(n.slice(0,2),16), g=parseInt(n.slice(2,4),16), b=parseInt(n.slice(4,6),16);
  const d=(x)=>Math.max(0,Math.round(x*0.75)).toString(16).padStart(2,'0');
  return `#${d(r)}${d(g)}${d(b)}`;
}
