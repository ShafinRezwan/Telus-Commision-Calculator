import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1 id="title">Commission Calculator</h1>
    <RouterProvider router={router} />
  </StrictMode>
);
