import { InputHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import { fillOptions, colorOptions } from "../../providers/theme/types";

export interface ISearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  mode: colorOptions;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  // fill: fillOptions.shadow | fillOptions.outline;
  fill: fillOptions.outline;
}

export const SearchInput = ({
  iconEnd,
  fill,
  iconStart,
  disabled,
  mode,
  ...others
}: ISearchInputProps) => {
  return (
    <div
      className={classNames("search-input--wrapper", {
        "search-input--wrapper--with-start-icon": iconStart,
        "search-input--wrapper--with-end-icon": iconEnd,
      })}
    >
      {iconStart}
      <input
        className={classNames("search-input", {
          "search-input--disabled": disabled,
          "element--primary": mode === colorOptions.primary,
          "element--error": mode === colorOptions.error,
          "element--warning": mode === colorOptions.warning,
          "element--success": mode === colorOptions.success,
          "search-input--outline": fill === fillOptions.outline,
          // "search-input--shadow": fill === fillOptions.shadow,
          "search-input--with-start-icon": iconStart,
          "search-input--with-end-icon": iconEnd,
        })}
        type="search"
        {...others}
      />
      {iconEnd}
    </div>
  );
};
