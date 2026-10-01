import type { ReactNode } from "react";
import "./multiple.scss";

export const MultipleImageGrid = ({ children }: { children: ReactNode[] }) => {
  return (
    <div
      className={`viewer-with-${children.length}-child`}
      style={{
        maxHeight: "50vh",
        borderRadius: "4px",
        overflow: "hidden",
        gap: "1px",
      }}
    >
      {children}
    </div>
  );
};
