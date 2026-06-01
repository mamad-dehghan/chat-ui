import { ButtonHTMLAttributes } from "react";
import { colorOptions } from "../../providers/theme/types";
import classNames from "classnames";
import {
  CheckSquareIcon,
  SquareIcon,
  SquareLogoIcon,
} from "@phosphor-icons/react";

// TODO: add disable and half mode
export interface ICheckBoxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  mode: colorOptions;
  active: true | false | "half";
}

export const Checkbox = ({
  mode,
  disabled,
  active,
  ...others
}: ICheckBoxProps) => {
  const className = classNames(
    "checkbox",
    disabled && "checkbox--disabled",
    mode === colorOptions.primary && "element--primary",
    mode === colorOptions.error && "element--error",
    mode === colorOptions.warning && "element--warning",
    mode === colorOptions.success && "element--success",
  );
  return (
    <button className={className} {...others}>
      {active === true ? (
        <CheckSquareIcon weight={"fill"} />
      ) : active === false ? (
        <SquareIcon weight={"regular"} />
      ) : (
        <SquareLogoIcon weight={"fill"} />
      )}
    </button>
  );
};
