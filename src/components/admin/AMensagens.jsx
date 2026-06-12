import { useState } from "react";
import { S } from "../../styles";
import { DEFAULT_MSGS } from "../../constants";

const LABELS = {
  clientConfirm: "🌸 Confirmação para o Cliente",
  ownerNotify:   "📣 Notificação para Anna",
  reminder:      "⏰ Lembrete (manual)",
};
const VARS = {
  clientConfirm: "{nome} {data} {hora} {servico} {valor} {sinal} {obs}",
  ownerNotify:   "{nome} {telefone} {data} {hora} {servico} {valor} {sinal} {obs}",
  reminder:      "{nome} {data} {hora} {servico}",
};

export function AMensagens({ st, upd, toast_, T }) {
  const msgs = st.msgs || DEFAULT_MSGS;
  const [draft, setDraft] = useState({ ...msgs });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:T.light, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 14px", fontSize:12, color:"#7a6070", lineHeight:1.7 }}>
        <strong>Variáveis disponíveis:</strong> substitua no texto com chaves.<br/>
        Ex: <code style={{ background:"#fff", padding:"1px 5px", borderRadius:4 }}>{"{ nome }"}</code> vira o nome do cliente automaticamente.
      </div>
      {Object.keys(LABELS).map(key => (
        <div key={key} style={{ ...S.card_, borderColor:T.border }}>
          <p style={{ ...S.lblT, marginBottom:4, fontSize:12, color:T.deep }}>{LABELS[key]}</p>
          <p style={{ fontSize:11, color:"#9a8090", marginBottom:8 }}>Variáveis: <code>{VARS[key]}</code></p>
          <textarea style={{ ...S.inp, height:120, resize:"vertical", lineHeight:1.6 }}
            value={draft[key]||""} onChange={e => setDraft(d=>({...d,[key]:e.target.value}))} />
        </div>
      ))}
      <button style={{ ...S.btnP, background:T.primary }} onClick={() => { upd({msgs:{...draft}}); toast_("Mensagens salvas! ✓"); }}>
        💾 Salvar Mensagens
      </button>
    </div>
  );
}
