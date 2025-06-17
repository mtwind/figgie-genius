// src/components/tabs/Home.tsx

import { PlayerCard } from "@/components/PlayerCard";
import type { FullGameState } from "@/types";
import { Box, Typography } from "@mui/material";

interface HomeProps {
  gameState: FullGameState | null;
}

const Home = ({ gameState }: HomeProps) => {
  if (!gameState || !gameState.players) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading player data...</Typography>
      </Box>
    );
  }
  return (
    // Use a Box with display: 'grid' for a true auto-fitting grid.
    <Box
      sx={{
        display: "grid",
        // This is the key for the dynamic layout:
        // It will create as many columns as can fit, with a minimum width of 180px.
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1px", // Extremely thin gap - just 1 pixel
        p: 0.25, // Reduced padding around the entire grid
        justifyContent: "center",
      }}
    >
      {/* Map over the players and render a PlayerCard for each one */}
      {gameState.players.map((player) => (
        <PlayerCard key={player.name} player={player} />
      ))}
    </Box>
  );
};

export default Home;
