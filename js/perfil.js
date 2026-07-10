// ===== Personalización por etapa de vida =====
// El mismo curso NO le sirve igual a alguien de 17 que a alguien de 50.
// Lo que cambia: horizonte de tiempo, monto realista, tolerancia al riesgo, y el mensaje.
// (Todo esto se enseña como HEURÍSTICA educativa, nunca como asesoría personalizada.)
import { estado } from './state.js';

export const ETAPAS = [
  {
    id: 'menor', label: 'Menos de 18',
    horizonteCalc: 40, montoCalc: 5, pctAcciones: 90, legal: true,
    titulo: 'Tu superpoder es el TIEMPO',
    texto: 'Empezar tan joven es la mayor ventaja que existe: tienes <b>40 años o más</b> para que el interés compuesto haga su magia. No necesitas montos grandes — necesitas empezar y no parar.',
    riesgo: 'Como te sobra tiempo, una caída del mercado casi no te afecta: tienes décadas para recuperarte.',
    nota: 'Ojo: si eres menor de edad, en muchos países vas a necesitar abrir la cuenta junto a un adulto responsable (padre, madre o tutor). Es normal y legal.',
  },
  {
    id: 'joven', label: '18 – 29',
    horizonteCalc: 35, montoCalc: 10, pctAcciones: 85, legal: false,
    titulo: 'Décadas por delante',
    texto: 'Estás en el mejor momento para arrancar: mucho tiempo y, normalmente, pocas obligaciones. Aportes chicos y constantes <b>hoy</b> valen muchísimo mañana.',
    riesgo: 'Puedes aguantar los sustos del mercado sin drama: el tiempo juega a tu favor.',
    nota: null,
  },
  {
    id: 'construyendo', label: '30 – 44',
    horizonteCalc: 22, montoCalc: 25, pctAcciones: 72, legal: false,
    titulo: 'Etapa de construir en serio',
    texto: 'Probablemente ya tienes ingresos más estables. Es el momento de <b>subir el aporte</b> y ser muy constante — cada mes cuenta y todavía tienes buen horizonte.',
    riesgo: 'Aún tienes bastante tiempo por delante, así que las acciones siguen siendo tu motor principal.',
    nota: null,
  },
  {
    id: 'consolidando', label: '45 – 59',
    horizonteCalc: 12, montoCalc: 50, pctAcciones: 57, legal: false,
    titulo: 'Consolidar lo construido',
    texto: 'Sigues invirtiendo, pero con menos años por delante empiezas a <b>cuidar más los sustos grandes</b>: no querrás una caída fuerte justo antes de necesitar el dinero.',
    riesgo: 'Se suele bajar un poco el riesgo: menos montaña rusa a medida que se acerca la meta.',
    nota: null,
  },
  {
    id: 'preservando', label: '60 o más',
    horizonteCalc: 10, montoCalc: 50, pctAcciones: 45, legal: false,
    titulo: 'Proteger pesa tanto como crecer',
    texto: 'El foco cambia: cuidar lo que ya construiste importa tanto como seguir creciendo. Se prioriza <b>estabilidad</b> sobre grandes apuestas.',
    riesgo: 'Menos exposición a los vaivenes: proteger el capital pasa a primer plano.',
    nota: null,
  },
];

const POR_ID = Object.fromEntries(ETAPAS.map(e => [e.id, e]));

// etapa elegida en el onboarding (o 'joven' como neutro si falta)
export function etapaActual(){
  const id = estado.get().perfilEdad;
  return POR_ID[id] || null;
}

// valores para la calculadora, adaptados a la etapa (o null → usa defaults de la card)
export function calcPersonalizado(){
  const e = etapaActual();
  if(!e) return null;
  return { aporte: e.montoCalc, anios: e.horizonteCalc, tasa: 8, periodo: 'semana' };
}
