import { createRoot } from "react-dom/client";
import "./index.css";
import {
  ThemeProvider,
  ToastProvider,
  TooltipProvider,
} from "./lib/kitty/providers/index";
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
