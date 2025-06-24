// src/components/GameDashboard.tsx

import Data from "@/components/tabs/data/Data";
import Genius from "@/components/tabs/genius/Genius";
import Home from "@/components/tabs/home/Home";
import Logs from "@/components/tabs/logs/Logs";
import { BidOfferData, type FullGameState } from "@/types";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";

const GameDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentGameState, setCurrentGameState] =
    useState<FullGameState | null>(null);
  const [gameStateLog, setGameStateLog] = useState<FullGameState[]>([]);
  const [marketLog, setMarketLog] = useState<BidOfferData[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "GET_LATEST_GAME_STATE" },
      (response) => {
        if (response) {
          setCurrentGameState(response.currentGameState);
          setGameStateLog(response.gameStateLog);
        }
      }
    );

    // 2. Set up listeners for real-time updates from the background script
    const messageListener = (message: any) => {
      if (message.type === "INITIAL_GAME_STATE_UPDATED") {
        console.log("Dashboard received initial state: ", message.payload);
        setCurrentGameState(message.payload);
      } else if (message.type === "GAME_STATE_UPDATED") {
        console.log("Dashboard received update: ", message.payload);
        setCurrentGameState(message.payload.currentGameState);
        setGameStateLog(message.payload.gameStateLog);
        setMarketLog(message.payload.marketLog);
      } else if (message.type === "BID_OFFER_UPDATE") {
        setMarketLog(message.payload.marketLog);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    // 3. Cleanup listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);
  const renderActiveComponent = () => {
    switch (selectedTab) {
      case 0:
        return <Home gameState={currentGameState} />;
      case 1:
        return <Genius />;
      case 2:
        return <Data marketLog={marketLog} />;
      case 3:
        return <Logs gameStateLog={gameStateLog} />; // Pass the tradeLog to the Logs tab
      default:
        return <Home gameState={currentGameState} />;
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
        {renderActiveComponent()}
      </Box>
    </Box>
  );
};

export default GameDashboard;
