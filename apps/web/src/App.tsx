import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import router from "./routes";
import ExtraRoutes from './routes/ExtraRoutes';
import "./styles/index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <ExtraRoutes />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
