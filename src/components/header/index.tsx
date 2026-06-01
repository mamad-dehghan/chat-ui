import type { ReactNode } from "react";
import "./index.scss";

type props = {
  children: [ReactNode, ReactNode, ReactNode];
};

export const Header = ({ children }: props) => {
  return <div className="app-header">{children}</div>;
};
