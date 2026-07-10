// ===== Las 4 mascotas =====
export const MASCOTAS = {
  colmillo: {
    nombre: 'Colmillo',
    img: 'assets/mascots/colmillo.png',
    rol: 'Mentor — temple y paciencia',
    color: '#58cc02',
  },
  lauta: {
    nombre: 'Lauta',
    img: 'assets/mascots/lauta.png',
    rol: 'El Profesor — conceptos claros',
    color: '#1cb0f6',
  },
  bauti: {
    nombre: 'Bauti',
    img: 'assets/mascots/bauti.png',
    rol: 'Analista de datos — tu Panel',
    color: '#ce82ff',
  },
  cadete: {
    nombre: 'Cadete',
    img: 'assets/mascots/cadete.png',
    rol: 'Narrador — la verdad sin humo',
    color: '#ffc800',
  },
};

// Frases de aliento (por resultado) — voz de Colmillo por defecto
export const ALIENTO = {
  ok: [
    '¡Eso, campeón! Vas con colmillo. 🦷',
    'Bien jugado. El que entiende, no entra en pánico.',
    '¡Correcto! Así se construye, ladrillo a ladrillo.',
    'Perfecto. Paciencia + método = interés compuesto.',
  ],
  mal: [
    'Tranquilo. Equivocarse es parte de aprender.',
    'No pasa nada, campeón. Miremos por qué.',
    'Casi. Respira y volvemos a intentar.',
    'El que se apura, pierde. Vamos de nuevo.',
  ],
};

// Devuelve el HTML de un diálogo mascota (retrato + globo)
export function dialogo(mascotaId, texto){
  const m = MASCOTAS[mascotaId] || MASCOTAS.colmillo;
  return `<div class="dialogo">
    <img src="${m.img}" alt="${m.nombre}" />
    <div class="globo">${texto}</div>
  </div>`;
}

export function fraseAleatoria(tipo){
  const arr = ALIENTO[tipo] || ALIENTO.ok;
  return arr[Math.floor(Math.random() * arr.length)];
}
