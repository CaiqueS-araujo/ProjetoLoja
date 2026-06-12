import { useState } from "react";
import { useStore }  from "./hooks/useStore";
import { useToast }  from "./hooks/useToast";
import { Nav, BottomBar } from "./components/shared/Navigation";
import { PageHome }   from "./pages/PageHome";
import { PageBook }   from "./pages/PageBook";
import { PageSvcs }   from "./pages/PageSvcs";
import { PageAbout }  from "./pages/PageAbout";
import { PageAdmin, PageLogin } from "./pages/PageAdmin";
import { CSS, S }     from "./styles";
import { DEFAULT_THEME, DEFAULT_PROFILE } from "./constants";

export default function App() {
  const { st, upd, ready } = useStore();
  const { toast, toast_ }  = useToast();
  const [pg,   setPg] = useState("home");
  const [auth, setA]  = useState(false);

  if (!ready) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#faf8ff" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🌸</div>
        <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:"#9b7adb", fontSize:16 }}>Carregando...</p>
      </div>
    </div>
  );

  const T  = st.theme   || DEFAULT_THEME;
  const P  = st.profile || DEFAULT_PROFILE;
  const FF = T.font     || "'Trebuchet MS','Segoe UI',sans-serif";

  return (
    <div style={{ ...S.root, background:T.bg, fontFamily:FF }}>
      <style>{CSS + `* { font-family: ${FF}; }`}</style>

      {toast && (
        <div style={{ ...S.toast, background:toast.ok?"#1a6b3a":"#c0392b" }}>
          {toast.ok?"✓":"✕"} {toast.msg}
        </div>
      )}

      <Nav pg={pg} setPg={setPg} auth={auth} setA={setA} T={T} P={P} />

      <div style={S.body}>
        {pg==="home"    && <PageHome  st={st} setPg={setPg} T={T} P={P} />}
        {pg==="agendar" && <PageBook  st={st} upd={upd} toast_={toast_} T={T} P={P} />}
        {pg==="servicos"&& <PageSvcs  st={st} setPg={setPg} T={T} />}
        {pg==="sobre"   && <PageAbout P={P} T={T} setPg={setPg} />}
        {pg==="admin"   && (auth
          ? <PageAdmin st={st} upd={upd} toast_={toast_} T={T} P={P} />
          : <PageLogin setA={setA} T={T} />
        )}
      </div>

      <BottomBar pg={pg} setPg={setPg} T={T} />
    </div>
  );
}
