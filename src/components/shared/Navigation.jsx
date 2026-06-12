import { S } from "../../styles";

export function Nav({ pg, setPg, auth, setA, T, P }) {
  return (
    <header style={{ ...S.nav, background: `${T.bg}f5`, borderColor: T.border }}>
      <button style={S.navLogo} onClick={() => setPg("home")}>
        <span style={{ ...S.navName, color: T.deep, fontFamily: "Georgia,serif" }}>
          {P.name || "Anna Vieira"}
        </span>
        <span style={{ ...S.navRole, color: T.primary + "bb" }}>
          {P.role || "Lash & Brow Designer"} ✦
        </span>
      </button>
      <button
        style={S.navAdminBtn}
        onClick={() => { setPg("admin"); if (pg !== "admin") setA(false); }}
      >
        {auth ? "⚙" : "🔐"}
      </button>
    </header>
  );
}

export function BottomBar({ pg, setPg, T }) {
  const items = [
    { id: "home",     ic: "🏠", lb: "Início"   },
    { id: "agendar",  ic: "📅", lb: "Agendar"  },
    { id: "servicos", ic: "✨", lb: "Serviços" },
    { id: "sobre",    ic: "💌", lb: "Sobre"    },
  ];

  return (
    <nav style={{ ...S.bar, borderColor: T.border, background: `${T.bg}fa` }}>
      {items.map(it => (
        <button
          key={it.id}
          style={{ ...S.barBtn, ...(pg === it.id ? { color: T.primary } : { color: "#9a7060" }) }}
          onClick={() => setPg(it.id)}
        >
          <span style={S.barIc}>{it.ic}</span>
          <span style={{ fontSize: 9.5, letterSpacing: .5 }}>{it.lb}</span>
          {pg === it.id && <span style={{ ...S.barDot, background: T.primary }} />}
        </button>
      ))}
    </nav>
  );
}
