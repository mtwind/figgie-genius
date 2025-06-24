// src/components/tabs/Home.tsx

import { GameState } from "@/components/GameState";
import { PlayerSummaries } from "@/components/trades/PlayerSummaries";
import type { FullGameState } from "@/types";
import {
  TrendingUp as TradingIcon,
  HourglassEmpty as WaitingIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

// The component's props interface now accepts the full game state data
interface HomeProps {
  gameState: FullGameState | null;
}

const Home = ({ gameState }: HomeProps) => {
  console.log("Home gameState: ", gameState);

  // State 1: No game data (loading screen, not on game page, etc.)
  if (!gameState) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 3,
            maxWidth: 400,
          }}
        >
          <CircularProgress size={48} sx={{ mb: 3, color: "#666" }} />
          <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
            Waiting for Game
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            Navigate to figgie.com and start playing to see live game data
          </Typography>
        </Paper>
      </Box>
    );
  }
  // State 2: Game loaded but no trades yet
  if (!gameState.trade?.trade && gameState.players?.players) {
    return (
      <Box sx={{ p: 2 }}>
        <Card elevation={2} sx={{ mb: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <WaitingIcon sx={{ fontSize: 48, color: "#4CAF50", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Game Ready
            </Typography>
            <Chip
              label="Waiting for first trade..."
              color="primary"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            {/* Show game info if available */}
            {gameState.gameInfo && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Game Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {gameState.gameInfo.gameName && (
                    <Chip
                      label={gameState.gameInfo.gameName}
                      size="small"
                      color="secondary"
                    />
                  )}
                  {gameState.gameInfo.round && (
                    <Chip
                      label={gameState.gameInfo.round}
                      size="small"
                      color="secondary"
                    />
                  )}
                  {gameState.gameInfo.timeRemaining && (
                    <Chip
                      label={`Time: ${gameState.gameInfo.timeRemaining}`}
                      size="small"
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
            )}

            <PlayerSummaries allPlayers={gameState.players} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  // State 3: Active game with trades (existing functionality)
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, mb: 1 }}>
        <TradingIcon sx={{ color: "#4CAF50" }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Live Game State
        </Typography>
        <Chip label="Active" color="success" size="small" sx={{ ml: "auto" }} />
      </Box>
      <GameState gameState={gameState} />
    </Box>
  );
};

export default Home;
