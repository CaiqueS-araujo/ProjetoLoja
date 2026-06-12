export const uid    = () => Math.random().toString(36).slice(2, 9);
export const R$     = v  => new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(v);
export const pad    = n  => String(n).padStart(2, "0");
export const toKey  = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
export const fmtD   = iso => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
export const todayK = () => { const n = new Date(); return toKey(n.getFullYear(), n.getMonth(), n.getDate()); };
export const getDays = (y, m) => new Date(y, m + 1, 0).getDate();
export const getDow  = (y, m) => new Date(y, m, 1).getDay();

export function sendWA(phone, msg) {
  const n = phone.replace(/\D/g, "");
  const p = n.startsWith("55") ? n : "55" + n;
  window.open(`https://wa.me/${p}?text=${encodeURIComponent(msg)}`, "_blank");
}

export function copyText(txt) {
  navigator.clipboard?.writeText(txt).catch(() => {});
}

export function fillMsg(tpl, vars) {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, v || ""),
    tpl || ""
  );
}
