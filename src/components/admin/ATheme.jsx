import { useState } from "react";
import { S } from "../../styles";
import { THEME_PRESETS, FONT_OPTIONS } from "../../constants";

export function ATheme({ st, upd, toast_, T }) {
  const [draft, setDraft] = useState({ ...T });

  const applyPreset = p => { const nd={...draft,...p}; setDraft(nd); upd({theme:nd}); toast_("Tema aplicado!"); };
  const applyDraft  = () => { upd({theme:{...draft}}); toast_("Cores salvas! ✓"); };

  const colorFields = [
    {k:"primary",l:"Cor principal (botões)"},
    {k:"deep",   l:"Títulos e texto"},
    {k:"accent", l:"Cor secundária"},
    {k:"bg",     l:"Fundo da página"},
    {k:"light",  l:"Fundo dos cards"},
    {k:"border", l:"Bordas"},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <p style={{ ...S.lblT, marginBottom:10 }}>🎨 Temas prontos</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {THEME_PRESETS.map(p => (
            <button key={p.name} style={{ background:p.bg, border:`2px solid ${p.primary}`, borderRadius:12, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:T.primary===p.primary?"0 0 0 3px "+p.primary+"66":"none" }} onClick={() => applyPreset(p)}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:p.primary, flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:600, color:p.deep, textAlign:"left", lineHeight:1.3 }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...S.card_, borderColor:T.border }}>
        <p style={{ ...S.lblT, marginBottom:10 }}>🔤 Fonte</p>
        {FONT_OPTIONS.map(f => (
          <button key={f.val} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 12px", marginBottom:6, borderRadius:10, border:`1.5px solid ${draft.font===f.val?T.primary:T.border}`, background:draft.font===f.val?T.light:"#fff", cursor:"pointer", fontFamily:f.val, fontSize:13, color:T.deep }}
            onClick={() => setDraft(d=>({...d,font:f.val}))}>
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ ...S.card_, borderColor:T.border }}>
        <p style={{ ...S.lblT, marginBottom:12 }}>🖌 Cores personalizadas</p>
        {colorFields.map(({k,l}) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <input type="color" value={draft[k]||"#ffffff"} onChange={e => setDraft(d=>({...d,[k]:e.target.value}))} style={{ width:44, height:44, borderRadius:8, border:`1px solid ${T.border}`, padding:2, cursor:"pointer", flexShrink:0 }} />
            <div>
              <p style={{ margin:0, fontSize:13, fontWeight:600, color:T.deep }}>{l}</p>
              <p style={{ margin:0, fontSize:11, color:"#9a7060" }}>{draft[k]}</p>
            </div>
          </div>
        ))}
        <button style={{ ...S.btnP, background:T.primary }} onClick={applyDraft}>✓ Aplicar cores</button>
      </div>

      <div style={{ ...S.card_, borderColor:T.border }}>
        <p style={{ ...S.lblT, marginBottom:10 }}>👁 Pré-visualização</p>
        <div style={{ background:draft.bg, borderRadius:12, padding:14, border:`1px solid ${draft.border}`, fontFamily:draft.font }}>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:draft.deep, fontSize:18, margin:"0 0 8px" }}>Anna Vieira</p>
          <button style={{ background:draft.primary, color:"#fff", border:"none", borderRadius:20, padding:"8px 18px", fontSize:13, fontWeight:700, marginRight:8 }}>Agendar</button>
          <div style={{ background:draft.light, border:`1px solid ${draft.border}`, borderRadius:8, padding:"8px 12px", marginTop:10 }}>
            <span style={{ color:draft.deep, fontSize:13 }}>Campo de exemplo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
