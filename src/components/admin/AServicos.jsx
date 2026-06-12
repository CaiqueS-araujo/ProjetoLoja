import { useState, useRef } from "react";
import { ImageUploader } from "../shared/ImageUploader";
import { S } from "../../styles";
import { R$ } from "../../utils";

const EMPTY_SVC = { name:"", cat:"cilios", price:0, dur:60, color:"#9b7adb", desc:"", photo:"", maint:[] };

export function AServicos({ st, upd, toast_, T }) {
  const [form,     setForm]    = useState(EMPTY_SVC);
  const [editing,  setEditing] = useState(null);
  const [open,     setOpen]    = useState(false);

  const save_ = () => {
    if (!form.name.trim()) { alert("Nome obrigatório."); return; }
    if (editing !== null) upd({ svcs: st.svcs.map(s => s.id === editing ? { ...form, id: editing } : s) });
    else upd({ svcs: [...st.svcs, { ...form, id: Date.now() }] });
    setForm(EMPTY_SVC);
    setEditing(null);
    setOpen(false);
    toast_("Serviço salvo!");
  };

  const edit = s => {
    setForm({ name:s.name, cat:s.cat, price:s.price, dur:s.dur, color:s.color, desc:s.desc||"", photo:s.photo||"", maint:s.maint||[] });
    setEditing(s.id);
    setOpen(true);
  };

  const rm   = id => { if (confirm("Remover serviço?")) upd({ svcs: st.svcs.filter(x => x.id !== id) }); };
  const addM = ()     => setForm(f => ({ ...f, maint: [...f.maint, { l:"", p:0 }] }));
  const setM = (i,k,v) => setForm(f => ({ ...f, maint: f.maint.map((m,j) => j===i ? { ...m,[k]:v } : m) }));
  const rmM  = i     => setForm(f => ({ ...f, maint: f.maint.filter((_,j) => j !== i) }));

  return (
    <div>
      <button
        style={{ ...S.btnP, width:"100%", marginBottom:14, background:T.primary }}
        onClick={() => { setForm(EMPTY_SVC); setEditing(null); setOpen(true); }}
      >＋ Novo Serviço</button>

      {st.svcs.map(s => (
        <div key={s.id} style={{ ...S.bk, borderColor:T.border, borderLeftColor:s.color, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", flex:1 }}>
              {s.photo && <img src={s.photo} alt="" style={{ width:48, height:48, objectFit:"cover", borderRadius:8, flexShrink:0 }} onError={e => e.target.style.display="none"} />}
              <div>
                <p style={{ ...S.bkName, color:T.deep, margin:0 }}>{s.name}</p>
                <p style={{ ...S.bkInfo, margin:"2px 0 0" }}>{R$(s.price)} · {s.dur}min</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <button style={{ ...S.aBtn, borderColor:T.border }} onClick={() => edit(s)}>✏️</button>
              <button style={{ ...S.aBtn, background:"#fce8e8", color:"#c0392b", borderColor:"#f4c0c0" }} onClick={() => rm(s.id)}>🗑</button>
            </div>
          </div>
        </div>
      ))}

      {open && (
        <div style={S.mdBg} onClick={() => setOpen(false)}>
          <div style={{ ...S.md, maxHeight:"92vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <button style={S.mdX} onClick={() => setOpen(false)}>✕</button>
            <h3 style={{ color:T.deep, fontFamily:"Georgia,serif", margin:"0 0 16px", fontStyle:"italic" }}>
              {editing ? "✏️ Editar" : "＋ Novo"} Serviço
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[["name","Nome","text"],["price","Preço (R$)","number"],["dur","Duração (min)","number"]].map(([k,l,t]) => (
                <label key={k} style={S.lbl}>
                  <span style={S.lblT}>{l}</span>
                  <input style={S.inp} type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: t==="number" ? Number(e.target.value) : e.target.value }))} />
                </label>
              ))}

              <label style={S.lbl}>
                <span style={S.lblT}>Categoria</span>
                <select style={S.inp} value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                  <option value="cilios">Cílios</option>
                  <option value="sobrancelha">Sobrancelha</option>
                </select>
              </label>

              <label style={S.lbl}>
                <span style={S.lblT}>Descrição</span>
                <textarea style={{ ...S.inp, height:70, resize:"vertical" }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
              </label>

              {/* ── Photo upload via Firebase Storage ── */}
              <div>
                <span style={S.lblT}>📸 Foto do Serviço</span>
                <div style={{ marginTop:6 }}>
                  <ImageUploader
                    currentUrl={form.photo}
                    
                    onUploaded={url => setForm(f => ({ ...f, photo: url }))}
                    label="📱 Escolher foto (qualquer tamanho)"
                    preview="square"
                    T={T}
                  />
                </div>
              </div>

              <label style={S.lbl}>
                <span style={S.lblT}>Cor do card</span>
                <input type="color" style={{ ...S.inp, height:44, padding:4 }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
              </label>

              <div>
                <p style={{ ...S.lblT, marginBottom:8 }}>Manutenções</p>
                {form.maint.map((m, i) => (
                  <div key={i} style={{ display:"flex", gap:6, marginBottom:6 }}>
                    <input style={{ ...S.inp, flex:2 }} placeholder="Ex: 15 dias" value={m.l} onChange={e => setM(i, "l", e.target.value)} />
                    <input type="number" style={{ ...S.inp, flex:1 }} placeholder="R$" value={m.p} onChange={e => setM(i, "p", Number(e.target.value))} />
                    <button style={{ background:"none", border:"none", color:"#c0392b", cursor:"pointer", fontSize:20 }} onClick={() => rmM(i)}>×</button>
                  </div>
                ))}
                <button style={{ ...S.pill, borderColor:T.border }} onClick={addM}>＋ Manutenção</button>
              </div>

              <button style={{ ...S.btnP, marginTop:4, background:T.primary }} onClick={save_}>
                {editing ? "💾 Salvar" : "＋ Adicionar Serviço"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
