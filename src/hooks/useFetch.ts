import { useEffect, useState } from "react";

// type props<T> = {
//   getter: () => Promise<T>;
// };

export const useFetch = <T>(getter: () => Promise<T>) => {
  const [state, setState] = useState<T | undefined>(undefined);
  useEffect(() => {
    getter().then(setState);
  }, []);
  return state;
};
