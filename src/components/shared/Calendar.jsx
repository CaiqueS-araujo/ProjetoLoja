import { WDAYS, MFULL } from "../../constants";
import { getDays, getDow, toKey } from "../../utils";
import { S } from "../../styles";

export function Calendar({
  cy, cm, setCy, setCm,
  todK, dst, bookedMap, onSelect,
  selDate, T, adminMode = false, multiSel = [],
}) {
  const dN = getDays(cy, cm);
  const oN = getDow(cy, cm);

  return (
    <div style={{ ...S.cal, borderColor: T.border }}>
      <div style={S.calHead}>
        <button
          style={{ ...S.calNav, borderColor: T.border, color: T.deep }}
          onClick={() => cm === 0 ? (setCy(y => y - 1), setCm(11)) : setCm(m => m - 1)}
        >‹</button>
        <span style={{ ...S.calMon, color: T.deep, fontFamily: "Georgia,serif" }}>
          {MFULL[cm]} {cy}
        </span>
        <button
          style={{ ...S.calNav, borderColor: T.border, color: T.deep }}
          onClick={() => cm === 11 ? (setCy(y => y + 1), setCm(0)) : setCm(m => m + 1)}
        >›</button>
      </div>

      <div style={S.calGrid}>
        {WDAYS.map((d, i) => <div key={i} style={S.calDow}>{d}</div>)}
        {Array.from({ length: oN }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length: dN }).map((_, i) => {
          const d = i + 1;
          const k = toKey(cy, cm, d);
          const ds = dst(d);
          const isT = k === todK;
          const isMulti = multiSel.includes(k);

          return (
            <button
              key={d}
              disabled={!adminMode && ds !== "avail"}
              onClick={() => onSelect && onSelect(k)}
              style={{
                ...S.calDay,
                ...(ds === "avail" ? { background: `${T.primary}20`, color: T.deep, cursor: "pointer", fontWeight: 700, border: `1px solid ${T.primary}` } : {}),
                ...(ds === "blocked" ? { background: "#fce8e8", color: "#c08080" } : {}),
                ...(ds === "past" && !adminMode ? { color: "#e0d8d4" } : {}),
                ...(isT ? { outline: `2.5px solid ${T.primary}`, outlineOffset: -1, fontWeight: 700, color: T.deep } : {}),
                ...(selDate === k ? { outline: `2.5px solid ${T.primary}`, outlineOffset: -1 } : {}),
                ...(isMulti ? { background: T.primary, color: "#fff", border: `1px solid ${T.primary}` } : {}),
                ...(adminMode && ds !== "avail" && ds !== "blocked" ? { cursor: "pointer", color: "#bbb" } : {}),
              }}
            >
              {d}
              {ds === "avail" && bookedMap && bookedMap[k] > 0 && (
                <span style={{ ...S.calDot, background: T.primary }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={S.calLeg}>
        <span style={S.legI}><span style={{ ...S.legDot, background: T.primary }} />Disponível</span>
        <span style={S.legI}><span style={{ ...S.legDot, background: "#f4b8b8" }} />Bloqueado</span>
        <span style={S.legI}><span style={{ ...S.legDot, background: "#e8e0d8" }} />Indisponível</span>
      </div>
    </div>
  );
}
