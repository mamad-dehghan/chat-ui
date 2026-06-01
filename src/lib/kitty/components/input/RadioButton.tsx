import { ButtonHTMLAttributes } from "react";
import { colorOptions } from "../../providers/theme/types";
import classNames from "classnames";
import { CircleIcon, RadioButtonIcon } from "@phosphor-icons/react";

// TODO: add disable and half mode
export interface ICheckBoxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  mode: colorOptions;
  active: boolean;
}

export const RadioButton = ({
  mode,
  disabled,
  active,
  ...others
}: ICheckBoxProps) => {
  const className = classNames(
    "radio-button",
    disabled && "radio-button--disabled",
    mode === colorOptions.primary && "element--primary",
    mode === colorOptions.error && "element--error",
    mode === colorOptions.warning && "element--warning",
    mode === colorOptions.success && "element--success",
  );
  return (
    <button className={className} {...others}>
      {active ? (
        <RadioButtonIcon weight={"fill"} />
      ) : (
        <CircleIcon weight={"regular"} />
      )}
    </button>
  );
};
