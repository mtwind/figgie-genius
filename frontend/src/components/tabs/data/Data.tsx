// src/components/tabs/Data.tsx

import type { FullGameState } from "@/types";
import { Box, Typography } from "@mui/material";

interface DataProps {
  gameState: FullGameState | null;
}

const Data = ({ gameState }: DataProps) => {
  console.log(gameState);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Data</Typography>
      <Typography variant="body2" color="text.secondary">
        Detailed statistics and historical data will be shown here now.
      </Typography>
    </Box>
  );
};

export default Data;
