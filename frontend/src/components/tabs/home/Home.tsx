// src/components/tabs/Home.tsx

import { EssentialData } from "@/components/EssentialData";
import { SuitIcon } from "@/components/SuitIcon";
import { PlayerSummaries } from "@/components/trades/PlayerSummaries";
import type { FullGameState } from "@/types";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TradingViewIcon from "@mui/icons-material/TrendingUp";
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          gap: 2,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            minWidth: "250px",
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2, color: "#1976d2" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Waiting for Game
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please navigate to figgie.com and join a game
          </Typography>
        </Paper>
      </Box>
    );
  }

  // State 2: Game loaded but no trades yet
  if (!gameState.trade?.trade && gameState.players?.players) {
    return (
      <Box sx={{ p: 2 }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            mb: 2,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <HourglassEmptyIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              Game Ready
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {gameState.players.players.length} players connected
            </Typography>
          </CardContent>
        </Card>

        {/* Game Info */}
        {gameState.gameInfo && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {gameState.gameInfo.gameName && (
              <Chip
                label={gameState.gameInfo.gameName}
                variant="outlined"
                size="small"
              />
            )}
            {gameState.gameInfo.round && (
              <Chip
                label={gameState.gameInfo.round}
                variant="outlined"
                size="small"
              />
            )}
            {gameState.gameInfo.timeRemaining && (
              <Chip
                label={`⏱️ ${gameState.gameInfo.timeRemaining}`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        )}

        {/* Waiting Status */}
        <Chip
          label="Waiting for first trade..."
          color="warning"
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Player Summaries */}
        <PlayerSummaries allPlayers={gameState.players} />
      </Box>
    );
  }

  // State 3: Active game (with trades) - Custom UI similar to GameState
  const colorMap: { [key: string]: string } = {
    blue: "#2773de",
    green: "#1aa77b",
    red: "#ef4043",
    orange: "#efa823",
    unknown: "#666",
  };

  const trade = gameState.trade;
  const buyerColor = colorMap[trade.buy?.player.color || "unknown"];
  const sellerColor = colorMap[trade.sell?.player.color || "unknown"];

  // Define the visual blocks for the trade
  const PriceBlock = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold", color: "white" }}>
        {trade.trade?.price}
      </Typography>
      <Box
        component="img"
        src="chips.png"
        alt="chips"
        sx={{ width: 18, height: 18, p: 0.25 }}
      />
    </Box>
  );

  const SuitBlock = (
    <Box sx={{ p: 0.25 }}>
      <SuitIcon
        suit={trade.trade?.suit || "Spades"}
        size={{ width: "30px", height: "30px" }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Live Game State */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          p: 1.5,
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
        }}
      >
        <TradingViewIcon sx={{ color: "#1976d2" }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          Live Game State
        </Typography>
        <Chip label="Active" color="success" size="small" />
      </Box>

      {/* Latest Trade Display */}
      {trade.trade && (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            display: "flex",
            alignItems: "stretch",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {/* Left Half: Buyer's side */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              backgroundColor: buyerColor,
              px: 1,
              py: 1,
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              {trade.trade.buyer.name} BOUGHT
            </Typography>
            {SuitBlock}
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              for
            </Typography>
          </Box>

          {/* Right Half: Seller's side */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              backgroundColor: sellerColor,
              px: 1,
              py: 1,
              justifyContent: "flex-start",
            }}
          >
            {PriceBlock}
            <Typography
              variant="body2"
              sx={{ ml: 0.5, fontWeight: "bold", color: "white" }}
            >
              from {trade.trade.seller.name}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Essential Data Section */}
      <EssentialData
        fairPrices={[12.0, 12.0, 12.0, 12.0]}
        goalChances={[25.0, 25.0, 25.0, 25.0]}
      />

      {/* Player Summaries Section */}
      {gameState.players && (
        <Box sx={{ mt: 2 }}>
          <PlayerSummaries allPlayers={gameState.players} />
        </Box>
      )}
    </Box>
  );
};

export default Home;
