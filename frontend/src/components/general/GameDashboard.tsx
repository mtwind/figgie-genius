// src/components/GameDashboard.tsx

import Data from "@/components/tabs/data/Data";
import Genius from "@/components/tabs/genius/Genius";
import Home from "@/components/tabs/home/Home";
import Logs from "@/components/tabs/logs/Logs";
import type { AllPlayers, FullTrade, MarketHistory } from "@/types";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";

const GameDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [allPlayers, setAllPlayers] = useState<AllPlayers[]>([]);
  const [tradeLog, setTradeLog] = useState<FullTrade[]>([]);
  const [marketHistory, setMarketHistory] = useState<MarketHistory[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    // 1. Fetch the initial state when the panel opens
    chrome.runtime.sendMessage({ type: "GET_LATEST_PLAYERS" }, (response) => {
      if (response) setAllPlayers(response);
    });
    chrome.runtime.sendMessage({ type: "GET_TRADE_LOG" }, (response) => {
      if (response) setTradeLog(response);
    });
    chrome.runtime.sendMessage({ type: "GET_MARKET_HISTORY" }, (response) => {
      if (response) setMarketHistory(response);
    });

    // 2. Set up listeners for real-time updates from the background script
    const messageListener = (message: any) => {
      if (message.type === "PLAYERS_UPDATED") {
        console.log("Dashboard received players: ", message.payload);
        setAllPlayers(message.payload);
      }
      if (message.type === "LOG_UPDATED") {
        console.log("Dashboard received log: ", message.payload);
        setTradeLog(message.payload);
      }

      if (message.type === "MARKET_UPDATED") {
        console.log("Dashboard received market: ", message.payload);
        setMarketHistory(message.payload);
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
        return <Home allPlayers={allPlayers[0]} />;
      case 1:
        return <Genius />;
      case 2:
        return <Data />;
      case 3:
        return (
          <Logs
            tradeLog={tradeLog}
            players={allPlayers}
            market={marketHistory}
          />
        ); // Pass the tradeLog to the Logs tab
      default:
        return <Home allPlayers={allPlayers[0]} />;
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
