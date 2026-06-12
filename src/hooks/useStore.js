import { useState, useEffect } from "react";
import { subscribeToStore, initStore, savePartial, slotsFromFB } from "../services/database";
import { DEFAULT_THEME, DEFAULT_PROFILE, DEFAULT_MSGS, INIT_SVCS } from "../constants";

const INITIAL_STATE = {
  svcs:     INIT_SVCS,
  bookings: [],
  blocked:  [],
  slots:    {},
  goals:    { monthly: 3000 },
  expenses: [],
  theme:    DEFAULT_THEME,
  profile:  DEFAULT_PROFILE,
  msgs:     DEFAULT_MSGS,
};

export function useStore() {
  const [st, setSt]       = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStore((data) => {
      if (data) {
        setSt({
          ...INITIAL_STATE,
          ...data,
          slots:    slotsFromFB(data.slots || {}),
          svcs:     data.svcs     || INIT_SVCS,
          bookings: data.bookings || [],
          blocked:  data.blocked  || [],
          goals:    data.goals    || { monthly: 3000 },
          expenses: data.expenses || [],
          theme:    data.theme    || DEFAULT_THEME,
          profile:  data.profile  || DEFAULT_PROFILE,
          msgs:     data.msgs     || DEFAULT_MSGS,
        });
      } else {
        initStore(INITIAL_STATE);
        setSt(INITIAL_STATE);
      }
      setReady(true);
    });
    return () => unsub();
  }, []);

  function upd(partial) {
    setSt(s => ({ ...s, ...partial }));
    savePartial(partial);
  }

  return { st, upd, ready };
}
