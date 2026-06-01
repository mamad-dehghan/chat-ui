import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../providers/theme/types";
import classNames from "classnames";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from "react";

import "./Button.scss";

// TODO: add sizing
// TODO: add disabled
export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: sizeOptions;
  disabled?: boolean;
  fill?: fillOptions;
  icon?: ReactNode;
  iconSide?: "start" | "end";
  fullWidth?: boolean;
  /** @default colorOptions.primary */
  mode?: Extract<
    colorOptions,
    "primary" | "error" | "warning" | "success" | "surface"
  >;
}

export const Button = forwardRef(
  (
    {
      size = sizeOptions.medium,
      disabled,
      mode = colorOptions.primary,
      fill = fillOptions.fill,
      fullWidth,
      icon,
      iconSide,
      children,
      className,
      ...others
    }: IButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={classNames(
          className,
          "button",
          disabled && "disabled",
          fullWidth && "button--full-width",
          mode === colorOptions.primary && "element--primary",
          mode === colorOptions.error && "element--error",
          mode === colorOptions.warning && "element--warning",
          mode === colorOptions.success && "element--success",
          mode === colorOptions.surface && "element--surface",
          fill === fillOptions.fill && "button--fill",
          fill === fillOptions.link && "button--link",
          fill === fillOptions.outline && "button--outline",
          fill === fillOptions.elevated && "button--elevated",
          fill === fillOptions.tonal && "button--tonal",
          Boolean(icon) &&
            `button-with-icon ${
              iconSide === "start"
                ? "button-with-icon-at-start"
                : "button-with-icon-at-end"
            }`,
        )}
        ref={ref}
        // disabled={disabled}
        {...others}
      >
        {icon}
        {children}
      </button>
    );
  },
);
