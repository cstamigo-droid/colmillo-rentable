// ===== Caricaturas originales (SVG flat) de los maestros + póster de la peli =====
// Ilustraciones propias (no fotos con derechos). Estilo cartoon cálido, medallón con aro dorado.

function medallon(inner){
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="retrato-svg">
    <defs><clipPath id="cm"><circle cx="60" cy="60" r="55"/></clipPath></defs>
    <circle cx="60" cy="60" r="57" fill="#14201a" stroke="#d4af37" stroke-width="3"/>
    <g clip-path="url(#cm)">${inner}</g>
  </svg>`;
}

const PIEL = '#e9c6a2', PIEL_S = '#c99a6e', BLANCO_PELO = '#eef0ea';

// --- Warren Buffett: calvo con canas a los lados, lentes grandes, sonrisa cálida ---
const BUFFETT = medallon(`
  <path d="M12,120 Q12,82 60,82 Q108,82 108,120 Z" fill="#2c3440"/>
  <path d="M50,82 L60,99 L70,82 Z" fill="#efe9d9"/>
  <path d="M57,84 L63,84 L61,106 L59,106 Z" fill="#8f2f2f"/>
  <rect x="53" y="66" width="14" height="16" fill="${PIEL_S}"/>
  <circle cx="37" cy="52" r="4.5" fill="${PIEL}"/><circle cx="83" cy="52" r="4.5" fill="${PIEL}"/>
  <ellipse cx="60" cy="49" rx="23" ry="25" fill="${PIEL}"/>
  <path d="M38,42 Q40,27 60,27 Q80,27 82,42 Q76,33 60,32 Q44,33 38,42 Z" fill="${BLANCO_PELO}"/>
  <path d="M37,44 Q34,58 40,64 L41,46 Z" fill="${BLANCO_PELO}"/>
  <path d="M83,44 Q86,58 80,64 L79,46 Z" fill="${BLANCO_PELO}"/>
  <g fill="none" stroke="#43423f" stroke-width="2.3">
    <rect x="40" y="45" width="16" height="13" rx="6"/>
    <rect x="64" y="45" width="16" height="13" rx="6"/>
    <path d="M56,51 L64,51"/>
  </g>
  <circle cx="48" cy="52" r="1.8" fill="#3c2f26"/><circle cx="72" cy="52" r="1.8" fill="#3c2f26"/>
  <path d="M60,53 L58,60 L62,60" fill="none" stroke="${PIEL_S}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M50,66 Q60,74 70,66" fill="none" stroke="#9a5f3a" stroke-width="2.4" stroke-linecap="round"/>
`);

// --- John Bogle: cabello cano peinado, lentes, mirada serena ---
const BOGLE = medallon(`
  <path d="M12,120 Q12,82 60,82 Q108,82 108,120 Z" fill="#33405a"/>
  <path d="M50,82 L60,99 L70,82 Z" fill="#efe9d9"/>
  <path d="M57,84 L63,84 L61,106 L59,106 Z" fill="#4a5a7a"/>
  <rect x="53" y="66" width="14" height="16" fill="${PIEL_S}"/>
  <circle cx="37" cy="52" r="4.5" fill="${PIEL}"/><circle cx="83" cy="52" r="4.5" fill="${PIEL}"/>
  <ellipse cx="60" cy="49" rx="23" ry="25" fill="${PIEL}"/>
  <path d="M36,46 Q34,26 60,25 Q86,26 84,46 Q82,34 74,32 Q68,29 60,29 Q52,29 46,32 Q38,34 36,46 Z" fill="${BLANCO_PELO}"/>
  <g fill="none" stroke="#43423f" stroke-width="2.2">
    <rect x="41" y="46" width="15" height="12" rx="3"/>
    <rect x="64" y="46" width="15" height="12" rx="3"/>
    <path d="M56,52 L64,52"/>
  </g>
  <circle cx="48.5" cy="52" r="1.8" fill="#3c2f26"/><circle cx="71.5" cy="52" r="1.8" fill="#3c2f26"/>
  <path d="M60,54 L58,60 L62,60" fill="none" stroke="${PIEL_S}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M52,67 Q60,72 68,67" fill="none" stroke="#9a5f3a" stroke-width="2.2" stroke-linecap="round"/>
`);

// --- Michael Burry: joven, pelo castaño despeinado, sin lentes, mirada intensa, camiseta ---
const BURRY = medallon(`
  <path d="M12,120 Q12,84 60,84 Q108,84 108,120 Z" fill="#48525c"/>
  <path d="M48,84 Q60,95 72,84" fill="none" stroke="#333b42" stroke-width="3"/>
  <rect x="53" y="68" width="14" height="16" fill="${PIEL_S}"/>
  <circle cx="37" cy="53" r="4.5" fill="${PIEL}"/><circle cx="83" cy="53" r="4.5" fill="${PIEL}"/>
  <ellipse cx="60" cy="50" rx="23" ry="25" fill="${PIEL}"/>
  <path d="M35,50 Q32,24 60,23 Q88,24 85,50 Q81,34 73,35 Q78,26 66,30 Q70,22 58,28 Q53,22 49,32 Q43,29 45,37 Q39,33 39,46 Z" fill="#6b4f37"/>
  <path d="M46,49 Q50,47 55,49" fill="none" stroke="#4a382a" stroke-width="2" stroke-linecap="round"/>
  <path d="M65,49 Q70,47 74,49" fill="none" stroke="#4a382a" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="50" cy="54" rx="3.2" ry="3.6" fill="#fff"/><circle cx="50" cy="54.5" r="1.9" fill="#3c2f26"/>
  <ellipse cx="70" cy="54" rx="3.2" ry="3.6" fill="#fff"/><circle cx="70" cy="54.5" r="1.9" fill="#3c2f26"/>
  <path d="M60,56 L58,62 L62,62" fill="none" stroke="${PIEL_S}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M53,69 Q60,71 67,69" fill="none" stroke="#9a5f3a" stroke-width="2.2" stroke-linecap="round"/>
`);

export const PORTRAITS = { buffett: BUFFETT, bogle: BOGLE, burry: BURRY };

// --- Póster original de "The Big Short" (arte propio: gráfico que se desploma) ---
export function posterBigShort(){
  return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" class="poster-svg">
    <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a2430"/><stop offset="1" stop-color="#0d1118"/></linearGradient></defs>
    <rect width="120" height="150" rx="8" fill="url(#pg)"/>
    <g opacity="0.25" stroke="#3a4553" stroke-width="1">
      <path d="M0,40 H120 M0,70 H120 M0,100 H120"/>
    </g>
    <polyline points="8,34 24,30 40,44 56,40 72,66 88,88 104,120 112,132"
      fill="none" stroke="#e0625f" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M112,132 l-9,-3 l6,-7 Z" fill="#e0625f"/>
    <g fill="#3a4553" opacity="0.5">
      <rect x="10" y="120" width="8" height="22"/><rect x="22" y="112" width="8" height="30"/>
      <rect x="34" y="124" width="8" height="18"/><rect x="90" y="116" width="8" height="26"/>
    </g>
  </svg>`;
}
