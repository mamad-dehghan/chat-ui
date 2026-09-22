import { CheckIcon } from "@phosphor-icons/react";
import { Badge } from "kitty";
import { type ComponentProps } from "react";
import { colorOptions } from "kitty";
import "./check_tick.scss";

export const TickBadge = (
  props: Omit<ComponentProps<typeof Badge>, "value">,
) => {
  return (
    <Badge
      color={colorOptions.secondary}
      value={
        <CheckIcon
          className="check-tick-icon"
          // width={20}
          // height={20}
          // style={{ aspectRatio: 1, margin: "2px", fontSize: "12px" }}
        />
      }
      {...props}
    />
  );
};
