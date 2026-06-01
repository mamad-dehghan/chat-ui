import classNames from "classnames";
import {
  sizeOptions,
  fillOptions,
  colorOptions,
} from "../../providers/theme/types";
import { MouseEventHandler } from "react";
import { Button } from "../../components/button/Button";

export type IToastProps = {
  children: string;
  action?: {
    content: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    position: "right" | "bottom";
    mode: Extract<
      colorOptions,
      "primary" | "error" | "warning" | "success" | "surface"
    >;
  };
};
// TODO: change button size to compact

export const Toast = ({ children, action }: IToastProps) => {
  const className = classNames(
    "toast",
    action &&
      classNames(
        "toast--with-action",
        action.position === "right" && "toast--with-action-on-right",
        action.position === "bottom" && "toast--with-action-on-bottom",
      ),
  );
  return (
    <div className={className}>
      <p>{children}</p>
      {action && (
        <Button
          onClick={action.onClick}
          size={sizeOptions.small}
          fill={fillOptions.link}
          mode={action.mode}
        >
          {action?.content}
        </Button>
      )}
    </div>
  );
};
