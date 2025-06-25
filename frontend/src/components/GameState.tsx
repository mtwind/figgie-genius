// src/components/GameState.tsx

import { EssentialData } from "@/components/EssentialData";
import { SuitIcon } from "@/components/SuitIcon";
import { MarketList } from "@/components/trades/MarketList";
import { PlayerSummaries } from "@/components/trades/PlayerSummaries";
import type { FullGameState } from "@/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Typography,
} from "@mui/material";

interface GameStateProps {
  gameState: FullGameState;
  fairPrices?: [number, number, number, number]; // Optional for now
  goalChances?: [number, number, number, number]; // Optional for now
}

export const GameState = ({
  gameState,
  fairPrices,
  goalChances,
}: GameStateProps) => {
  const colorMap: { [key: string]: string } = {
    blue: "#2773de",
    green: "#1aa77b",
    red: "#ef4043",
    orange: "#efa823",
    unknown: "#666",
  };

  const allPlayers = gameState.players;
  const marketHistory = gameState.marketHistory;
  const trade = gameState.trade;

  // Default values for fair prices and goal chances if not provided
  const defaultFairPrices: [number, number, number, number] = [
    1.35, 6.8797, 10.56, 2.34,
  ];
  const defaultGoalChances: [number, number, number, number] = [
    5.678, 20.34, 70.789, 4.595,
  ];

  if (!trade.trade || !trade.buy || !trade.sell) {
    console.log("Error: Trade is not well defined.");
    return [];
  }

  // Choose color map based on transaction type
  const buyerColor = colorMap[trade.buy.player.color];
  const sellerColor = colorMap[trade.sell.player.color];

  // Define the two main visual blocks based on the type
  const PriceBlock = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold", color: "white" }}>
        {trade.trade.price}
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
        suit={trade.trade.suit}
        size={{ width: "30px", height: "30px" }}
      />
    </Box>
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="game-state-content"
        id="game-state-header"
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            display: "flex",
            alignItems: "stretch",
            overflow: "hidden", // Ensures clean edges with border radius
            mb: 1,
          }}
        >
          {/* Left Half: Buyer's side */}
          <Box
            sx={{
              flex: 1, // Takes up 50% of the width
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              backgroundColor: buyerColor,
              px: 1, // Reduced horizontal padding
              py: 1, // Reduced vertical padding
              justifyContent: "flex-end", // Push content to the right edge
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
              flex: 1, // Takes up 50% of the width
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              backgroundColor: sellerColor,
              px: 1, // Reduced horizontal padding
              py: 1, // Reduced vertical padding
              justifyContent: "flex-start", // Push content to the left edge
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
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Essential Data Section */}
          <EssentialData
            fairPrices={fairPrices || defaultFairPrices}
            goalChances={goalChances || defaultGoalChances}
          />

          {/* Player Summaries Section */}
          {allPlayers && <PlayerSummaries allPlayers={allPlayers} />}

          {/* Market History Section */}
          {marketHistory && <MarketList marketHistory={marketHistory} />}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
