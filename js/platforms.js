// ===== Catálogo de plataformas (content/platforms.json) — carga una vez, cachea =====
let PLATAFORMAS = [];

export async function cargarPlataformas(){
  if(PLATAFORMAS.length) return PLATAFORMAS;
  const r = await fetch('content/platforms.json');
  const data = await r.json();
  PLATAFORMAS = data.plataformas || [];
  return PLATAFORMAS;
}

export function recomendarPlataforma(pais){
  if(!pais) return null;
  return PLATAFORMAS.find(p => p.paises.includes(pais)) || PLATAFORMAS.find(p => p.paises.includes('*'));
}

export function todasLasPlataformas(){
  return PLATAFORMAS;
}

export const NOMBRES_PAIS = {
  CL: 'Chile', AR: 'Argentina', PE: 'Perú', CO: 'Colombia',
  EC: 'Ecuador', MX: 'México', OTRO: 'tu país',
};
