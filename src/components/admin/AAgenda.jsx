import { useState, useMemo } from "react";
import { S } from "../../styles";
import { R$, fmtD, sendWA, fillMsg, toKey, getDays, getDow, todayK, pad } from "../../utils";
import { DEFAULT_MSGS, WDAYS, MFULL } from "../../constants";

// ─── Helpers de horário ────────────────────────────────────────────────────────
// "08:30" → minutos desde meia-noite
function toMin(slot) {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m;
}
// minutos → "08:30"
function fromMin(min) {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

/**
 * Dado um agendamento confirmado (slot + duracao em min),
 * retorna todos os slots que ficam "ocupados" por esse serviço,
 * ou seja, qualquer horário que começaria dentro da janela [start, start+dur).
 */
function occupiedSlots(startSlot, durMin, allSlots) {
  const start = toMin(startSlot);
  const end   = start + durMin;
  return allSlots.filter(sl => {
    const t = toMin(sl);
    return t > start && t < end; // o slot de início já está ocupado pelo agendamento em si
  });
}

// ─── Calendário visual da Agenda ──────────────────────────────────────────────
function AgendaCalendar({ cy, cm, setCy, setCm, dayInfo, onSelect, selDate, T }) {
  const dN = getDays(cy, cm);
  const oN = getDow(cy, cm);
  const todK = todayK();

  return (
    <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.border}`, padding: 14, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          style={{ background: T.light, border: `1px solid ${T.border}`, width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: T.deep }}
          onClick={() => cm === 0 ? (setCy(y => y - 1), setCm(11)) : setCm(m => m - 1)}
        >‹</button>
        <span style={{ fontFamily: "Georgia,serif", fontSize: 16, fontStyle: "italic", fontWeight: 700, color: T.deep }}>
          {MFULL[cm]} {cy}
        </span>
        <button
          style={{ background: T.light, border: `1px solid ${T.border}`, width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: T.deep }}
          onClick={() => cm === 11 ? (setCy(y => y + 1), setCm(0)) : setCm(m => m + 1)}
        >›</button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {WDAYS.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 9.5, color: "#9a7060", fontWeight: 700, paddingBottom: 6, letterSpacing: .5 }}>{d}</div>
        ))}
        {Array.from({ length: oN }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length: dN }).map((_, i) => {
          const d   = i + 1;
          const k   = toKey(cy, cm, d);
          const info = dayInfo[k] || { type: "empty" };
          const isToday = k === todK;
          const isSel   = selDate === k;

          // Cores por tipo
          let bg = "transparent", color = "#ccc", border = "1px solid transparent", fw = 400;
          if (info.type === "blocked") {
            bg = "#fce8e8"; color = "#d08080"; border = `1px solid #f4c0c0`;
          } else if (info.type === "booked_full") {
            bg = "#e8f0fe"; color = "#3a5ab8"; border = `1px solid #a0b8f0`; fw = 700;
          } else if (info.type === "partial") {
            bg = `${T.primary}15`; color = T.deep; border = `1px solid ${T.primary}88`; fw = 700;
          } else if (info.type === "free") {
            bg = `${T.primary}22`; color = T.deep; border = `1px solid ${T.primary}`; fw = 700;
          }
          if (isToday)  border = `2.5px solid ${T.deep}`;
          if (isSel)    bg = T.primary; color = "#fff"; border = `2px solid ${T.primary}`;

          return (
            <button key={d}
              onClick={() => onSelect(k)}
              style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 12, background: bg, color: isSel ? "#fff" : color, border, fontWeight: fw, cursor: "pointer", position: "relative", gap: 1, padding: 0 }}
            >
              <span>{d}</span>
              {/* Bolinhas de status */}
              {info.type !== "empty" && info.type !== "blocked" && (
                <div style={{ display: "flex", gap: 2 }}>
                  {info.booked > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? "#fff" : "#3a5ab8", display: "inline-block" }} />}
                  {info.free   > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? "#ffffffaa" : T.primary, display: "inline-block" }} />}
                </div>
              )}
              {info.type === "blocked" && (
                <span style={{ fontSize: 7, color: isSel ? "#fff" : "#d08080" }}>🔒</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        {[
          [T.primary, "Com horários livres"],
          ["#3a5ab8",  "Totalmente ocupado"],
          ["#d08080",  "Bloqueado"],
          ["#ccc",     "Sem horários"],
        ].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#9a7060" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block" }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Painel de detalhes do dia selecionado ────────────────────────────────────
function DayDetail({ date, st, T }) {
  if (!date) return null;

  const slots    = st.slots[date] || [];
  const blocked  = (st.blocked || []).includes(date);
  const bookings = (st.bookings || []).filter(b => b.date === date && b.status === "confirmed");

  // Monta mapa: slot → agendamento
  const bookedSlotMap = {};
  bookings.forEach(b => { bookedSlotMap[b.slot] = b; });

  // Slots bloqueados por duração
  const durationBlocked = new Set();
  bookings.forEach(b => {
    const svc = st.svcs.find(s => s.id === b.svcId || s.name === b.svcName);
    if (!svc || !svc.dur) return;
    const blocked = occupiedSlots(b.slot, svc.dur, slots);
    blocked.forEach(sl => durationBlocked.add(sl));
  });

  // Todos os horários do dia (originais + os já tomados mas que foram removidos da lista)
  // Reconstruímos a timeline completa: slots livres + slots agendados + slots bloqueados por dur
  const allInDay = [...new Set([
    ...slots,
    ...bookings.map(b => b.slot),
    ...[...durationBlocked],
  ])].sort();

  if (blocked) {
    return (
      <div style={{ background: "#fce8e8", border: "1px solid #f4c0c0", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#c0392b", fontSize: 14 }}>🔒 Dia bloqueado</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a07070" }}>{fmtD(date)}</p>
      </div>
    );
  }

  if (!allInDay.length) {
    return (
      <div style={{ background: T.light, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontWeight: 700, color: T.deep, fontSize: 14 }}>📅 {fmtD(date)}</p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9a7060" }}>Nenhum horário cadastrado para este dia.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700, color: T.deep, fontSize: 14, fontFamily: "Georgia,serif", fontStyle: "italic" }}>
        📅 {fmtD(date)} — {bookings.length} agendamento{bookings.length !== 1 ? "s" : ""}
      </p>

      {/* Timeline de slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {allInDay.map(sl => {
          const booking = bookedSlotMap[sl];
          const isDurBlocked = durationBlocked.has(sl) && !booking;
          const isFree = !booking && !isDurBlocked && slots.includes(sl);

          if (booking) {
            const svc = st.svcs.find(s => s.id === booking.svcId || s.name === booking.svcName);
            return (
              <div key={sl} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#e8f0fe", border: "1px solid #a0b8f0", borderRadius: 10, padding: "9px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3a5ab8", minWidth: 36, flexShrink: 0 }}>{sl}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#1a2a6a", fontSize: 13 }}>{booking.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#5070b0" }}>
                    💅 {booking.svcName}
                    {svc && ` · ⏱ ${svc.dur}min`}
                    {svc && ` · até ~${fromMin(toMin(sl) + svc.dur)}`}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#5070b0" }}>📞 {booking.phone} · {R$(booking.svcFinal ?? booking.svcPrice)}</p>
                </div>
                <span style={{ fontSize: 10, background: "#1a6b3a22", color: "#1a6b3a", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>✓ OK</span>
              </div>
            );
          }

          if (isDurBlocked) {
            // Acha qual agendamento causou o bloqueio
            const cause = bookings.find(b => {
              const svc = st.svcs.find(s => s.id === b.svcId || s.name === b.svcName);
              if (!svc) return false;
              const start = toMin(b.slot), end = start + svc.dur, t = toMin(sl);
              return t > start && t < end;
            });
            return (
              <div key={sl} style={{ display: "flex", gap: 10, alignItems: "center", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#b07000", minWidth: 36, flexShrink: 0 }}>{sl}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#7a5000" }}>
                    ⏳ Bloqueado — em andamento: <strong>{cause?.svcName}</strong>
                    {cause && ` (${cause.name})`}
                  </p>
                </div>
                <span style={{ fontSize: 10, background: "#fff3cd", color: "#b07000", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>⏳ ocup.</span>
              </div>
            );
          }

          if (isFree) {
            return (
              <div key={sl} style={{ display: "flex", gap: 10, alignItems: "center", background: `${T.primary}10`, border: `1px solid ${T.primary}44`, borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.primary, minWidth: 36, flexShrink: 0 }}>{sl}</span>
                <p style={{ margin: 0, fontSize: 12, color: T.primary + "bb" }}>Horário livre</p>
                <span style={{ marginLeft: "auto", fontSize: 10, background: `${T.primary}22`, color: T.primary, padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>livre</span>
              </div>
            );
          }

          // Slot que estava no mapa mas foi removido (agendado e slot excluído)
          return null;
        })}
      </div>

      {/* Resumo */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {[
          [`${bookings.length} agendado${bookings.length !== 1 ? "s" : ""}`, "#3a5ab8", "#e8f0fe"],
          [`${[...durationBlocked].length} bloq. duração`, "#b07000", "#fff8e1"],
          [`${slots.length - bookings.length - [...durationBlocked].filter(sl => !bookedSlotMap[sl]).length} livre${slots.length !== 1 ? "s" : ""}`, T.primary, `${T.primary}15`],
        ].map(([txt, c, bg]) => (
          <span key={txt} style={{ fontSize: 11, background: bg, color: c, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{txt}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal AAgenda ──────────────────────────────────────────────
export function AAgenda({ st, upd, toast_, T }) {
  const now = new Date();
  const [cy, setCy]     = useState(now.getFullYear());
  const [cm, setCm]     = useState(now.getMonth());
  const [selDate, setSelDate] = useState(todayK());
  const [filter, setFilter]  = useState("confirmed");
  const [editId, setEditId]  = useState(null);
  const [editD,  setEditD]   = useState(null);
  const [msgM,   setMsgM]    = useState(null);

  // ── Calcula info de cada dia para o calendário visual ──────────────────────
  const dayInfo = useMemo(() => {
    const info = {};

    // Dias bloqueados
    (st.blocked || []).forEach(d => { info[d] = { type: "blocked", booked: 0, free: 0 }; });

    // Dias com slots
    Object.entries(st.slots || {}).forEach(([date, slots]) => {
      if (info[date]?.type === "blocked") return;
      const bookings = (st.bookings || []).filter(b => b.date === date && b.status === "confirmed");

      // Quantos slots estão ocupados por duração
      const durationBlocked = new Set();
      bookings.forEach(b => {
        const svc = st.svcs.find(s => s.id === b.svcId || s.name === b.svcName);
        if (!svc?.dur) return;
        occupiedSlots(b.slot, svc.dur, slots).forEach(sl => durationBlocked.add(sl));
      });

      const booked  = bookings.length;
      const blocked_ = [...durationBlocked].filter(sl => !bookings.some(b => b.slot === sl)).length;
      const free    = Math.max(0, slots.length - booked - blocked_);

      info[date] = {
        type:   booked > 0 && free === 0 ? "booked_full" : booked > 0 ? "partial" : "free",
        booked, free,
      };
    });

    // Dias só com agendamentos (sem slot livre remanescente)
    (st.bookings || []).filter(b => b.status === "confirmed").forEach(b => {
      if (!info[b.date]) info[b.date] = { type: "booked_full", booked: 1, free: 0 };
    });

    return info;
  }, [st.slots, st.blocked, st.bookings, st.svcs]);

  // ── Lista de agendamentos filtrada ─────────────────────────────────────────
  const list = useMemo(() =>
    [...(st.bookings || [])]
      .filter(b => filter === "all" || b.status === filter)
      .sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot)),
    [st.bookings, filter]
  );

  // ── Agendamentos do dia selecionado ────────────────────────────────────────
  const dayBookings = useMemo(() =>
    (st.bookings || []).filter(b => b.date === selDate && b.status === "confirmed"),
    [st.bookings, selDate]
  );

  function startEdit(b) {
    setEditId(b.id);
    setEditD({ svcName: b.svcName, svcPrice: b.svcPrice, svcDiscount: b.svcDiscount || 0, slot: b.slot, notes: b.notes || "", status: b.status });
  }

  function saveEdit() {
    const disc = Number(editD.svcDiscount) || 0;
    upd({ bookings: (st.bookings || []).map(b => b.id === editId ? { ...b, ...editD, svcDiscount: disc, svcFinal: editD.svcPrice - disc } : b) });
    setEditId(null); setEditD(null);
    toast_("Agendamento atualizado!");
  }

  function cancel(id) {
    const b  = (st.bookings || []).find(x => x.id === id);
    const ns = { ...st.slots };
    ns[b.date] = [...(ns[b.date] || []), b.slot].sort();
    upd({ bookings: (st.bookings || []).map(x => x.id === id ? { ...x, status: "cancelled" } : x), slots: ns });
    toast_("Cancelado e horário liberado.");
  }

  function openMsg(b) {
    const msgs  = st.msgs || DEFAULT_MSGS;
    const final = b.svcFinal !== undefined ? b.svcFinal : b.svcPrice - (b.svcDiscount || 0);
    const vars  = { nome: b.name, telefone: b.phone, data: fmtD(b.date), hora: b.slot, servico: b.svcName, valor: R$(final), sinal: R$(final / 2), obs: b.notes ? "📝 " + b.notes : "" };
    setMsgM({ phone: b.phone, msg: fillMsg(msgs.reminder, vars), name: b.name });
  }

  const confirmedCount  = (st.bookings || []).filter(b => b.status === "confirmed").length;
  const totalCount      = (st.bookings || []).length;

  return (
    <div>
      {/* ── Calendário visual ──────────────────────────────────────────────── */}
      <AgendaCalendar
        cy={cy} cm={cm} setCy={setCy} setCm={setCm}
        dayInfo={dayInfo} onSelect={setSelDate} selDate={selDate} T={T}
      />

      {/* ── Detalhe do dia clicado ─────────────────────────────────────────── */}
      <DayDetail date={selDate} st={st} T={T} />

      {/* ── Seção: lista de agendamentos ───────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, marginTop: 4 }}>
        <p style={{ margin: 0, fontWeight: 700, color: T.deep, fontSize: 14, fontFamily: "Georgia,serif", fontStyle: "italic" }}>
          Todos os Agendamentos
        </p>
        <span style={{ fontSize: 11, color: "#9a7060" }}>{confirmedCount} confirmados · {totalCount} total</span>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {[["confirmed", "✓ Confirmados", "#1a6b3a"], ["cancelled", "✕ Cancelados", "#c0392b"], ["all", "Todos", "#7a6060"]].map(([v, l, c]) => (
          <button key={v}
            style={{ ...S.pill, ...(filter === v ? { background: c, color: "#fff", borderColor: c } : { borderColor: T.border }) }}
            onClick={() => setFilter(v)}
          >{l}</button>
        ))}
      </div>

      {!list.length && <div style={S.empty}>Nenhum agendamento.</div>}

      {list.map(b => {
        const svc   = st.svcs.find(s => s.id === b.svcId || s.name === b.svcName);
        const final = b.svcFinal !== undefined ? b.svcFinal : b.svcPrice - (b.svcDiscount || 0);

        return (
          <div key={b.id} style={{ ...S.bk, borderColor: T.border, ...(b.status === "cancelled" ? { opacity: .5 } : {}), ...(b.date === selDate ? { borderLeftColor: T.primary, borderLeftWidth: 4 } : {}) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ ...S.bkName, color: T.deep }}>{b.name}</p>
                <p style={S.bkInfo}>📅 {fmtD(b.date)} · ⏰ {b.slot}{svc ? ` → ~${fromMin(toMin(b.slot) + svc.dur)}` : ""}</p>
                <p style={S.bkInfo}>💅 {b.svcName}{svc ? ` · ⏱ ${svc.dur}min` : ""}</p>
                <p style={S.bkInfo}>💰 {b.svcDiscount > 0
                  ? <><s style={{ color: "#b09080" }}>{R$(b.svcPrice)}</s>{" → "}<strong style={{ color: "#1a6b3a" }}>{R$(final)}</strong></>
                  : R$(final)
                }</p>
                <p style={S.bkInfo}>📞 {b.phone}</p>
                {b.notes && <p style={S.bkInfo}>📝 {b.notes}</p>}
              </div>
              <span style={{ ...S.badge, ...(b.status === "confirmed" ? { background: "#e8f5e9", color: "#1a6b3a" } : { background: "#fce8e8", color: "#c0392b" }) }}>
                {b.status === "confirmed" ? "✓ OK" : "✕"}
              </span>
            </div>

            {/* Inline edit */}
            {editId === b.id && editD && (
              <div style={{ background: T.light, borderRadius: 12, padding: 14, marginTop: 12, border: `1px solid ${T.border}` }}>
                <p style={{ fontWeight: 700, color: T.deep, margin: "0 0 10px", fontSize: 13 }}>✏️ Editar</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={S.lbl}>
                    <span style={S.lblT}>Serviço</span>
                    <select style={S.inp} value={editD.svcName} onChange={e => {
                      const sv = st.svcs.find(x => x.name === e.target.value);
                      setEditD(d => ({ ...d, svcName: e.target.value, svcPrice: sv ? sv.price : d.svcPrice }));
                    }}>{st.svcs.map(sv => <option key={sv.id}>{sv.name}</option>)}</select>
                  </label>
                  {[["Valor", "svcPrice", "number"], ["Desconto (R$)", "svcDiscount", "number"], ["Horário", "slot", "time"]].map(([l, k, t]) => (
                    <label key={k} style={S.lbl}>
                      <span style={S.lblT}>{l}</span>
                      <input style={S.inp} type={t} value={editD[k]} onChange={e => setEditD(d => ({ ...d, [k]: t === "number" ? Number(e.target.value) : e.target.value }))} />
                    </label>
                  ))}
                  <label style={S.lbl}>
                    <span style={S.lblT}>Observações</span>
                    <textarea style={{ ...S.inp, height: 60, resize: "vertical" }} value={editD.notes} onChange={e => setEditD(d => ({ ...d, notes: e.target.value }))} />
                  </label>
                  <label style={S.lbl}>
                    <span style={S.lblT}>Status</span>
                    <select style={S.inp} value={editD.status} onChange={e => setEditD(d => ({ ...d, status: e.target.value }))}>
                      <option value="confirmed">Confirmado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...S.btnP, flex: 1, padding: "10px 0", background: T.primary }} onClick={saveEdit}>💾 Salvar</button>
                    <button style={{ ...S.btnOut, flex: 1, padding: "10px 0", borderColor: T.primary, color: T.primary }} onClick={() => { setEditId(null); setEditD(null); }}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {b.status === "confirmed" && editId !== b.id && (
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <button style={{ ...S.aBtn, borderColor: T.border }} onClick={() => { startEdit(b); }}>✏️ Editar</button>
                <button style={{ ...S.aBtn, borderColor: T.border }} onClick={() => openMsg(b)}>💬 Lembrete</button>
                <button style={{ ...S.aBtn, borderColor: T.border }} onClick={() => setSelDate(b.date)}>📅 Ver dia</button>
                <button style={{ ...S.aBtn, background: "#fce8e8", color: "#c0392b", borderColor: "#f4c0c0" }} onClick={() => cancel(b.id)}>✕ Cancelar</button>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal lembrete */}
      {msgM && (
        <div style={S.mdBg} onClick={() => setMsgM(null)}>
          <div style={S.md} onClick={e => e.stopPropagation()}>
            <button style={S.mdX} onClick={() => setMsgM(null)}>✕</button>
            <h3 style={{ color: T.deep, fontFamily: "Georgia,serif", margin: "0 0 4px", fontStyle: "italic" }}>💬 Lembrete para {msgM.name}</h3>
            <textarea style={{ ...S.inp, height: 220, resize: "vertical", lineHeight: 1.6 }}
              value={msgM.msg} onChange={e => setMsgM(m => ({ ...m, msg: e.target.value }))} />
            <button style={{ ...S.btnWa, width: "100%", marginTop: 12, display: "block", textAlign: "center" }}
              onClick={() => { sendWA(msgM.phone, msgM.msg); setMsgM(null); }}>
              💬 Enviar pelo WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
