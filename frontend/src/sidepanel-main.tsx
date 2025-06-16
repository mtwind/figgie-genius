// frontend/src/sidepanel-main.tsx
import GameDashboard from "@/components/general/GameDashboard"; // Your main dashboard component
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameDashboard />
  </React.StrictMode>
);
