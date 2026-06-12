import { useState } from "react";
import { Calendar } from "../shared/Calendar";
import { S } from "../../styles";
import { toKey, todayK, fmtD } from "../../utils";

const PRESETS = {
  workday:  ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00"],
  morning:  ["08:00","09:00","10:00","11:00","12:00"],
  afternoon:["13:00","14:00","15:00","16:00","17:00","18:00"],
  halfhour: ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30"],
};

export function AHorarios({ st, upd, T }) {
  const now = new Date();
  const [cy, setCy] = useState(now.getFullYear());
  const [cm, setCm] = useState(now.getMonth());
  const [sel, setSel]     = useState(null);
  const [multiSel, setMS] = useState([]);
  const [mode, setMode]   = useState("single");
  const [newSlot, setNS]  = useState("09:00");
  const [multiPreset, setMP] = useState("workday");
  const [multiCustom, setMC] = useState("09:00");
  const todK = todayK();

  function dst(d) {
    const k = toKey(cy, cm, d);
    if ((st.blocked||[]).includes(k)) return "blocked";
    if ((st.slots[k]||[]).length > 0) return "avail";
    return "off";
  }

  const slots = sel ? (st.slots[sel]||[]) : [];

  const addSlot = () => {
    if (!sel||!newSlot) return;
    const cur = st.slots[sel]||[];
    if (cur.includes(newSlot)) return;
    upd({ slots: { ...st.slots, [sel]: [...cur, newSlot].sort() } });
  };

  const rmSlot = sl => {
    const ns = { ...st.slots };
    ns[sel] = (ns[sel]||[]).filter(x => x !== sl);
    if (!ns[sel].length) delete ns[sel];
    upd({ slots: ns });
  };

  const toggleBlock = () => {
    if (!sel) return;
    const b = (st.blocked||[]).includes(sel)
      ? (st.blocked||[]).filter(d => d !== sel)
      : [...(st.blocked||[]), sel];
    upd({ blocked: b });
  };

  const addWorkday = () => {
    if (!sel) return;
    const ws  = PRESETS.workday;
    const cur = st.slots[sel]||[];
    upd({ slots: { ...st.slots, [sel]: [...new Set([...cur,...ws])].sort() } });
  };

  const clearDay = () => {
    if (!sel) return;
    const ns = { ...st.slots };
    delete ns[sel];
    upd({ slots: ns });
  };

  function applyMulti(action) {
    if (!multiSel.length) return;
    let ns = { ...st.slots }, nb = [...(st.blocked||[])];
    if (action === "addPreset") {
      const ws = PRESETS[multiPreset]||PRESETS.workday;
      multiSel.forEach(k => { const cur = ns[k]||[]; ns[k]=[...new Set([...cur,...ws])].sort(); nb=nb.filter(x=>x!==k); });
    } else if (action === "addSlot") {
      multiSel.forEach(k => { const cur = ns[k]||[]; if (!cur.includes(multiCustom)) ns[k]=[...cur,multiCustom].sort(); });
    } else if (action === "block") {
      multiSel.forEach(k => { if (!nb.includes(k)) nb.push(k); delete ns[k]; });
    } else if (action === "unblock") {
      nb = nb.filter(k => !multiSel.includes(k));
    } else if (action === "clear") {
      multiSel.forEach(k => delete ns[k]);
    }
    upd({ slots: ns, blocked: nb });
    setMS([]);
  }

  const bookedMap = {};
  (st.bookings||[]).forEach(b => { bookedMap[b.date]=(bookedMap[b.date]||0)+1; });

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {[["single","📅 Dia único"],["multi","📅📅 Vários dias"]].map(([id,lb]) => (
          <button key={id}
            style={{ ...S.pill, ...(mode===id ? { background:T.primary, color:"#fff", borderColor:T.primary } : { borderColor:T.border }) }}
            onClick={() => { setMode(id); if(id==="multi") setSel(null); else setMS([]); }}
          >{lb}</button>
        ))}
      </div>

      <Calendar cy={cy} cm={cm} setCy={setCy} setCm={setCm}
        todK={todK} dst={dst} bookedMap={bookedMap}
        selDate={mode==="single" ? sel : undefined}
        T={T} adminMode
        multiSel={multiSel}
        onSelect={k => mode==="single" ? setSel(sel===k?null:k) : setMS(p => p.includes(k)?p.filter(x=>x!==k):[...p,k])}
      />

      {/* Multi-day panel */}
      {mode === "multi" && (
        <div style={{ marginTop:14 }}>
          {multiSel.length === 0
            ? <p style={{ color:"#9a7060", fontSize:13, fontStyle:"italic", textAlign:"center", padding:"10px 0" }}>Toque em vários dias para selecioná-los</p>
            : <>
                <p style={{ color:T.deep, fontWeight:700, fontSize:13, marginBottom:10 }}>{multiSel.length} dia{multiSel.length>1?"s":""} selecionado{multiSel.length>1?"s":""}</p>
                <label style={{ ...S.lbl, marginBottom:10 }}>
                  <span style={S.lblT}>Modelo de horários</span>
                  <select style={S.inp} value={multiPreset} onChange={e => setMP(e.target.value)}>
                    <option value="workday">Dia útil completo (8h–17h)</option>
                    <option value="morning">Só manhã (8h–12h)</option>
                    <option value="afternoon">Só tarde (13h–18h)</option>
                    <option value="halfhour">A cada 30min (9h–15h30)</option>
                  </select>
                </label>
                <button style={{ ...S.btnP, background:"#1a6b3a", marginBottom:8 }} onClick={() => applyMulti("addPreset")}>✅ Aplicar horários</button>
                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <input type="time" style={{ ...S.inp, flex:1 }} value={multiCustom} onChange={e => setMC(e.target.value)} />
                  <button style={{ ...S.btnP, padding:"12px 14px", background:T.primary }} onClick={() => applyMulti("addSlot")}>＋</button>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <button style={{ ...S.aBtn, background:"#fce8e8", color:"#c0392b", borderColor:"#f4c0c0" }} onClick={() => applyMulti("block")}>🔒 Bloquear</button>
                  <button style={{ ...S.aBtn, background:"#e8f5e9", color:"#1a6b3a", borderColor:"#b8e0b8" }} onClick={() => applyMulti("unblock")}>🔓 Desbloquear</button>
                  <button style={{ ...S.aBtn, borderColor:T.border }} onClick={() => applyMulti("clear")}>🗑 Limpar</button>
                  <button style={{ ...S.aBtn, borderColor:T.border }} onClick={() => setMS([])}>✕ Limpar seleção</button>
                </div>
              </>
          }
        </div>
      )}

      {/* Single-day panel */}
      {mode === "single" && sel && (
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <strong style={{ color:T.deep, fontSize:14 }}>📅 {fmtD(sel)}</strong>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <button style={{ ...S.pill, ...((st.blocked||[]).includes(sel)?{background:"#fce8e8",color:"#c0392b",borderColor:"#f4c0c0"}:{borderColor:T.border}) }} onClick={toggleBlock}>
                {(st.blocked||[]).includes(sel) ? "🔓 Desbloquear" : "🔒 Bloquear dia"}
              </button>
              <button style={{ ...S.pill, background:"#e8f5e9", color:"#1a6b3a", borderColor:"#b8e0b8" }} onClick={addWorkday}>＋ Dia padrão</button>
              {slots.length > 0 && <button style={{ ...S.pill, background:"#fce8e8", color:"#c0392b", borderColor:"#f4c0c0" }} onClick={clearDay}>🗑 Limpar</button>}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <input type="time" style={{ ...S.inp, flex:1 }} value={newSlot} onChange={e => setNS(e.target.value)} />
            <button style={{ ...S.btnP, padding:"12px 18px", background:T.primary }} onClick={addSlot}>＋</button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {slots.map(sl => (
              <div key={sl} style={{ ...S.slotChip, borderColor:T.border }}>
                <span>{sl}</span>
                <button style={{ background:"none", border:"none", color:"#c0392b", cursor:"pointer", fontSize:18, padding:"0 0 0 4px", lineHeight:1 }} onClick={() => rmSlot(sl)}>×</button>
              </div>
            ))}
            {!slots.length && <p style={{ color:"#c9b0a0", fontSize:13, fontStyle:"italic" }}>Nenhum horário.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
