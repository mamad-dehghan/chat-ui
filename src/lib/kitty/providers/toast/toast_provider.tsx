import classNames from "classnames";
import { memo, ReactNode, useCallback, useState } from "react";
import { colorOptions } from "../theme/types";

import { X } from "@phosphor-icons/react";
import { AppLayer } from "../appLayer/appLayer";
import { ToastContext } from "./toast_context";
import "./toast_provider.scss";

type toastT = {
  id: string;
  severity: colorOptions;
  content: string;
};
type props = {
  children: ReactNode;
};
//TODO: maybe add hide in css or setTimeout
export const ToastProvider = ({ children }: props) => {
  const [availableToasts, setAvailableToasts] = useState<
    (toastT & {
      addedTime: number;
      timeOutId: number;
    })[]
  >([]);
  const closeAllToasts = useCallback(() => setAvailableToasts([]), []);
  const closeToast = useCallback((id: string) => {
    console.log(id, "close");
    setAvailableToasts((prevState) => {
      const toastIndex = prevState.findIndex((toast) => toast.id === id);
      if (toastIndex === -1) {
        return [];
      }
      clearTimeout(prevState[toastIndex]?.timeOutId);
      const newState = [...prevState];
      newState.splice(toastIndex, 1);
      // console.log(newState)
      return newState;
    });
  }, []);
  const addToast = useCallback(
    (id: string, content: string, severity: colorOptions) => {
      console.log(id, "add");
      setAvailableToasts((availableToasts) => {
        const index = availableToasts.findIndex((toast) => toast.id === id);
        if (index === -1) {
          const timeOutId = setTimeout(() => {
            closeToast(id);
          }, 5000);
          return [
            ...availableToasts,
            { id, severity, content, addedTime: Date.now(), timeOutId },
          ];
        } else {
          closeToast(id);
          // const toasts = availableToasts;
          // clearTimeout(toasts[index].timeOutId)
          const timeOutId = setTimeout(() => {
            closeToast(id);
          }, 5000);
          // toasts[index] = {id, severity, content, addedTime: availableToasts[index].addedTime, timeOutId}
          return [
            ...availableToasts,
            { id, severity, content, addedTime: Date.now(), timeOutId },
          ];
          // setAvailableToasts(toasts);
        }
      });
    },
    []
  );
  // console.log(availableToasts)
  // useEffect(() => {
  //     setAvailableToasts(prevState => prevState.filter(toast => Date.now() - toast.addedTime < 10000))
  // }, [availableToasts.reduce((str, item) => str + "/" + item.id, "")])

  return (
    <ToastContext.Provider
      value={{ closeAllToasts, closeToast, toast: addToast }}
    >
      <>
        {children}
        <AppLayer className="toasts-layer" preventBlock>
          {availableToasts.map((toast) => (
            <Alert
              key={toast.id}
              id={toast.id}
              onClose={closeToast}
              severity={toast.severity}
            >
              {toast.content}
            </Alert>
          ))}
        </AppLayer>
      </>
    </ToastContext.Provider>
  );
};

type alertT = {
  id: string;
  onClose: (id: string) => void;
  severity: colorOptions;
  children: string;
};

const Alert = memo(
  ({ id, onClose, severity, children }: alertT) => {
    return (
      <div
        className={classNames(
          "toast",
          severity === colorOptions.primary && "element-primary",
          severity === colorOptions.error && "element-error",
          severity === colorOptions.warning && "element-warning",
          severity === colorOptions.success && "element-success",
          severity === colorOptions.secondary && "element-secondary",
          severity === colorOptions.tertiary && "element-tertiary"
        )}
      >
        <p>{children}</p>
        <button className="toast-icon" onClick={() => onClose(id)}>
          <X weight="regular" />
        </button>
        {/*<IconButton Icon={X} onClick={() => onClose(id)} fill={fillOptions.link} enable={true} />*/}
        <div className="time-bar" />
      </div>
    );
  },
  (a, b) => a.id === b.id
);
