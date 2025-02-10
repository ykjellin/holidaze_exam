import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      {" "}
      {}
      <App />
    </ErrorBoundary>
  </StrictMode>
);
