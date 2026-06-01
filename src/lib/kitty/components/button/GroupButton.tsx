import { ReactNode } from "react";

import "./groupButton.scss";
import classNames from "classnames";

type props = {
  children: ReactNode[];
  size?: "xs" | "s" | "m" | "l" | "xl";
};
// const GroupButtonSeparator = () => <div className="group-button--separator" />;

export const GroupButton = ({ children, size = "m" }: props) => {
  return (
    <div className={classNames("group-button", size)}>
      {children}
      {/*{children.reduce((first, second) => (
        <>
          {first}
          <GroupButtonSeparator />
          {second}
        </>
      ))}*/}
    </div>
  );
};
