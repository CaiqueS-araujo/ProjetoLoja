import { S } from "../styles";
import { R$, todayK } from "../utils";

export function PageHome({ st, setPg, T, P }) {
  const avail = Object.keys(st.slots || {}).filter(
    k => (st.slots[k] || []).length > 0 && k >= todayK()
  ).length;

  const isPhoto = P.heroMode === "photo" && P.heroPhoto;
  const heroStyle = isPhoto
    ? { backgroundImage: `url(${P.heroPhoto})`, backgroundSize: "cover", backgroundPosition: "center top" }
    : { background: `linear-gradient(155deg,${T.deep} 0%,${T.accent} 50%,${T.primary} 100%)` };

  return (
    <div className="pg">
      <div style={{ ...S.hero, ...heroStyle }}>
        {isPhoto && (
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(20,10,40,.35) 0%, rgba(20,10,40,.7) 100%)" }} />
        )}
        <div style={S.heroContent}>
          <div style={{ ...S.heroTag, background: `${T.primary}33`, borderColor: `${T.primary}66` }}>
            ✦ Designer de Cílios & Sobrancelhas
          </div>
          <h1 style={S.heroH1}>
            {(P.heroTitle || "Anna\nVieira").split("\n").map((l, i) => (
              <span key={i}>
                {i === 1 ? <span style={S.heroScript}>{l}</span> : l}<br />
              </span>
            ))}
          </h1>
          <p style={S.heroQ}>{P.heroSubtitle || '"Um olhar pode dizer tudo"'}</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button
              style={{ ...S.btnP, background: T.primary, boxShadow: `0 4px 18px ${T.primary}55` }}
              onClick={() => setPg("agendar")}
            >📅 Agendar Agora</button>
            <button style={S.heroBtnO} onClick={() => setPg("servicos")}>Ver Serviços</button>
          </div>
          {avail > 0 && (
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 12, margin: "10px 0 0" }}>
              ✅ {avail} dia{avail > 1 ? "s" : ""} disponíve{avail > 1 ? "is" : "l"} esta semana
            </p>
          )}
        </div>
      </div>

      <div style={S.feats}>
        {[
          { ic:"👁", t:"Extensão de Cílios",  d:"Fio a fio profissional"   },
          { ic:"✦", t:"Design Sobrancelhas",  d:"Análise facial exclusiva" },
          { ic:"💖", t:"Resultado Natural",    d:"Beleza que cuida de você" },
        ].map(({ ic, t, d }) => (
          <div key={t} style={{ ...S.feat, background: T.light, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 22 }}>{ic}</span>
            <p style={{ ...S.featT, color: T.deep }}>{t}</p>
            <p style={S.featD}>{d}</p>
          </div>
        ))}
      </div>

      <div style={S.section}>
        <div style={S.sHead}>
          <p style={{ ...S.sTitle, color: T.deep, fontFamily: "Georgia,serif" }}>Em Destaque</p>
          <button style={{ ...S.sMore, color: T.primary }} onClick={() => setPg("servicos")}>ver todos →</button>
        </div>
        <div className="no-scroll" style={S.hScroll}>
          {st.svcs.slice(0, 6).map(sv => (
            <div key={sv.id} style={{ ...S.hCard, borderTopColor: sv.color, borderColor: T.border }}>
              {sv.photo
                ? <img src={sv.photo} alt={sv.name} style={S.hCardImg} onError={e => e.target.style.display = "none"} />
                : <div style={{ ...S.hCardImg, background: `${sv.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>👁</div>
              }
              <div style={S.hCardBody}>
                <p style={{ ...S.hCardCat, color: sv.color + "bb" }}>{sv.cat === "cilios" ? "Cílios" : "Sobrancelha"}</p>
                <p style={{ ...S.hCardName, color: T.deep }}>{sv.name}</p>
                <p style={{ ...S.hCardPrice, color: sv.color }}>{R$(sv.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.ctaStrip, background: T.deep }}>
        <p style={S.ctaT}>Pronta para um novo olhar?</p>
        <p style={S.ctaS}>Agende com Anna e se apaixone pelo resultado ✨</p>
        <button style={{ ...S.btnP, background: T.primary }} onClick={() => setPg("agendar")}>
          Agendar Meu Horário
        </button>
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}
