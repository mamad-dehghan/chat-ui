import classNames from "classnames";
import { HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { useDeferredState } from "../../hooks/useDeferredState";
import { AppLayer } from "../../providers/appLayer/appLayer";
import "./Drawer.scss";

type directions = "left" | "right" | "top" | "bottom";

type props = {
  /** @default false */
  blockBottomLayers?: boolean;
  /** @default false */
  closeOnEscape?: boolean;
  /** @default true */
  isOpen?: boolean;
  direction: directions;
  mountElement?: HTMLElement;
  onClose: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onClick">;

export const Drawer = ({
  isOpen = true,
  direction,
  className,
  children,
  mountElement,
  ...others
}: props) => {
  const aa = useDeferredState(isOpen, isOpen ? 0 : 200);
  // console.log(isOpen, aa, Date.now());
  if (!isOpen && !aa) return null;

  return createPortal(
    <AppLayer
      closeOnEscape
      blockBottomLayers
      className={classNames(
        "drawer-layer",
        `direction-${direction}`,
        className,
      )}
      onClick={others.onClose}
      {...others}
    >
      <div
        className={classNames("drawer-content", isOpen && aa && "open")}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </AppLayer>,
    mountElement ?? document.getElementById("theme-provider")!,
    others.id,
  );
};
