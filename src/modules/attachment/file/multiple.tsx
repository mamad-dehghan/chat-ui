import type { ReactNode } from "react";

export const MultipleFileGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        maxHeight: "50vh",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
