// frontend/src/components/GameDashboard.tsx

import Data from "@/components/tabs/Data";
import Genius from "@/components/tabs/Genius";
import Home from "@/components/tabs/Home";
import Logs from "@/components/tabs/Logs";
import { Box } from "@mui/material";
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";

const GameDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderActiveComponent = () => {
    switch (selectedTab) {
      case 0:
        return <Home />;
      case 1:
        return <Genius />;
      case 2:
        return <Data />;
      case 3:
        return <Logs />;
      default:
        return <Home />;
    }
  };

  return (
    // This Box will now correctly fill the #root element, which is full-size.
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
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {renderActiveComponent()}
      </Box>
    </Box>
  );
};

export default GameDashboard;
