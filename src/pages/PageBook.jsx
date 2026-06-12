import { useState, useMemo } from "react";
import { Calendar } from "../components/shared/Calendar";
import { S } from "../styles";
import { R$, fmtD, todayK, toKey, uid, sendWA, copyText, fillMsg, pad } from "../utils";
import { WA_OWNER, DEFAULT_MSGS } from "../constants";

// slot "08:30" → minutos desde meia-noite
function toMin(slot) {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m;
}

function StepBar({ label, onBack, T }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0 0", gap:10 }}>
      <button style={{ ...S.backBtn, borderColor: T.border }} onClick={onBack}>← Voltar</button>
      {label && <span style={{ ...S.datePill, borderColor: T.border, color: T.deep }}>{label}</span>}
    </div>
  );
}

export function PageBook({ st, upd, toast_, T, P }) {
  const [step,     setStep]    = useState(1);
  const [date,     setDate]    = useState(null);
  const [slot,     setSlot]    = useState(null);
  const [svcId,    setSvcId]   = useState(null);
  const [form,     setForm]    = useState({ name:"", phone:"", notes:"" });
  const [pixCopied,setPixCopied] = useState(false);

  const now = new Date();
  const [cy, setCy] = useState(now.getFullYear());
  const [cm, setCm] = useState(now.getMonth());
  const todK    = todayK();
  const pixKey  = P.pixKey || "";
  const policy  = (P.policy || "").replace(/\\n/g, "\n");

  const bookedMap = useMemo(() => {
    const m = {};
    (st.bookings || []).forEach(b => { m[b.date] = (m[b.date] || 0) + 1; });
    return m;
  }, [st.bookings]);

  function dst(d) {
    const k = toKey(cy, cm, d);
    if ((st.blocked || []).includes(k)) return "blocked";
    if (k < todK) return "past";
    if ((st.slots[k] || []).length > 0) return "avail";
    return "off";
  }

  function confirm() {
    if (!form.name.trim() || !form.phone.trim()) { alert("Preencha nome e telefone."); return; }
    const sv    = st.svcs.find(x => x.id === svcId);
    const sinal = sv.price / 2;
    const bk = { id: uid(), date, slot, svcId, svcName:sv.name, svcPrice:sv.price, svcDiscount:0, ...form, createdAt:new Date().toISOString(), status:"confirmed" };
    const ns = { ...st.slots };
    ns[date] = (ns[date] || []).filter(x => x !== slot);
    if (!ns[date].length) delete ns[date];
    upd({ bookings: [...(st.bookings || []), bk], slots: ns });

    const vars = { nome:bk.name, telefone:bk.phone, data:fmtD(date), hora:slot, servico:sv.name, valor:R$(sv.price), sinal:R$(sinal), obs:bk.notes ? "📝 " + bk.notes : "" };
    sendWA(WA_OWNER, fillMsg((st.msgs || DEFAULT_MSGS).ownerNotify, vars));
    toast_("Agendado! Anna foi notificada 🌸");
    setStep(6);
  }

  const selSvc = st.svcs.find(x => x.id === svcId);
  const sinal  = selSvc ? selSvc.price / 2 : 0;

  // ─── Step 6: Confirmation ───────────────────────────────────────────────────
  if (step === 6) {
    const vars = { nome:form.name, data:fmtD(date), hora:slot, servico:selSvc?.name, valor:R$(selSvc?.price), sinal:R$(sinal), obs:form.notes ? "📝 " + form.notes : "" };
    const clientMsg = fillMsg((st.msgs || DEFAULT_MSGS).clientConfirm, vars);
    return (
      <div className="pg" style={{ padding:"28px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <div style={{ ...S.doneRing, background: `linear-gradient(135deg,${T.primary},${T.accent}99)` }}>✓</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:T.deep, fontSize:26, margin:0, fontStyle:"italic" }}>Confirmado!</h2>
        <p style={{ color:"#9a7060", margin:0, fontSize:14 }}>Seu horário está garantido 🌸</p>
        <div style={{ ...S.doneBox, width:"100%" }}>
          {[["📅 Data",fmtD(date)],["⏰ Horário",slot],["💅 Serviço",selSvc?.name],["💰 Valor total",R$(selSvc?.price)],["💳 Sinal (50%)",R$(sinal)]].map(([l, v]) => (
            <div key={l} style={S.dRow}>
              <span style={{ color:"#b09080", fontSize:13 }}>{l}</span>
              <span style={{ color:T.deep, fontWeight:700, fontSize:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:"#b09080", textAlign:"center" }}>✅ Anna foi notificada pelo WhatsApp</p>
        <button style={{ ...S.btnP, background:T.primary, width:"100%" }} onClick={() => sendWA(form.phone, clientMsg)}>
          💬 Receber confirmação no WhatsApp
        </button>
        <button
          style={{ ...S.btnOut, borderColor:T.primary, color:T.primary, width:"100%" }}
          onClick={() => { setStep(1); setDate(null); setSlot(null); setSvcId(null); setForm({ name:"", phone:"", notes:"" }); }}
        >Fazer novo agendamento</button>
      </div>
    );
  }

  return (
    <div className="pg">
      {/* Progress bar */}
      <div style={S.progress}>
        {["Data","Hora","Serviço","Dados","Pix"].map((l, i) => (
          <div key={l} style={{ ...S.pItem, ...(step === i+1 ? { color:T.primary, fontWeight:700 } : {}), ...(step > i+1 ? { color:"#1a6b3a" } : {}) }}>
            <div style={{ ...S.pCirc, ...(step === i+1 ? { background:T.primary, color:"#fff", borderColor:T.primary } : {}), ...(step > i+1 ? { background:"#1a6b3a", color:"#fff", borderColor:"#1a6b3a" } : {}) }}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span>{l}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Date */}
      {step === 1 && (
        <div className="fade" style={{ padding:"0 16px 20px" }}>
          <p style={S.hint}>Selecione um dia disponível.</p>
          <Calendar cy={cy} cm={cm} setCy={setCy} setCm={setCm} todK={todK} dst={dst} bookedMap={bookedMap} onSelect={k => { setDate(k); setStep(2); }} T={T} />
        </div>
      )}

      {/* Step 2: Slot */}
      {step === 2 && (
        <div className="fade" style={{ padding:"0 16px 20px" }}>
          <StepBar label={`📅 ${fmtD(date)}`} onBack={() => setStep(1)} T={T} />
          <p style={S.hint}>Escolha o horário:</p>
          {(() => {
            // Filtra slots ocupados por duração de agendamentos confirmados nesse dia
            const allSlots   = st.slots[date] || [];
            const confirmed  = (st.bookings || []).filter(b => b.date === date && b.status === "confirmed");
            const durBlocked = new Set();
            confirmed.forEach(b => {
              const svc = st.svcs.find(s => s.id === b.svcId || s.name === b.svcName);
              if (!svc?.dur) return;
              const startMin = toMin(b.slot), endMin = startMin + svc.dur;
              allSlots.forEach(sl => {
                const t = toMin(sl);
                if (t > startMin && t < endMin) durBlocked.add(sl);
              });
            });
            const freeSlots = allSlots.filter(sl => !durBlocked.has(sl));
            if (!freeSlots.length) return <div style={S.empty}>Nenhum horário disponível. Escolha outra data.</div>;
            return (
              <div style={S.slotsGrid}>
                {freeSlots.map(sl => (
                  <button key={sl}
                    style={{ ...S.slotB, ...(slot === sl ? { background:T.primary, borderColor:T.primary, color:"#fff" } : { borderColor:T.border }) }}
                    onClick={() => { setSlot(sl); setStep(3); }}
                  >{sl}</button>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Step 3: Service */}
      {step === 3 && (
        <div className="fade" style={{ padding:"0 16px 20px" }}>
          <StepBar label={`⏰ ${slot}`} onBack={() => setStep(2)} T={T} />
          <p style={S.hint}>Qual serviço você deseja?</p>
          {["cilios","sobrancelha"].map(cat => (
            <div key={cat}>
              <p style={S.catLbl}>{cat === "cilios" ? "👁 Cílios" : "✦ Sobrancelhas"}</p>
              {st.svcs.filter(x => x.cat === cat).map(sv => (
                <button key={sv.id}
                  style={{ ...S.svcRow, ...(svcId === sv.id ? { background:T.light, border:`1.5px solid ${T.primary}` } : { borderColor:T.border }) }}
                  onClick={() => { setSvcId(sv.id); setStep(4); }}
                >
                  <span style={{ ...S.svcDot, background: sv.color }} />
                  <div style={{ flex:1, textAlign:"left" }}>
                    <p style={{ ...S.svcRN, color: T.deep }}>{sv.name}</p>
                    <p style={S.svcRD}>⏱ {sv.dur}min</p>
                  </div>
                  <span style={{ ...S.svcRP, color: sv.color }}>{R$(sv.price)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Form */}
      {step === 4 && (
        <div className="fade" style={{ padding:"0 16px 20px" }}>
          <StepBar label="" onBack={() => setStep(3)} T={T} />
          <div style={S.summCard}>
            <p style={S.summTitle}>Resumo</p>
            {[["📅 Data",fmtD(date)],["⏰ Horário",slot],["💅 Serviço",selSvc?.name],["💰 Valor",R$(selSvc?.price)]].map(([l, v]) => (
              <div key={l} style={S.dRow}><span style={{ color:"#b09080", fontSize:13 }}>{l}</span><span style={{ color:T.deep, fontWeight:700, fontSize:13 }}>{v}</span></div>
            ))}
          </div>
          <div style={{ background:T.light, border:`1px solid ${T.border}`, borderRadius:14, padding:"14px 16px", margin:"12px 0", whiteSpace:"pre-line", fontSize:12.5, color:"#6a5060", lineHeight:1.7 }}>
            {policy}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:4 }}>
            {[["name","👤 Seu nome","text"],["phone","📞 WhatsApp","tel"]].map(([k, l, t]) => (
              <label key={k} style={S.lbl}>
                <span style={S.lblT}>{l}</span>
                <input style={S.inp} type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))} placeholder={l} />
              </label>
            ))}
            <label style={S.lbl}>
              <span style={S.lblT}>📝 Observações (opcional)</span>
              <textarea style={{ ...S.inp, height:72, resize:"vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))} placeholder="Alguma observação?" />
            </label>
            <button style={{ ...S.btnP, background:T.primary, marginTop:4 }}
              onClick={() => { if (!form.name.trim() || !form.phone.trim()) { alert("Preencha nome e telefone."); return; } setStep(5); }}>
              Próximo → Pagamento do Sinal
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Pix */}
      {step === 5 && (
        <div className="fade" style={{ padding:"0 16px 20px" }}>
          <StepBar label="" onBack={() => setStep(4)} T={T} />
          <div style={{ ...S.summCard, borderColor:T.border }}>
            <p style={S.summTitle}>💳 Pagamento do Sinal (50%)</p>
            <div style={S.dRow}><span style={{ color:"#b09080", fontSize:13 }}>Valor do serviço</span><span style={{ color:T.deep, fontWeight:700, fontSize:13 }}>{R$(selSvc?.price)}</span></div>
            <div style={S.dRow}><span style={{ color:"#b09080", fontSize:13 }}>Sinal a pagar agora</span><span style={{ color:"#1a6b3a", fontWeight:700, fontSize:16 }}>{R$(sinal)}</span></div>
          </div>
          <div style={{ background:T.light, border:`1.5px dashed ${T.primary}`, borderRadius:16, padding:"18px 16px", margin:"14px 0", textAlign:"center" }}>
            <p style={{ color:T.deep, fontWeight:700, fontSize:14, margin:"0 0 6px" }}>🔑 Chave Pix</p>
            <p style={{ color:"#6a5060", fontSize:12, margin:"0 0 12px" }}>Copie a chave e pague {R$(sinal)} no seu banco</p>
            <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", marginBottom:12, wordBreak:"break-all", fontSize:13, color:T.deep, fontWeight:600 }}>
              {pixKey}
            </div>
            <button style={{ ...S.btnP, background: pixCopied ? "#1a6b3a" : T.primary }}
              onClick={() => { copyText(pixKey); setPixCopied(true); setTimeout(() => setPixCopied(false), 3000); }}>
              {pixCopied ? "✓ Chave Copiada!" : "📋 Copiar Chave Pix"}
            </button>
          </div>
          <p style={{ textAlign:"center", color:"#9a7060", fontSize:13, lineHeight:1.6, margin:"0 0 14px" }}>
            Após realizar o Pix, clique em confirmar para enviar seu agendamento para a Anna 🌸
          </p>
          <button style={{ ...S.btnP, background:T.primary }} onClick={confirm}>
            ✓ Já Paguei — Confirmar Agendamento
          </button>
        </div>
      )}
    </div>
  );
}
