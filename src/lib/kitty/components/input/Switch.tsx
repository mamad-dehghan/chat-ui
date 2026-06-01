import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { InputHTMLAttributes } from "react";

import classNames from "classnames";
import { colorOptions } from "../../providers/theme/types";
import "./Switch.scss";

export interface ISwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  checkedColor?: colorOptions;
  hasCheckedIcon?: boolean;
  uncheckedColor?: colorOptions;
  hasUncheckedIcon?: boolean;
}
// TODO: always has icon but not show, color
export const Switch = ({
  checkedColor = colorOptions.primary,
  hasCheckedIcon = true,
  uncheckedColor = colorOptions.surface,
  hasUncheckedIcon = false,
  className,
  ...others
}: ISwitchProps) => {
  return (
    <button
      tabIndex={-1}
      className={classNames(
        "switch",
        others.checked && "checked",
        others.disabled && "disabled",
        others.checked
          ? {
              "element--primary": checkedColor === colorOptions.primary,
              "element--secondary": checkedColor === colorOptions.secondary,
              "element--success": checkedColor === colorOptions.success,
              "element--error": checkedColor === colorOptions.error,
              "element--warning": checkedColor === colorOptions.warning,
              "element--tertiary": checkedColor === colorOptions.tertiary,
              "element--surface": checkedColor === colorOptions.surface,
            }
          : {
              "element--surface": uncheckedColor === colorOptions.surface,
              "element--primary": uncheckedColor === colorOptions.primary,
              "element--secondary": uncheckedColor === colorOptions.secondary,
              "element--success": uncheckedColor === colorOptions.success,
              "element--error": uncheckedColor === colorOptions.error,
              "element--warning": uncheckedColor === colorOptions.warning,
              "element--tertiary": uncheckedColor === colorOptions.tertiary,
            },
        className,
      )}
      disabled={others.disabled}
    >
      <input {...others} type="checkbox" className="hidden-checkbox" />
      <div className="switch--thumb--wrapper">
        <div
          className={classNames({
            "switch--thumb": true,
            "checked-icon": hasCheckedIcon,
            "unchecked-icon": hasUncheckedIcon,
            checked: others.checked,
          })}
        >
          {others.checked ? (
            <CheckIcon weight={"regular"} />
          ) : (
            <XIcon weight={"regular"} />
          )}
        </div>
      </div>
    </button>
  );
};
