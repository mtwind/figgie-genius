// frontend/src/sidepanel-welcome.tsx
import PlayNowScreen from "@/components/general/PlayNowScreen"; // Your "not playing" component
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlayNowScreen />
  </React.StrictMode>
);
