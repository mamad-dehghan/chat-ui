import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import {
  sizeOptions,
  fillOptions,
  colorOptions,
} from "../../providers/theme/types";

import { Icon, IconWeight } from "@phosphor-icons/react";
import "./iconButton.scss";

// TODO: add sizing
// TODO: add disabled
export interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: sizeOptions;
  disabled?: boolean;
  mode?: colorOptions;
  fill: Exclude<fillOptions, fillOptions.elevated>;
  Icon: Icon;
  enable?: boolean;
  weight?: IconWeight;
  dataFocused?: boolean;
}

export const IconButton = ({
  fill,
  Icon,
  mode,
  disabled,
  size,
  dataFocused,
  enable,
  className,
  weight,
  ...others
}: IIconButtonProps) => {
  const classname = classNames(
    "icon-button",
    disabled && "icon-button--disabled",
    enable && "icon-button--enable",
    mode === "primary" && "element--primary",
    mode === "error" && "element--error",
    mode === "warning" && "element--warning",
    mode === "success" && "element--success",
    fill === fillOptions.fill && "icon-button--fill",
    fill === fillOptions.link && "icon-button--link",
    fill === fillOptions.outline && "icon-button--outline",
    fill === fillOptions.tonal && "icon-button--tonal",
    size === sizeOptions.small && "element--small",
    size === sizeOptions.medium && "element--medium",
    size === sizeOptions.large && "element--large",
    dataFocused && "element--focused",
    className,
  );

  return (
    <button className={classname} {...others}>
      <Icon weight={weight ?? (enable ? "fill" : "regular")} />
    </button>
  );
};
