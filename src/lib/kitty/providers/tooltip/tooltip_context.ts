import { Context, createContext, ReactNode } from "react";

export type TooltipT = {
  id: string;
  content: string | ReactNode;
  element: HTMLElement;
};
type tooltipContextT = {
  hideTooltip: (id: string) => void;
  showTooltip: (tooltip: TooltipT) => void;
};
export const TooltipContext: Context<tooltipContextT> = createContext(
  {} as tooltipContextT,
);
export const TooltipContext2: Context<tooltipContextT> = createContext(
  {} as tooltipContextT,
);
