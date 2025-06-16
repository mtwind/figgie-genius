// src/components/tabs/Genius.tsx

import type { FullGameState } from "@/types";
import { Box, Typography } from "@mui/material";

interface GeniusProps {
  gameState: FullGameState | null;
}

const Genius = ({ gameState }: GeniusProps) => {
  console.log(gameState);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Genius</Typography>
      <Typography variant="body2" color="text.secondary">
        AI-powered suggestions will appear here.
      </Typography>
    </Box>
  );
};

export default Genius;
