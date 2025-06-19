// src/components/trades/PlayerSummaries.tsx

import { PlayerCard } from "@/components/PlayerCard";
import type { AllPlayers } from "@/types";
import { Box, Typography } from "@mui/material";

interface PlayerSummariesProps {
  allPlayers: AllPlayers;
}

export const PlayerSummaries = ({ allPlayers }: PlayerSummariesProps) => {
  // Guard clause to handle empty or missing players
  if (!allPlayers.players || allPlayers.players.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No player data available</Typography>
      </Box>
    );
  }

  return (
    // Dynamic CSS Grid layout similar to Home.tsx
    <Box
      sx={{
        display: "grid",
        gap: "4px", // Minimal padding between cards
        p: "4px", // Minimal padding around the grid

        // Responsive columns that avoid a 3-column layout
        gridTemplateColumns: "1fr", // Default: 1 column
        "@media (min-width: 380px)": {
          gridTemplateColumns: "1fr 1fr", // At 380px+, switch to 2 columns
        },
        "@media (min-width: 780px)": {
          gridTemplateColumns: "1fr 1fr 1fr 1fr", // At 780px+, switch to 4 columns
        },
      }}
    >
      {allPlayers.players.map((player) => (
        <PlayerCard key={player.name} player={player} />
      ))}
    </Box>
  );
};
