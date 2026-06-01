import { Check, Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import { fillOptions } from "../../providers/theme/types";
import "./chip.scss";

type assistChip = ButtonHTMLAttributes<HTMLButtonElement> & {
  // assist: true;
  Icon?: Icon;
  iconSide?: "start" | "end";
  fill: fillOptions.outline | fillOptions.elevated;
};
type filterChip = ButtonHTMLAttributes<HTMLButtonElement> & {
  filter?: true;
  enable: boolean;
  fill: fillOptions.outline | fillOptions.elevated;
  Icon?: Icon;
};

// type props = assistChip | filterChip;

export const AssistChip = ({
  Icon,
  iconSide = "start",
  children,
  className,
  fill,
  ...others
}: assistChip) => {
  return (
    <button
      className={classNames(
        "chip",
        "assist-chip",
        others.disabled && "disabled",
        Icon && "with-icon",
        iconSide === "start" ? "start-icon" : "end-icon",
        fill === fillOptions.outline ? "element-outline" : "",
        fill === fillOptions.elevated ? "element-elevated" : "",
        className,
      )}
      {...others}
    >
      <>
        {Icon ? <Icon weight="fill" /> : undefined}
        {children}
      </>
    </button>
  );
};
export const FilterChip = ({
  enable,
  children,
  className,
  fill,
  Icon = Check,
  ...others
}: filterChip) => {
  return (
    <button
      className={classNames(
        "chip",
        "filter-chip",
        "start-icon",
        others.disabled && "disabled",
        enable && "enable with-icon",
        fill === fillOptions.outline ? "element-outline" : "",
        fill === fillOptions.elevated ? "element-elevated" : "",
        className,
      )}
      {...others}
    >
      <>
        {enable ? <Icon weight="bold" /> : undefined}
        {children}
      </>
    </button>
  );
};
