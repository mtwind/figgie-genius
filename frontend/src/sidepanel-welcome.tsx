// frontend/src/sidepanel-welcome.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import PlayNowScreen from "./components/PlayNowScreen"; // Your "not playing" component
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlayNowScreen />
  </React.StrictMode>
);
