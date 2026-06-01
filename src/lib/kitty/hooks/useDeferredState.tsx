import { useEffect, useState } from "react";

let copy = undefined;
export const useDeferredState = <T,>(
  value: T,
  timeoutMs: number,
  initalValue?: T
) => {
  const [copyValue, SetCopyValue] = useState<T>(initalValue ?? value);
  useEffect(() => {
    copy = value;
    setTimeout(SetCopyValue, timeoutMs, copy);
  }, [timeoutMs, value]);

  return copyValue;
};
