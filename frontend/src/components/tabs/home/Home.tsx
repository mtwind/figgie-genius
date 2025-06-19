// src/components/tabs/Home.tsx

import { GameState } from "@/components/GameState";
import type { AllPlayers, FullTrade, MarketHistory } from "@/types";
import { Box, Typography } from "@mui/material";

// The component's props interface now accepts the full game state data
interface HomeProps {
  allPlayers: AllPlayers;
  marketHistory: MarketHistory;
  trade: FullTrade;
}

const Home = ({ allPlayers, marketHistory, trade }: HomeProps) => {
  // Guard clause to check if we have player data
  if (!allPlayers || !allPlayers.players || allPlayers.players.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading player data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        Current Game State
      </Typography>
      <GameState
        allPlayers={allPlayers}
        marketHistory={marketHistory}
        trade={trade}
      />
    </Box>
  );
};

export default Home;
