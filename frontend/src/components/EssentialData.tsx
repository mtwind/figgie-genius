// src/components/EssentialData.tsx

import { SuitIcon } from "@/components/SuitIcon";
import { Box, Paper, Typography } from "@mui/material";

interface EssentialDataProps {
  fairPrices: [number, number, number, number]; // [Spades, Clubs, Diamonds, Hearts]
  goalChances: [number, number, number, number]; // [Spades, Clubs, Diamonds, Hearts]
}

export const EssentialData = ({
  fairPrices,
  goalChances,
}: EssentialDataProps) => {
  const suits = ["Spades", "Clubs", "Diamonds", "Hearts"] as const;

  // Find the highest values
  const maxFairPrice = Math.max(...fairPrices);
  const maxGoalChance = Math.max(...goalChances);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1.5,
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
        }}
      >
        Essential Data
      </Typography>

      {/* Grid Container - 5 columns now (label + 4 suits) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto repeat(4, 1fr)",
          gap: 1,
        }}
      >
        {/* Top Row: Empty space + Suit Icons */}
        <Box /> {/* Empty space for label column */}
        {suits.map((suit) => (
          <Box
            key={`icon-${suit}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0.5,
            }}
          >
            <SuitIcon suit={suit} size={{ width: "32px", height: "32px" }} />
          </Box>
        ))}
        {/* Second Row: Fair Price label + values */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color: "#666",
                fontSize: "0.7rem",
                lineHeight: 0.9,
              }}
            >
              Fair
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color: "#666",
                fontSize: "0.7rem",
                lineHeight: 0.9,
              }}
            >
              Price
            </Typography>
          </Box>
        </Box>
        {suits.map((suit, index) => (
          <Box
            key={`fair-price-${suit}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0.5,
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  fairPrices[index] === maxFairPrice
                    ? "#ffeb3b"
                    : "transparent",
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                ${fairPrices[index].toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))}
        {/* Third Row: Goal Chance label + values */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color: "#666",
                fontSize: "0.7rem",
                lineHeight: 0.9,
              }}
            >
              Goal
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color: "#666",
                fontSize: "0.7rem",
                lineHeight: 0.9,
              }}
            >
              Chance
            </Typography>
          </Box>
        </Box>
        {suits.map((suit, index) => (
          <Box
            key={`goal-chance-${suit}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0.5,
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  goalChances[index] === maxGoalChance
                    ? "#ffeb3b"
                    : "transparent",
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {goalChances[index].toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
