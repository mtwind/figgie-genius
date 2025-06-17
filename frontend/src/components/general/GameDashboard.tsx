// src/components/GameDashboard.tsx

import DashboardHeader from "@/components/general/DashboardHeader";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

// Import the new interface and the view components
// Import the new interface and the view components
import Data from "@/components/tabs/data/Data";
import Genius from "@/components/tabs/genius/Genius";
import Home from "@/components/tabs/home/Home";
import Logs from "@/components/tabs/logs/Logs";
import type { FullGameState } from "@/types";

const GameDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  // FIX: Replace 'any' with the specific FullGameState interface.
  const [gameState, setGameState] = useState<FullGameState | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const requestData = () => {
      chrome.runtime.sendMessage({ type: "GET_LATEST_STATE" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          setGameState(response);
        }
      });
    };

    requestData();

    // The listener now knows the message payload will be a FullGameState object
    const messageListener = (message: {
      type: string;
      payload: FullGameState;
    }) => {
      if (message.type === "GAME_STATE_UPDATE") {
        setGameState(message.payload);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const renderActiveComponent = () => {
    // Pass the typed gameState prop down to the child components
    switch (selectedTab) {
      case 0:
        return <Home gameState={gameState} />;
      case 1:
        return <Genius />;
      case 2:
        return <Data />;
      case 3:
        return <Logs gameState={gameState} />;
      default:
        return <Home gameState={gameState} />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        p: 0,
      }}
    >
      <DashboardHeader
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {gameState ? (
          renderActiveComponent()
        ) : (
          <Typography sx={{ p: 2 }}>Waiting for game data...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default GameDashboard;
