import { useState } from "react";
import { S } from "../../styles";
import { R$, uid, todayK, fmtD } from "../../utils";
import { MSHORT } from "../../constants";

export function AFinance({ st, upd, T }) {
  const now = new Date(), cm = now.getMonth(), cy = now.getFullYear();
  const [newExp, setNE] = useState({ desc:"", value:0, date:todayK() });

  const conf  = (st.bookings||[]).filter(b => b.status==="confirmed");
  const mConf = conf.filter(b => { const [y,m]=b.date.split("-"); return Number(y)===cy&&Number(m)-1===cm; });
  const revenue  = mConf.reduce((s,b) => s+(b.svcFinal!==undefined?b.svcFinal:b.svcPrice-(b.svcDiscount||0)),0);
  const expenses = (st.expenses||[]).filter(e => { const [y,m]=e.date.split("-"); return Number(y)===cy&&Number(m)-1===cm; }).reduce((s,e)=>s+Number(e.value),0);
  const profit   = revenue - expenses;
  const pct      = Math.min(100, Math.round((revenue/(st.goals?.monthly||1))*100));

  const last6 = Array.from({length:6}).map((_,i) => {
    const d = new Date(cy,cm-(5-i),1); const y=d.getFullYear(),mo=d.getMonth();
    const r = conf.filter(b => { const [by,bm]=b.date.split("-"); return Number(by)===y&&Number(bm)-1===mo; }).reduce((s,b)=>s+(b.svcFinal!==undefined?b.svcFinal:b.svcPrice-(b.svcDiscount||0)),0);
    return { lb:MSHORT[mo], r };
  });
  const maxR = Math.max(...last6.map(l=>l.r),1);

  const topSvcs = {};
  mConf.forEach(b => { topSvcs[b.svcName]=(topSvcs[b.svcName]||0)+(b.svcFinal!==undefined?b.svcFinal:b.svcPrice-(b.svcDiscount||0)); });
  const top = Object.entries(topSvcs).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={S.kpiGrid}>
        {[[revenue,"Receita","#1a6b3a"],[expenses,"Despesas","#c0392b"],[profit,"Lucro",profit>=0?"#1a4a8a":"#c0392b"],[mConf.length+" clts","Este Mês","#7a2090"]].map(([v,l,c],i) => (
          <div key={i} style={{ ...S.kpi, borderColor:T.border }}>
            <p style={{ margin:0, fontSize:10, color:"#9a7060", textTransform:"uppercase", letterSpacing:.5 }}>{l}</p>
            <p style={{ margin:"4px 0 0", fontSize:typeof v==="string"?16:18, fontWeight:700, color:c }}>{typeof v==="number"?R$(v):v}</p>
          </div>
        ))}
      </div>

      <div style={{ ...S.card_, borderColor:T.border }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:"#9a7060", fontSize:13 }}>Meta: {R$(st.goals?.monthly||0)}</span>
          <span style={{ color:pct>=100?"#1a6b3a":T.primary, fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ background:T.light, borderRadius:20, height:10, overflow:"hidden" }}>
          <div style={{ background:`linear-gradient(90deg,${T.primary},${T.accent})`, height:"100%", width:`${pct}%`, borderRadius:20, transition:"width .6s" }} />
        </div>
        <label style={{ ...S.lbl, marginTop:10, flexDirection:"row", alignItems:"center", gap:10 }}>
          <span style={{ ...S.lblT, whiteSpace:"nowrap" }}>Meta:</span>
          <input type="number" style={{ ...S.inp, flex:1 }} value={st.goals?.monthly||0} onChange={e => upd({ goals:{ ...st.goals, monthly:Number(e.target.value) } })} />
        </label>
      </div>

      <div style={{ ...S.card_, borderColor:T.border }}>
        <p style={{ margin:"0 0 14px", fontStyle:"italic", color:T.deep, fontSize:14 }}>Receita — últimos 6 meses</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:90 }}>
          {last6.map((l,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", background:`linear-gradient(180deg,${T.primary},${T.accent}88)`, borderRadius:4, minHeight:4, height:`${Math.round((l.r/maxR)*82)+4}px`, transition:"height .6s" }} title={R$(l.r)} />
              <span style={{ fontSize:10, color:"#a08070" }}>{l.lb}</span>
            </div>
          ))}
        </div>
      </div>

      {top.length > 0 && (
        <div style={{ ...S.card_, borderColor:T.border }}>
          <p style={{ margin:"0 0 10px", fontStyle:"italic", color:T.deep, fontSize:14 }}>Top Serviços</p>
          {top.map(([n,v]) => (
            <div key={n} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:13, color:T.deep }}>{n}</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.primary }}>{R$(v)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...S.card_, borderColor:T.border }}>
        <p style={{ margin:"0 0 10px", fontStyle:"italic", color:T.deep, fontSize:14 }}>Despesas</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          <input style={{ ...S.inp, flex:"2 1 110px" }} placeholder="Descrição" value={newExp.desc} onChange={e => setNE(x=>({...x,desc:e.target.value}))} />
          <input type="number" style={{ ...S.inp, flex:"1 1 70px" }} placeholder="R$" value={newExp.value||""} onChange={e => setNE(x=>({...x,value:e.target.value}))} />
          <input type="date" style={{ ...S.inp, flex:"1 1 110px" }} value={newExp.date} onChange={e => setNE(x=>({...x,date:e.target.value}))} />
          <button style={{ ...S.btnP, padding:"12px 16px", background:T.primary }}
            onClick={() => { if (!newExp.desc.trim()||!newExp.value) return; upd({ expenses:[...(st.expenses||[]),{id:uid(),...newExp,value:Number(newExp.value)}] }); setNE({desc:"",value:0,date:todayK()}); }}>＋</button>
        </div>
        {(st.expenses||[]).slice().reverse().map(e => (
          <div key={e.id} style={{ ...S.bk, borderColor:T.border, borderLeftColor:"#c0392b", marginBottom:8, padding:"10px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <span style={{ color:T.deep, fontWeight:500, fontSize:13 }}>{e.desc}</span>
                <span style={{ marginLeft:8, color:"#c0392b", fontWeight:700, fontSize:13 }}>{R$(e.value)}</span>
                <span style={{ marginLeft:8, color:"#b0a0a0", fontSize:11 }}>{fmtD(e.date)}</span>
              </div>
              <button style={{ background:"none", border:"none", color:"#c0392b", cursor:"pointer", fontSize:18 }} onClick={() => upd({ expenses:(st.expenses||[]).filter(x=>x.id!==e.id) })}>🗑</button>
            </div>
          </div>
        ))}
        {!(st.expenses||[]).length && <p style={{ color:"#c9b0a0", fontSize:13, fontStyle:"italic" }}>Nenhuma despesa.</p>}
      </div>
    </div>
  );
}
