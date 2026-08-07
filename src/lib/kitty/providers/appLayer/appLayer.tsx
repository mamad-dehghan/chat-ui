import classNames from "classnames";
import { HTMLAttributes, KeyboardEvent, useEffect } from "react";
import "./app_layer.scss";
import { blurBottomLayers } from "./utils";

type props = Omit<HTMLAttributes<HTMLDivElement>, "onKeyDown" | "tabIndex"> & {
  /** @default false */
  blockBottomLayers?: boolean;
  /** @default false */
  closeOnEscape?: boolean;
  /** @default false */
  preventBlock?: boolean;
  onClose?: () => void;
};

function onKeyDown(
  closeOnEscape: props["closeOnEscape"],
  onClose: props["onClose"],
) {
  return function (event: KeyboardEvent<HTMLDivElement>) {
    if (closeOnEscape && onClose && event.key === "Escape") {
      onClose();
    }
  };
}

export const AppLayer = ({
  className,
  closeOnEscape = false,
  blockBottomLayers = false,
  preventBlock = false,
  onClose,
  onClick,
  ...others
}: props) => {
  // const id = useId();
  useEffect(() => {
    if (blockBottomLayers) {
      // window.history.replaceState(
      //   {
      //     lastLayer: id,
      //   },
      //   "",
      //   "",
      // );
      blurBottomLayers();
    }

    return () => {
      if (blockBottomLayers) {
        // if (window.history.state && window.history.state.modal) {
        //   window.history.back();
        // }
        blurBottomLayers();
      }
    };
  }, [blockBottomLayers]);
  return (
    <div
      tabIndex={-1}
      onKeyDown={onKeyDown(closeOnEscape, onClose)}
      onClick={(event) => {
        // console.log("app-layer", others.id);
        if (onClick) {
          // event.stopPropagation();
          onClick(event);
        }
      }}
      className={classNames("app-extra-layer", className, {
        "block-bottom-layers": blockBottomLayers,
        "prevent-block-layer": preventBlock,
      })}
      data-layer
      {...others}
    />
  );
};
