import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { ThemeProvider } from "./context/theme-provider";
// import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      {/* <Toaster richColors position="top-right" /> */}
    </ThemeProvider>
  </React.StrictMode>
);
