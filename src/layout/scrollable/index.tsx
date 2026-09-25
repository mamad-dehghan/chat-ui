import type { ReactNode } from "react";
import { Header } from "../header";
import "./index.scss";

type props = {
  children: ReactNode;
};

export const ScrollableLayout = ({ children }: props) => {
  return (
    <main className="scrollable-layout">
      <Header />
      {children}
    </main>
  );
};
