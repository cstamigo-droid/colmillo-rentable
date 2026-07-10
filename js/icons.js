// ===== Set de íconos propios (línea, estilo consistente) — reemplaza emojis genéricos =====
const ICONS = {
  // navegación
  map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z"/><path d="M9 3v16M15 5v16"/>',
  paw: '<ellipse cx="12" cy="16.5" rx="5" ry="4"/><circle cx="5" cy="9" r="2"/><circle cx="9.5" cy="4.5" r="2"/><circle cx="14.5" cy="4.5" r="2"/><circle cx="19" cy="9" r="2"/>',
  activity: '<rect x="4" y="10" width="4" height="10" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="16" y="13" width="4" height="7" rx="1"/>',

  // topbar
  flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-1 4-3 4-1-2 0-4-2-6-3 3-5 7-5 11 0 4 3 7 7 7Z"/>',
  zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6Z"/>',
  heart: '<path d="M12 21s-7-4.6-10-9C.5 8 2 4 6 4c2.2 0 3.7 1.3 6 4 2.3-2.7 3.8-4 6-4 4 0 5.5 4 4 8-3 4.4-10 9-10 9Z"/>',

  // estados de nodo
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  star: '<path d="M12 2l3 6.9 7 .9-5.1 5 1.2 7.2L12 18.6 5.9 22l1.2-7.2L2 9.8l7-.9Z"/>',

  // lecciones (mapa temático)
  seedling: '<path d="M12 21V12"/><path d="M12 12c0-4 2.5-7 7-7 0 4-2.5 7-7 7Z"/><path d="M12 12c0-3-2-5-6-5 0 3 2 5 6 5Z"/>',
  snowflake: '<path d="M12 2v20M5 5l14 14M19 5 5 19M8 3l4 3 4-3M8 21l4-3 4 3M3 8l3 4-3 4M21 8l-3 4 3 4"/>',
  medal: '<circle cx="12" cy="15" r="6"/><path d="m9 10-2-8M15 10l2-8"/><path d="M10 15.5 12 17l3-3.5"/>',
  meditation: '<circle cx="12" cy="6" r="2.2"/><path d="M6.5 20c0-4.5 2.5-7 5.5-7s5.5 2.5 5.5 7"/><path d="M3.5 15.5C6 17.5 8.5 18 12 18s6-.5 8.5-2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  book: '<path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H12v18H6.2A2.2 2.2 0 0 1 4 18.8Z"/><path d="M20 5.2A2.2 2.2 0 0 0 17.8 3H12v18h5.8a2.2 2.2 0 0 0 2.2-2.2Z"/>',
  cash: '<rect x="2.5" y="6.5" width="19" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 6.5v11M18 6.5v11"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5.5-5.5 2 2-5.5Z"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M6 5H4.5v1.5A3.5 3.5 0 0 0 8 10M18 5h1.5v1.5A3.5 3.5 0 0 1 16 10"/><path d="M10 15.5h4V18h-4Z"/><path d="M8 20h8"/>',
  repeat: '<path d="M4 7h12l-3-3M20 17H8l3 3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  trendDown: '<path d="m4 6 6.5 6.5 4-4L21 15"/><path d="M15 15h6v-6"/>',
  topHat: '<path d="M6.5 16h11l-1-7.5a4.5 4.5 0 0 0-9 0Z"/><path d="M4.5 18h15v2h-15Z"/>',
  cards: '<rect x="3.5" y="4" width="13" height="9.5" rx="1.3"/><rect x="7" y="8.2" width="13.5" height="9.5" rx="1.3"/>',
  film: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 4.5v15M17 4.5v15M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
  barChart: '<path d="M4 20V11M10 20V4M16 20v-6M2 20h20"/>',
  landmark: '<path d="M4 10h16M12 3l9 5H3Z"/><path d="M6 10v8M11 10v8M13 10v8M18 10v8"/><path d="M3 20h18"/>',
  scale: '<path d="M12 3v18M5 8l3.5-3 3.5 3M12.5 8l3.5-3 3.5 3"/><path d="M2 8a3.5 3.5 0 0 0 7 0M15 8a3.5 3.5 0 0 0 7 0"/>',
  dashboard: '<rect x="3" y="3" width="8" height="8" rx="1.3"/><rect x="13" y="3" width="8" height="5" rx="1.3"/><rect x="13" y="10" width="8" height="11" rx="1.3"/><rect x="3" y="13" width="8" height="8" rx="1.3"/>',
  gradCap: '<path d="M2 9 12 4l10 5-10 5Z"/><path d="M6 11.3v4.5c2 2 10 2 12 0v-4.5"/><path d="M22 9v6"/>',
};

const DEFAULT = 'book';

export function svgIcon(name, size = 26){
  const body = ICONS[name] || ICONS[DEFAULT];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
