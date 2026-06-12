import { S } from "../styles";
import { WA_OWNER, INSTA } from "../constants";

export function PageAbout({ P, T, setPg }) {
  const policy = (P.policy || "").replace(/\\n/g, "\n");

  return (
    <div className="pg" style={{ paddingBottom: 80 }}>
      <div style={{ ...S.aboutHero, background: `linear-gradient(180deg,${T.primary}22 0%,${T.bg} 100%)` }}>
        {P.aboutPhoto
          ? <img src={P.aboutPhoto} alt={P.name} style={{ width:100, height:100, objectFit:"cover", borderRadius:"50%", border:`3px solid ${T.primary}`, marginBottom:12 }} onError={e => e.target.style.display="none"} />
          : <div style={{ ...S.aboutAv, background: `linear-gradient(135deg,${T.primary},${T.accent}99)` }}>✦</div>
        }
        <h2 style={{ ...S.aboutName, color: T.deep, fontFamily: "Georgia,serif" }}>{P.name || "Anna Vieira"}</h2>
        <p style={{ ...S.aboutRole, color: T.primary }}>{P.role || "Lash & Eyebrow Designer"}</p>
        <p style={S.aboutBio}>{P.bio || ""}</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
          <button style={{ ...S.btnP, padding:"12px 24px", background: T.primary }} onClick={() => setPg("agendar")}>📅 Agendar</button>
          <a href={`https://wa.me/${WA_OWNER}`} target="_blank" rel="noreferrer" style={{ ...S.btnWa, padding:"12px 24px" }}>💬 WhatsApp</a>
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        <a href={`https://instagram.com/${P.instagram || INSTA}`} target="_blank" rel="noreferrer" style={S.instaCard}>
          <div style={{ fontSize: 32 }}>📸</div>
          <div>
            <p style={{ margin:0, fontWeight:700, color:"#5a2060", fontSize:15 }}>@{P.instagram || INSTA}</p>
            <p style={{ margin:"2px 0 0", fontSize:12, color:"#9a6090" }}>Ver trabalhos no Instagram</p>
          </div>
          <span style={{ marginLeft:"auto", fontSize:22, color:"#c080c0" }}>→</span>
        </a>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(P.address || "")}`}
          target="_blank" rel="noreferrer"
          style={{ ...S.pillar, borderColor: T.border, textDecoration:"none", display:"flex", marginBottom:10 }}
        >
          <span style={{ fontSize:26, marginRight:12 }}>📍</span>
          <div>
            <p style={{ ...S.pillarT, color: T.deep }}>Endereço do Studio</p>
            <p style={{ ...S.pillarD, color: T.primary }}>{P.address || ""}</p>
          </div>
        </a>

        <div style={{ ...S.pillar, borderColor: T.border, marginBottom:10, flexDirection:"column", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:26 }}>📌</span>
            <p style={{ ...S.pillarT, color: T.deep, margin:0 }}>Política de Agendamento</p>
          </div>
          <p style={{ ...S.pillarD, whiteSpace:"pre-line", marginTop:8, lineHeight:1.8 }}>{policy}</p>
        </div>

        <div style={{ ...S.payBox, borderColor: T.border }}>
          <p style={{ ...S.payTitle, color: T.deep, fontFamily:"Georgia,serif" }}>💳 Formas de Pagamento</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
            {[["💵","Dinheiro"],["📱","Pix"],["💳","Crédito*"]].map(([ic,t]) => (
              <div key={t} style={{ ...S.payChip, borderColor: T.border }}>{ic} {t}</div>
            ))}
          </div>
          <p style={{ fontSize:11, color:"#b09080", margin:"8px 0 0", textAlign:"center" }}>*Crédito com acréscimo da maquininha</p>
        </div>
      </div>
    </div>
  );
}
