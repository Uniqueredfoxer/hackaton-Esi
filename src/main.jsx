import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./appRouter";
 import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  </StrictMode>,
);
