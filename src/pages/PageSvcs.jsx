import { useState } from "react";
import { S } from "../styles";
import { R$ } from "../utils";
import { WA_OWNER } from "../constants";

export function PageSvcs({ st, setPg, T }) {
  const [cat, setCat] = useState("cilios");
  const [sel, setSel] = useState(null);

  return (
    <div className="pg">
      <div style={S.catTabs}>
        {[["cilios","👁 Cílios"],["sobrancelha","✦ Sobrancelhas"]].map(([id,lb]) => (
          <button key={id}
            style={{ ...S.catB, ...(cat === id ? { background: T.primary, color:"#fff", borderColor: T.primary } : { borderColor: T.border, color:"#9a7060" }) }}
            onClick={() => setCat(id)}
          >{lb}</button>
        ))}
      </div>

      <div style={{ padding:"8px 16px 80px" }}>
        {st.svcs.filter(s => s.cat === cat).map(sv => (
          <div key={sv.id} style={{ ...S.sCard, borderLeftColor: sv.color, borderColor: T.border }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              {sv.photo && <img src={sv.photo} alt="" style={S.sCardImg} onError={e => e.target.style.display="none"} />}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <p style={{ ...S.sCardN, color: T.deep }}>{sv.name}</p>
                  <span style={{ ...S.sCardP, color: sv.color }}>{R$(sv.price)}</span>
                </div>
                <p style={S.sCardD}>{sv.desc}</p>
                <p style={S.sCardDur}>⏱ {sv.dur} min</p>
                {sv.maint?.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                    {sv.maint.map((m, i) => (
                      <span key={i} style={{ ...S.chip, borderColor: sv.color, color: sv.color }}>{m.l} · {R$(m.p)}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button
                style={{ ...S.btnP, flex:1, padding:"10px 0", fontSize:13, background: T.primary }}
                onClick={() => setPg("agendar")}
              >📅 Agendar</button>
              <a
                href={`https://wa.me/${WA_OWNER}?text=${encodeURIComponent("Olá Anna! Interesse em: " + sv.name + " — " + R$(sv.price))}`}
                target="_blank" rel="noreferrer"
                style={{ ...S.btnWa, flex:1, padding:"10px 0", fontSize:13, textAlign:"center" }}
              >💬 WhatsApp</a>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div style={S.mdBg} onClick={() => setSel(null)}>
          <div style={S.md} onClick={e => e.stopPropagation()}>
            <button style={S.mdX} onClick={() => setSel(null)}>✕</button>
            {sel.photo && <img src={sel.photo} alt="" style={{ width:"100%", height:200, objectFit:"cover", borderRadius:12, marginBottom:14 }} onError={e => e.target.style.display="none"} />}
            <p style={{ ...S.sCardN, fontSize:20, color: T.deep }}>{sel.name}</p>
            <p style={{ color:"#9a7060", fontSize:14, lineHeight:1.6, margin:"4px 0 12px" }}>{sel.desc}</p>
            <div style={{ display:"flex", gap:16, marginBottom:10 }}>
              <span style={{ ...S.sCardP, color: sel.color, fontSize:22 }}>{R$(sel.price)}</span>
              <span style={S.sCardDur}>⏱ {sel.dur}min</span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...S.btnP, flex:1, background: T.primary }} onClick={() => { setSel(null); setPg("agendar"); }}>📅 Agendar</button>
              <a href={`https://wa.me/${WA_OWNER}?text=${encodeURIComponent("Olá! Tenho interesse em " + sel.name)}`}
                target="_blank" rel="noreferrer" style={{ ...S.btnWa, flex:1, textAlign:"center" }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
