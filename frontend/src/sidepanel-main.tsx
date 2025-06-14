// frontend/src/sidepanel-main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import GameDashboard from "./components/GameDashboard"; // Your main dashboard component
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameDashboard />
  </React.StrictMode>
);
