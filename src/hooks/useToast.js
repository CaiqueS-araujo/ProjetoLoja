import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  function toast_(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  return { toast, toast_ };
}
