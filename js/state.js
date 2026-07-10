// ===== Estado del jugador (localStorage) =====
const KEY = 'colmillo.v1';

// Repaso espaciado (Leitner): al acertar sube de caja y se agenda más lejos;
// al fallar vuelve a la caja 0. Intervalos en días por caja.
const INTERVALOS = [1, 2, 4, 8, 16, 30];

const defecto = () => ({
  xp: 0,
  racha: 0,
  ultimoDia: null,          // 'YYYY-MM-DD' del último día jugado
  lecciones: {},            // { [leccionId]: 'completa' }
  review: {},               // { [itemId]: { box, due } }  due = número de día
  perfilPais: null,         // ej. 'CL' | 'AR' | 'PE' ...
  perfilObjetivo: null,     // 'pasivo' | 'aprender'
  perfilEdad: null,         // rango de edad (para horizonte) — se llena en #2
  onboarding: false,        // ya pasó el test de perfil
});

let S = cargar();

function cargar(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return defecto();
    return Object.assign(defecto(), JSON.parse(raw));
  }catch(e){ return defecto(); }
}
function guardar(){ localStorage.setItem(KEY, JSON.stringify(S)); emitir(); }

// --- fechas (runtime del navegador: new Date() está permitido aquí) ---
function hoyStr(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function hoyNum(){
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}
function diffDias(a, b){
  const [ay,am,ad] = a.split('-').map(Number);
  const [by,bm,bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by,bm-1,bd) - Date.UTC(ay,am-1,ad)) / 86400000);
}

// --- observadores (para refrescar la topbar) ---
const subs = new Set();
export function suscribir(fn){ subs.add(fn); return () => subs.delete(fn); }
function emitir(){ subs.forEach(fn => fn(S)); }

// ===== API pública =====
export const estado = {
  get(){ return S; },
  hoyNum,

  // marca actividad del día → gestiona la racha
  tocarDia(){
    const hoy = hoyStr();
    if(S.ultimoDia === hoy) return;
    if(S.ultimoDia && diffDias(S.ultimoDia, hoy) === 1) S.racha += 1;
    else if(!S.ultimoDia) S.racha = 1;
    else S.racha = 1; // se saltó ≥1 día: reinicia
    S.ultimoDia = hoy;
    guardar();
  },

  sumarXP(n){ S.xp += n; guardar(); },

  completarLeccion(id, xp){
    const nueva = !S.lecciones[id];
    S.lecciones[id] = 'completa';
    if(nueva) S.xp += (xp || 10);
    guardar();
    return nueva;
  },
  leccionCompleta(id){ return S.lecciones[id] === 'completa'; },

  // --- repaso espaciado ---
  // registra el resultado de un ítem evaluable y reprograma su próximo repaso
  programarRepaso(itemId, correct){
    const r = S.review[itemId] || { box: 0, due: 0 };
    if(correct){
      r.box = Math.min(r.box + 1, INTERVALOS.length);
      r.due = hoyNum() + INTERVALOS[Math.min(r.box - 1, INTERVALOS.length - 1)];
    } else {
      r.box = 0;
      r.due = hoyNum(); // vuelve a caer hoy
    }
    S.review[itemId] = r;
    guardar();
  },
  // ítems (de entre los existentes) que tocan repasar hoy o antes
  itemsDeRepaso(idsExistentes){
    const hoy = hoyNum();
    const set = idsExistentes ? new Set(idsExistentes) : null;
    return Object.keys(S.review).filter(id =>
      (!set || set.has(id)) && S.review[id].due <= hoy
    );
  },

  setPerfil(pais, objetivo, edad){
    S.perfilPais = pais; S.perfilObjetivo = objetivo;
    if(edad !== undefined) S.perfilEdad = edad;
    S.onboarding = true;
    guardar();
  },

  reset(){ S = defecto(); guardar(); },
};
