import {
  cloneElement,
  Fragment,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useId,
} from "react";

import { TooltipContext } from "../../providers/tooltip/tooltip_context";
import "./tooltip.scss";

type props<T extends HTMLElement = HTMLElement> = {
  children: ReactElement<{
    onMouseEnter: (event: MouseEvent<T>) => void;
    onMouseLeave: () => void;
  }>;
  title: string | ReactNode;
};

/**
 ** avoid to set an absolute element as children
 */
export const Tooltip = <T extends HTMLElement = HTMLElement>({
  children,
  title,
}: props<T>) => {
  const id = useId();
  const { hideTooltip, showTooltip } = useContext(TooltipContext);
  useEffect(() => {
    return () => {
      hideTooltip(id);
    };
  }, []);

  // NEW METHOD:
  if (!isValidElement(children)) return children;
  if (children.type === Fragment) {
    console.warn(
      "Tooltip: Fragment not supported. Wrap in <span> or <div> instead.",
    );
    return children;
  }

  return cloneElement(children, {
    onMouseLeave: () => {
      setTimeout(hideTooltip, typeof title === "string" ? 0 : 100, id);
      children.props.onMouseLeave?.();
    },
    onMouseEnter: (event: MouseEvent<T>) => {
      // typeof children === "string" && event.target.setAttribute("aria-label", children);
      showTooltip({
        id,
        content: title,
        element: event.currentTarget,
      });
      children.props.onMouseEnter?.(event);
    },
  });

  // OLD METHOD:
  // return (
  //   <div
  //     className="tooltip-wrapper"
  //     onMouseLeave={() => {
  //       setTimeout(hideTooltip, typeof title === "string" ? 0 : 100, id);
  //     }}
  //     onMouseEnter={(event) => {
  //       // typeof children === "string" && event.target.setAttribute("aria-label", children);
  //       showTooltip({
  //         id,
  //         content: title,
  //         element: event.currentTarget.firstChild,
  //       });
  //     }}
  //   >
  //     {children}
  //   </div>
  // );
};
