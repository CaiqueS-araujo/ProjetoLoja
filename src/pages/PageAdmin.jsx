import { useState } from "react";
import { S } from "../styles";
import { ADMIN_PW } from "../constants";
import { AAgenda }    from "../components/admin/AAgenda";
import { AHorarios }  from "../components/admin/AHorarios";
import { AServicos }  from "../components/admin/AServicos";
import { AFinance }   from "../components/admin/AFinance";
import { ATheme }     from "../components/admin/ATheme";
import { APerfil }    from "../components/admin/APerfil";
import { AMensagens } from "../components/admin/AMensagens";

const TABS = [
  { id:"agenda",     lb:"📋 Agenda"    },
  { id:"horarios",   lb:"📅 Horários"  },
  { id:"servicos",   lb:"💅 Serviços"  },
  { id:"financeiro", lb:"💰 Financeiro"},
  { id:"aparencia",  lb:"🎨 Aparência" },
  { id:"perfil",     lb:"👤 Perfil"    },
  { id:"mensagens",  lb:"💬 Mensagens" },
];

export function PageLogin({ setA, T }) {
  const [pw, setPw] = useState("");
  const [err, setE] = useState(false);
  const go = () => pw === ADMIN_PW ? setA(true) : setE(true);

  return (
    <div style={{ padding:"60px 24px 24px", maxWidth:360, margin:"0 auto", display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>
      <div style={{ fontSize:48 }}>🌸</div>
      <h2 style={{ fontFamily:"Georgia,serif", color:T.deep, margin:0, fontStyle:"italic" }}>Área Admin</h2>
      <p style={{ color:"#9a7060", fontSize:13, margin:0, textAlign:"center" }}>Acesso exclusivo — Anna Vieira</p>
      <input style={{ ...S.inp, maxWidth:280 }} type="password" placeholder="Senha" value={pw}
        onChange={e => { setPw(e.target.value); setE(false); }} onKeyDown={e => e.key==="Enter"&&go()} />
      {err && <p style={{ color:"#c0392b", fontSize:13, margin:0 }}>Senha incorreta.</p>}
      <button style={{ ...S.btnP, width:280, background:T.primary }} onClick={go}>Entrar</button>
    </div>
  );
}

export function PageAdmin({ st, upd, toast_, T, P }) {
  const [tab, setTab] = useState("agenda");

  return (
    <div className="pg">
      <div style={{ ...S.aTabBar, borderColor:T.border }}>
        {TABS.map(t => (
          <button key={t.id}
            style={{ ...S.aTab, ...(tab===t.id ? { color:T.primary, borderBottomColor:T.primary, fontWeight:700 } : {}) }}
            onClick={() => setTab(t.id)}
          >{t.lb}</button>
        ))}
      </div>
      <div style={{ padding:"16px 16px 80px" }}>
        {tab==="agenda"     && <AAgenda    st={st} upd={upd} toast_={toast_} T={T} />}
        {tab==="horarios"   && <AHorarios  st={st} upd={upd} T={T} />}
        {tab==="servicos"   && <AServicos  st={st} upd={upd} toast_={toast_} T={T} />}
        {tab==="financeiro" && <AFinance   st={st} upd={upd} T={T} />}
        {tab==="aparencia"  && <ATheme     st={st} upd={upd} toast_={toast_} T={T} />}
        {tab==="perfil"     && <APerfil    st={st} upd={upd} toast_={toast_} T={T} P={P} />}
        {tab==="mensagens"  && <AMensagens st={st} upd={upd} toast_={toast_} T={T} />}
      </div>
    </div>
  );
}
