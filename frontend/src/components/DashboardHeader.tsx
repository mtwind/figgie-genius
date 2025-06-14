import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import React from "react";

interface DashboardHeaderProps {
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const DashboardHeader = ({
  selectedTab,
  onTabChange,
}: DashboardHeaderProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" sx={{ backgroundColor: "#ede7f5" }}>
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            "& .MuiTab-root": { minHeight: "64px" },
            "& .Mui-selected": {
              backgroundColor: "#d1c4e9",
              color: "#5e35b1 !important",
              borderRadius: "16px",
              margin: "6px",
            },
          }}
        >
          <Tab icon={<LocationOnIcon />} label="Home" />
          <Tab icon={<TipsAndUpdatesIcon />} label="Genius" />
          <Tab icon={<BookmarkBorderIcon />} label="Data" />
          <Tab icon={<NotificationsNoneIcon />} label="Logs" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default DashboardHeader;
