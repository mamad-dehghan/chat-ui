import {
  ReactNode,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";
import { TooltipContext, TooltipT } from "./tooltip_context";

import classNames from "classnames";
import { placeFinder } from "../../components/PlaceFinder/finder";
import { AppLayer } from "../appLayer/appLayer";
import "./tooltip_provider.scss";

function isRichTooltip(tooltip?: TooltipT) {
  return !["undefined", "string"].includes(typeof tooltip?.content);
}

let isTooltipHovered: boolean = false;
type props = {
  children: ReactNode;
};

export const TooltipProvider = ({ children }: props) => {
  const [tooltip, setTooltip] = useState<TooltipT | undefined>(undefined);
  const ref = useRef<HTMLSpanElement>(null);

  const xOy = useMemo(
    () =>
      tooltip && ref.current
        ? placeFinder(
            tooltip.element.getBoundingClientRect(),
            ref.current.getBoundingClientRect(),
            undefined,
            [
              { vertical: "top", horizontal: "center" },
              { vertical: "bottom", horizontal: "center" },
              // {vertical: "center", horizontal: "left"},
            ],
            { container: { X: 4, Y: 4 }, targetEl: { X: 16, Y: 8 } },
          )
        : undefined,
    [tooltip, ref.current],
  );

  const defer = useDeferredValue(xOy);

  const showTooltip = useCallback((tooltip: TooltipT) => {
    isTooltipHovered = false;
    setTooltip(tooltip);
  }, []);

  const hideTooltip = useCallback(
    (id: string) => {
      setTimeout(
        () =>
          setTooltip((prevState) => {
            if (isTooltipHovered) return prevState;
            else return prevState?.id === id ? undefined : prevState;
          }),
        typeof tooltip?.content === "string" ? 0 : 100,
      );
    },
    [tooltip],
  );
  // console.log(typeof tooltip?.content);

  return (
    <TooltipContext.Provider
      value={{
        showTooltip,
        hideTooltip,
      }}
    >
      {children}
      <AppLayer className="tooltip-layer" preventBlock>
        {
          <span
            key={tooltip?.id}
            ref={ref}
            className={classNames(
              "tooltip-simulator",
              isRichTooltip(tooltip) && "rich",
            )}
          >
            {tooltip?.content}
          </span>
        }
        {defer ? (
          <span
            onMouseEnter={() => {
              isTooltipHovered = true;
            }}
            onMouseLeave={() => {
              isTooltipHovered = false;
              setTooltip(undefined);
            }}
            style={{
              ...xOy,
              ...(isRichTooltip(tooltip)
                ? {
                    paddingTop: xOy?.top ? "8px" : 0,
                    paddingBottom: xOy?.bottom ? "8px" : 0,
                    transform: `translateY(${xOy?.top ? "-8px" : "8px"})`,
                    // paddingLeft: xOy?.left ? "8px" : 0,
                    // paddingRight: xOy?.right ? "8px" : 0,
                  }
                : {}),
            }}
            className={classNames("tooltip1", isRichTooltip(tooltip) && "rich")}
          >
            {tooltip?.content}
          </span>
        ) : (
          <></>
        )}
      </AppLayer>
    </TooltipContext.Provider>
  );
};
