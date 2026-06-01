import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useDeferredState } from "../../hooks/useDeferredState";
import { AppLayer } from "../../providers/appLayer/appLayer";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  bindButton?: RefObject<HTMLElement | null>;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  bindButton,
}: ModalProps) => {
  const id = useId();
  const delayedIsOpen = useDeferredState(isOpen, 300);
  // useEffect(() => {
  //   // Handle escape key
  //   const handleEscape = (event: KeyboardEvent) => {
  //     console.log("in modal");
  //     if (event.key === "Escape") {
  //       // event.stopPropagation();
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("keydown", handleEscape);
  //     document.getElementById("theme-provider")!.style.overflow = "hidden"; // Prevent background scrolling
  //     blurBottomLayers();
  //   }

  //   return () => {
  //     document.removeEventListener("keydown", handleEscape);
  //     document.getElementById("theme-provider")!.style.overflow = "unset";
  //     blurBottomLayers();
  //   };
  // }, [isOpen, onClose]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const onOpenMo = useCallback(() => {
    modalContentRef?.current?.style.setProperty(
      "view-transition-name",
      `modal-${id}`,
    );
    modalContentRef?.current?.style.setProperty("visibility", "visible");
    modalContentRef?.current?.style.setProperty("visibility", "visible");
    // ::view-transition-group(modal-${id}) {
    //     animation-duration: 300ms;
    // }

    bindButton?.current?.style.setProperty("visibility", "hidden");
    bindButton?.current?.style.removeProperty("view-transition-name");
  }, [id, bindButton, modalContentRef]);

  const onCloseMo = useCallback(() => {
    bindButton?.current?.style.setProperty(
      "view-transition-name",
      `modal-${id}`,
    );
    bindButton?.current?.style.removeProperty("visibility");

    modalContentRef?.current?.style.removeProperty("view-transition-name");
    modalContentRef?.current?.style.setProperty("visibility", "hidden");
  }, [id, bindButton, modalContentRef]);

  useEffect(() => {
    if (isOpen) {
      document.startViewTransition(onOpenMo);
    } else {
      document.startViewTransition(onCloseMo);
    }
  }, [isOpen]);

  if (!isOpen && !delayedIsOpen) return null;

  return createPortal(
    <AppLayer
      onClose={onClose}
      closeOnEscape
      blockBottomLayers
      onClick={onClose}
      className="modal-layer"
    >
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={modalContentRef}
        style={{
          visibility: "hidden",
          // viewTransitionName: `modal-${id}`,
        }}
      >
        {children}
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
    id,
  );
};

type modalSectionProps = {
  children: ReactNode;
};

Modal.Title = ({ children }: modalSectionProps) => {
  return <div className="modal-header">{children}</div>;
};

Modal.HelpText = ({ children }: modalSectionProps) => {
  return <div className="modal-help-text">{children}</div>;
};

Modal.Body = ({ children }: modalSectionProps) => {
  return <div className="modal-body">{children}</div>;
};

Modal.Actions = ({ children }: modalSectionProps) => {
  return <div className="modal-actions">{children}</div>;
};
