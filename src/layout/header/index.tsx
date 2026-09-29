import { type ReactNode } from "react";
import { create } from "zustand";
import "./index.scss";

export const Header = () => {
  const left = useHeader((state) => state.left);
  const center = useHeader((state) => state.center);
  const right = useHeader((state) => state.right);

  return (
    <div className="app-header">
      <div className="app-header--section left">{left}</div>
      <div className="app-header--section center">{center}</div>
      <div className="app-header--section right">{right}</div>
    </div>
  );
};

type headerSections = "left" | "center" | "right";

type headerType = Record<headerSections, ReactNode> & {
  setup: (sections: Record<headerSections, ReactNode>) => void;
};

export const useHeader = create<headerType>((set) => ({
  left: null,
  center: null,
  right: null,
  setup: (sections) => {
    set(sections);
  },
}));
