import { useState } from "react";
import { ImageUploader } from "../shared/ImageUploader";
import { S } from "../../styles";

export function APerfil({ st, upd, toast_, T, P }) {
  const [draft, setDraft] = useState({ ...P });

  const save = () => {
    upd({ profile: { ...draft } });
    toast_("Perfil salvo! ✓");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* ── Hero photo ────────────────────────────────────────────────────── */}
      <p style={{ ...S.lblT, fontSize:13, color:T.deep, margin:0 }}>📸 Foto do Hero (página Início)</p>
      <ImageUploader
        currentUrl={draft.heroPhoto}
        
        onUploaded={url => setDraft(d => ({ ...d, heroPhoto: url }))}
        label="📱 Trocar foto do Hero"
        preview="square"
        T={T}
      />

      <label style={S.lbl}>
        <span style={S.lblT}>Modo do Hero</span>
        <select style={S.inp} value={draft.heroMode || "photo"} onChange={e => setDraft(d => ({ ...d, heroMode: e.target.value }))}>
          <option value="photo">Foto de fundo</option>
          <option value="gradient">Gradiente de cor</option>
        </select>
      </label>

      <label style={S.lbl}>
        <span style={S.lblT}>Título do Hero (use Enter para quebrar linha)</span>
        <textarea style={{ ...S.inp, height:60, resize:"vertical" }} value={draft.heroTitle || "Anna\nVieira"}
          onChange={e => setDraft(d => ({ ...d, heroTitle: e.target.value }))} />
      </label>

      <label style={S.lbl}>
        <span style={S.lblT}>Frase/Subtítulo do Hero</span>
        <input style={S.inp} value={draft.heroSubtitle || ""} onChange={e => setDraft(d => ({ ...d, heroSubtitle: e.target.value }))} />
      </label>

      <div style={{ height:1, background:T.border, margin:"4px 0" }} />

      {/* ── Profile photo ─────────────────────────────────────────────────── */}
      <p style={{ ...S.lblT, fontSize:13, color:T.deep, margin:0 }}>👤 Foto do Perfil (página Sobre)</p>
      <ImageUploader
        currentUrl={draft.aboutPhoto}
        
        onUploaded={url => setDraft(d => ({ ...d, aboutPhoto: url }))}
        label="📱 Trocar foto do Perfil"
        preview="circle"
        T={T}
      />

      {/* ── Text fields ───────────────────────────────────────────────────── */}
      {[
        ["name",      "Nome"],
        ["role",      "Cargo / Especialidade"],
        ["bio",       "Bio (texto sobre)"],
        ["instagram", "Instagram (sem @)"],
        ["address",   "Endereço do Studio"],
        ["pixKey",    "Chave Pix"],
      ].map(([k, l]) => (
        <label key={k} style={S.lbl}>
          <span style={S.lblT}>{l}</span>
          {k === "bio" || k === "address"
            ? <textarea style={{ ...S.inp, height:80, resize:"vertical" }} value={draft[k] || ""}
                onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))} />
            : <input style={S.inp} value={draft[k] || ""} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))} />
          }
        </label>
      ))}

      <label style={S.lbl}>
        <span style={S.lblT}>📌 Política de Agendamento</span>
        <textarea
          style={{ ...S.inp, height:140, resize:"vertical" }}
          value={(draft.policy || "").replace(/\\n/g, "\n")}
          onChange={e => setDraft(d => ({ ...d, policy: e.target.value.replace(/\n/g, "\\n") }))}
        />
      </label>

      <button style={{ ...S.btnP, background: T.primary }} onClick={save}>💾 Salvar Perfil</button>
    </div>
  );
}
