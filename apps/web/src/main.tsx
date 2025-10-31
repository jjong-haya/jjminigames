// apps/web/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import router from "./routes";
import "./styles/index.css";
import { ToastProvider } from "./features/toast/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
    </ToastProvider>

  </React.StrictMode>
);
