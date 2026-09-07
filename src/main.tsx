import {
  ThemeProvider,
  ToastProvider,
  TooltipProvider,
} from "kitty";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <TooltipProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </TooltipProvider>
  </ThemeProvider>,
);
