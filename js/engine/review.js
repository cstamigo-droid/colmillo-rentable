// ===== Motor de repaso espaciado =====
// Indexa las preguntas evaluables del curriculum y arma la sesión de repaso diaria.
import { estado } from '../state.js';

const EVALUABLES = new Set(['quiz', 'vf', 'ordenar', 'slider']);
const MAX_REPASO = 12; // tope de preguntas por sesión de repaso

// itemId estable = "<leccionId>#<indiceCard>"
function indexar(curriculum){
  const idx = {}; // itemId -> { card, leccionId, mascota }
  curriculum.unidades.forEach(u => {
    (u.lessons || []).forEach(l => {
      (l.cards || []).forEach((card, i) => {
        if(EVALUABLES.has(card.tipo)){
          idx[`${l.id}#${i}`] = { card, leccionId: l.id, mascota: card.mascota || u.mascota || 'colmillo' };
        }
      });
    });
  });
  return idx;
}

// cuántas preguntas tocan repasar hoy
export function contarRepaso(curriculum){
  const idx = indexar(curriculum);
  return estado.itemsDeRepaso(Object.keys(idx)).length;
}

// arma las cards de la sesión de repaso (con su _itemId), priorizando lo más atrasado
export function cardsDeRepaso(curriculum){
  const idx = indexar(curriculum);
  const review = estado.get().review;
  const due = estado.itemsDeRepaso(Object.keys(idx));
  // prioridad: due más antiguo primero, luego caja más baja (menos consolidado)
  due.sort((a, b) => (review[a].due - review[b].due) || (review[a].box - review[b].box));
  return due.slice(0, MAX_REPASO).map(id => ({
    ...idx[id].card,
    _itemId: id,
    mascota: idx[id].card.mascota || idx[id].mascota,
  }));
}
