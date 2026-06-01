import {colorOptions} from "../theme/types";
import {Context, createContext} from "react";

type toastContextT = {
    closeToast: (id: string) => void,
    closeAllToasts: () => void,
    toast: (id: string, content: string, severity: colorOptions) => void
}
export const ToastContext: Context<toastContextT> = createContext({} as toastContextT)
