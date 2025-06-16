// src/components/PlayerCard.tsx

import { SuitIcon } from "@/components/SuitIcon";
import { Box, Paper, Typography } from "@mui/material";

// FIX 1: The props interface now matches how the component is being called in Home.tsx.
// It accepts individual props instead of a single 'player' object.
interface PlayerCardProps {
  isUser: boolean;
  playerName: string;
  playerColor: string;
  chips: string | number;
  totalCards: number;
  hand: { [key: string]: number | string };
  cardChanges: { [key: string]: number | string };
}

export const PlayerCard = ({
  isUser,
  playerName,
  playerColor,
  chips,
  totalCards,
  hand,
  cardChanges,
}: PlayerCardProps) => {
  const colorMap: { [key: string]: string } = {
    blue: "#2773de",
    green: "#1aa77b",
    red: "#ef4043",
    orange: "#efa823",
    unknown: "#666",
  };

  console.log(isUser);
  const backgroundColor = colorMap[playerColor] || colorMap.unknown;

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 1,
        border: "1px solid #e0e0e0",
        maxWidth: 220,
      }}
    >
      {/* Header Box */}
      <Box
        sx={{
          backgroundColor: backgroundColor,
          color: "white",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          alignItems: "center",
          minHeight: "60px",
          p: 1,
        }}
      >
        {/* Left Column: Card Icon with Total Cards inside */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/cards/deck.png"
            alt="cards"
            sx={{ width: 32, height: 32 }}
          />
          <Typography
            sx={{
              position: "absolute",
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "black",
            }}
          >
            {totalCards}
          </Typography>
        </Box>

        {/* Right Column: Name stacked above Chips */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.2,
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: "0.9rem", textAlign: "right" }}
          >
            {playerName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              component="img"
              src="/chips/chip.png"
              alt="chips"
              sx={{ width: 16, height: 16 }}
            />
            <Typography sx={{ fontSize: "0.8rem" }}>{chips}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Lower Box with Suit Details */}
      <Box sx={{ py: 0.5, px: 1 }}>
        {["Spades", "Clubs", "Diamonds", "Hearts"].map((suit) => (
          <Box
            key={suit}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 0.5,
            }}
          >
            <Typography
              sx={{
                width: "40px",
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {hand[suit] || "0"}
            </Typography>

            <SuitIcon suit={suit} />

            {/* FIX 2: Use a simple placeholder for the right-side numbers as requested. */}
            <Typography
              sx={{ width: "40px", textAlign: "center", fontSize: "0.8rem" }}
            >
              {cardChanges[suit] || "0"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
