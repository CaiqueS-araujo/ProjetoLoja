import { db } from "./firebase";
import { ref, onValue, set, update } from "firebase/database";

const SK = "annavie_v6";

// Converte datas "2025-06-01" → "2025_06_01" para salvar no Firebase
// (Firebase não aceita "/" ou "-" como chave de objeto)
export function slotsToFB(slots) {
  const out = {};
  Object.entries(slots || {}).forEach(([d, t]) => {
    out[d.replace(/-/g, "_")] = Array.isArray(t) ? t : [];
  });
  return out;
}

export function slotsFromFB(fb) {
  const out = {};
  Object.entries(fb || {}).forEach(([k, t]) => {
    out[k.replace(/_/g, "-")] = t;
  });
  return out;
}

/**
 * Escuta mudanças em tempo real no banco e chama o callback com os dados.
 * Retorna a função de unsubscribe.
 */
export function subscribeToStore(callback) {
  const dbRef = ref(db, SK);
  return onValue(dbRef, (snap) => {
    callback(snap.val());
  });
}

export function initStore(initialData) {
  return set(ref(db, SK), {
    ...initialData,
    slots: slotsToFB(initialData.slots || {}),
  });
}

export function savePartial(partial) {
  const s = { ...partial };
  if (s.slots) s.slots = slotsToFB(s.slots);
  return update(ref(db, SK), s);
}
