// src/components/PlayerCard.tsx

import { SuitIcon } from "@/components/SuitIcon";
import type { PlayerData } from "@/types";
import { Box, Paper, Typography } from "@mui/material";

interface PlayerCardProps {
  player: PlayerData;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const {
    isUser,
    name: playerName,
    color: playerColor,
    chips,
    totalCards,
    hand,
    cardChanges,
  } = player;
  const colorMap: { [key: string]: string } = {
    blue: "#2773de",
    green: "#1aa77b",
    red: "#ef4043",
    orange: "#efa823",
    unknown: "#666",
  };

  console.log("isUser: ", isUser);
  const backgroundColor = colorMap[playerColor] || colorMap.unknown;
  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 1,
        border: "1px solid #e0e0e0",
        width: 150,
      }}
    >
      {" "}
      {/* Header Box */}
      <Box
        sx={{
          backgroundColor: backgroundColor,
          color: "white",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          alignItems: "center",
          height: "55px",
          p: 0.75,
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
            src="cards.png"
            alt="cards"
            sx={{ width: 48, height: 48 }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "55%",
              transform: "translate(-50%, -50%)",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {totalCards}
          </Typography>
        </Box>

        {/* Right Column: Centered Name and Chips */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            gap: 0.25,
          }}
        >
          {" "}
          <Typography
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "block",
              textOverflow: "clip",
              fontSize: "clamp(0.6rem, 8cqw, 1.2rem)",
              containerType: "inline-size",
            }}
          >
            {playerName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Box
              component="img"
              src="chips.png"
              alt="chips"
              sx={{ width: 24, height: 24 }}
            />
            <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
              {chips}
            </Typography>
          </Box>
        </Box>
      </Box>{" "}
      {/* Lower Box with Suit Details */}
      <Box sx={{ py: 0.25, px: 0.5 }}>
        {" "}
        {["Spades", "Clubs", "Diamonds", "Hearts"].map((suit) => (
          <Box
            key={suit}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 0.5,
              gap: 0.25,
            }}
          >
            <Typography
              sx={{
                width: "30px",
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {hand[suit] || "0"}
            </Typography>

            <SuitIcon suit={suit} />

            <Typography
              sx={{ width: "30px", textAlign: "center", fontSize: "0.8rem" }}
            >
              {cardChanges[suit] || "0"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
