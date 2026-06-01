import classNames from "classnames";
import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { colorOptions, fillOptions } from "../../providers/theme/types";
import "./Input.scss";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  supportText?: string;
  hasError?: boolean;
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  color?:
    | colorOptions.primary
    | colorOptions.secondary
    | colorOptions.tertiary
    // | colorOptions.surface
    | colorOptions.success;
  fullWidth?: boolean;
  disabled?: boolean;
  mode: colorOptions;
  fill?: fillOptions.elevated | fillOptions.outline | fillOptions.fill;
  label?: string;
}

//TODO: add elevated
export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      // disabled,
      supportText,
      color = colorOptions.primary,
      hasError = false,
      label,
      iconStart,
      iconEnd,
      fullWidth,
      className,
      fill = fillOptions.fill,
      placeholder = "",
      ...others
    },
    ref,
  ) => {
    // <div
    //     className={classNames(
    //         'input--wrapper',
    //         fill === fillOptions.shadow && 'input--wrapper--shadow',
    //         fill === fillOptions.outline && 'input--wrapper--outline',
    //         mode === modeOptions.primary && 'element--primary',
    //         mode === modeOptions.danger && 'element--danger',
    //         mode === modeOptions.warning && 'element--warning',
    //         mode === modeOptions.success && 'element--success'
    //     )}
    // >

    return (
      <div
        className={classNames(
          "input--outer-wrapper",
          color === colorOptions.primary && "element--primary",
          color === colorOptions.secondary && "element--secondary",
          color === colorOptions.tertiary && "element--tertiary",
          color === colorOptions.success && "element--success",
          // color === colorOptions.surface && "element--surface",
          fill === fillOptions.outline && "input--outline",
          fill === fillOptions.elevated && "input--elevated",
          fill === fillOptions.fill && "input--fill",
          fullWidth && "full-width",
          others.disabled && "disabled",
          className,
        )}
        data-has-error={hasError ? "true" : "false"}
      >
        <span className="helper-text">{supportText}</span>
        <div
          className={classNames(
            "input--inner-wrapper",
            color === colorOptions.primary && "element--primary",
            color === colorOptions.secondary && "element--secondary",
            color === colorOptions.tertiary && "element--tertiary",
            color === colorOptions.success && "element--success",
            // color === colorOptions.surface && "element--surface",
            fill === fillOptions.outline && "input--outline",
            fill === fillOptions.elevated && "input--elevated",
            fill === fillOptions.fill && "input--fill",
            fullWidth && "full-width",
            others.disabled && "disabled",
          )}
          // data-support-text={supportText}
        >
          {iconStart ? (
            <span className="input-icon start-icon">{iconStart}</span>
          ) : undefined}
          <input
            ref={ref}
            className={classNames(
              "input",
              fill === fillOptions.outline && "input--outline",
              fill === fillOptions.elevated && "input--elevated",
              fill === fillOptions.fill && "input--fill",
              fullWidth && "full-width",
              Boolean(iconStart || iconEnd) && "with-icon",
              Boolean(iconStart) && "input--with-start-icon",
              Boolean(iconEnd) && "input--with-end-icon",
            )}
            placeholder={placeholder}
            {...others}
          />
          {iconEnd ? (
            <span className="input-icon end-icon">{iconEnd}</span>
          ) : undefined}
          {label ? (
            <label htmlFor={others.id} className="input--label">
              {label}
            </label>
          ) : undefined}
        </div>
      </div>
    );
  },
);
