// ===== Bootstrap + router =====
import { estado, suscribir } from './state.js';
import { MASCOTAS, dialogo } from './mascots.js';
import { renderMapa } from './engine/map.js';
import { abrirLeccion } from './engine/lesson.js';
import { cardsDeRepaso, contarRepaso } from './engine/review.js';
import { svgIcon } from './icons.js';
import { renderOnboarding } from './onboarding.js';
import { cargarPlataformas, NOMBRES_PAIS } from './platforms.js';

// íconos estáticos de chrome (topbar/tabbar) — se inyectan una sola vez
document.getElementById('ic-flame').innerHTML = svgIcon('flame', 20);
document.getElementById('ic-zap').innerHTML = svgIcon('zap', 20);
document.getElementById('ic-map').innerHTML = svgIcon('map', 24);
document.getElementById('ic-paw').innerHTML = svgIcon('paw', 24);
document.getElementById('ic-activity').innerHTML = svgIcon('activity', 24);

const app = document.getElementById('app');
const topbar = document.getElementById('topbar');
const tabbar = document.getElementById('tabbar');
let CURRICULUM = null;

// --- cargar contenido ---
async function cargarContenido(){
  const r = await fetch('content/curriculum.json');
  CURRICULUM = await r.json();
  await cargarPlataformas();
}

// --- topbar reactiva ---
function pintarTopbar(s){
  document.getElementById('stat-racha').textContent = s.racha;
  document.getElementById('stat-xp').textContent = s.xp;
}
suscribir(pintarTopbar);

// --- chrome (topbar/tabbar) visible salvo en lección/onboarding ---
function chrome(visible){
  topbar.classList.toggle('hidden', !visible);
  tabbar.classList.toggle('hidden', !visible);
  if(visible) pintarTopbar(estado.get());
}
function marcarTab(route){
  tabbar.querySelectorAll('.tab').forEach(t=>t.classList.toggle('activa', t.dataset.route===route));
}

// ===== VISTAS =====
function vistaMapa(){
  chrome(true); marcarTab('#/mapa');
  renderMapa(CURRICULUM, app,
    (u,l)=>{ location.hash = `#/leccion/${l.id}`; lanzarLeccion(u,l); },
    ()=>{ location.hash = '#/repaso'; lanzarRepaso(); });
}

function lanzarLeccion(u,l){
  chrome(false);
  abrirLeccion(u, l, app, ()=>{ location.hash = '#/mapa'; });
}

function lanzarRepaso(){
  const cards = cardsDeRepaso(CURRICULUM);
  if(!cards.length){ location.hash = '#/mapa'; return vistaMapa(); }
  chrome(false);
  const sesion = { titulo: 'Repaso diario', cards };
  abrirLeccion({ mascota: 'colmillo' }, sesion, app, ()=>{ location.hash = '#/mapa'; router(); }, { modoRepaso: true });
}

function vistaPerfil(){
  chrome(true); marcarTab('#/perfil');
  const s = estado.get();
  const totalLecc = CURRICULUM.unidades.reduce((a,u)=>a+(u.lessons?.length||0),0);
  const hechas = Object.keys(s.lecciones).length;
  const pendientes = contarRepaso(CURRICULUM);
  const equipo = Object.values(MASCOTAS).map(m=>`
    <div class="miembro"><img src="${m.img}" alt="${m.nombre}">
      <div><b>${m.nombre}</b><small>${m.rol}</small></div></div>`).join('');
  app.innerHTML = `
    <div class="perfil-hero">
      <img src="assets/mascots/colmillo.png" alt="Colmillo">
      <h2>Tu progreso</h2>
      <p class="txt-mini">${s.perfilPais ? 'País: '+(NOMBRES_PAIS[s.perfilPais]||s.perfilPais) : 'Aprendiz de Colmillo'}</p>
    </div>
    <div class="perfil-stats">
      <div class="pstat">${svgIcon('flame',22)}<b>${s.racha}</b><small>Racha (días)</small></div>
      <div class="pstat">${svgIcon('zap',22)}<b>${s.xp}</b><small>XP total</small></div>
      <div class="pstat">${svgIcon('book',22)}<b>${hechas}/${totalLecc}</b><small>Lecciones</small></div>
      <div class="pstat">${svgIcon('repeat',22)}<b>${pendientes}</b><small>Para repasar</small></div>
    </div>
    <h3 style="margin:10px 0 6px">Tu equipo</h3>
    <div class="equipo">${equipo}</div>
    <button class="btn btn--fantasma mt" id="reset">Reiniciar mi progreso</button>`;
  document.getElementById('reset').onclick = ()=>{
    if(confirm('¿Borrar todo tu progreso?')){ estado.reset(); vistaPerfil(); }
  };
}

function vistaPanel(){
  chrome(true); marcarTab('#/panel');
  app.innerHTML = `
    <div class="panel-cta">
      <img src="assets/mascots/bauti.png" alt="Bauti">
      ${dialogo('bauti', 'Soy Bauti, tu analista de datos. Cuando termines el camino y tengas tu primer índice comprado, aquí conectas tu <b>Panel</b> para seguir tus inversiones de verdad.')}
      <button class="btn btn--azul mt" id="ir-panel">Abrir mi Panel ↗</button>
      <p class="aviso">Se desbloquea en la Unidad 7 (graduación). Por ahora es una vista previa.</p>
    </div>`;
  document.getElementById('ir-panel').onclick = ()=> window.open('https://panel-cartera.onrender.com','_blank');
}

function vistaOnboarding(){
  chrome(false);
  renderOnboarding(app, ()=>{ location.hash = '#/mapa'; router(); });
}

// ===== ROUTER =====
function router(){
  if(!estado.get().onboarding) return vistaOnboarding();
  const h = location.hash || '#/mapa';
  if(h.startsWith('#/leccion/')){
    const id = h.split('/')[2];
    let found=null, U=null;
    CURRICULUM.unidades.forEach(u=> u.lessons?.forEach(l=>{ if(l.id===id){found=l;U=u;} }));
    if(found) return lanzarLeccion(U, found);
    location.hash='#/mapa'; return;
  }
  if(h==='#/repaso') return lanzarRepaso();
  if(h==='#/perfil') return vistaPerfil();
  if(h==='#/panel')  return vistaPanel();
  return vistaMapa();
}

// tabs
tabbar.querySelectorAll('.tab').forEach(t=> t.onclick = ()=> location.hash = t.dataset.route);
window.addEventListener('hashchange', router);

// arranque
cargarContenido().then(()=>{
  pintarTopbar(estado.get());
  router();
}).catch(err=>{
  app.innerHTML = `<div class="centro mt"><h2>Ups</h2><p class="txt-mini">No se pudo cargar el contenido.<br>${err}</p></div>`;
});
