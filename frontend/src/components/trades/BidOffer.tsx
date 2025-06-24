// src/components/BidOffer.tsx

import { SuitIcon } from "@/components/SuitIcon";
import type { BidOfferData } from "@/types";
import { Box, Paper, Typography } from "@mui/material";

interface BidOfferProps {
  data: BidOfferData;
}

export const BidOffer = ({ data }: BidOfferProps) => {
  // Light colors for bids and offers
  //   const _lightColorMap: { [key: string]: string } = {
  //     blue: "#eaf4ff",
  //     green: "#e8f5e9",
  //     red: "#ffebee",
  //     orange: "#fff3e0",
  //     unknown: "#f5f5f5",
  //   };

  // More powerful colors for purchases and sales
  const mediumColorMap: { [key: string]: string } = {
    blue: "#bbdefb",
    green: "#c8e6c9",
    red: "#ffcdd2",
    orange: "#ffe0b2",
    unknown: "#e0e0e0",
  };

  const strongColorMap: { [key: string]: string } = {
    blue: "#2773de",
    green: "#1aa77b",
    red: "#ef4043",
    orange: "#efa823",
    unknown: "#666",
  };

  // Determine if this is a purchase or sale (more powerful colors)
  const isPurchaseOrSale = data.type === "BUY" || data.type === "SELL";

  // Choose color map based on transaction type
  const colorMap = isPurchaseOrSale ? strongColorMap : mediumColorMap;
  const backgroundColor = colorMap[data.player.color] || colorMap.unknown;

  // Determine the action text and layout order based on the transaction type
  let actionText = "";
  const isBidOffer = data.type === "BID" || data.type === "OFFER";

  switch (data.type) {
    case "BID":
      actionText = "BID";
      break;
    case "OFFER":
      actionText = "OFFERED";
      break;
    case "BUY":
      actionText = "BOUGHT";
      break;
    case "SELL":
      actionText = "SOLD";
      break;
  }

  // Define the two main visual blocks based on the type
  const PriceBlock = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {data.price}
      </Typography>
      <Box
        component="img"
        src="chips.png"
        alt="chips"
        sx={{ width: 18, height: 18 }}
      />
    </Box>
  );

  const SuitBlock = (
    <SuitIcon suit={data.suit} size={{ width: "30px", height: "30px" }} />
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        mb: 1,
        borderRadius: 2,
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1, // Add gap between elements
      }}
    >
      {/* Left side: Player Name */}
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {data.player.name}
      </Typography>

      {/* Center: Action Text */}
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {actionText}
      </Typography>

      {/* Center-Right: Dynamically ordered elements */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/*
          This is the core logic:
          - If it's a BID or OFFER, the layout is: {Price} for {Suit}
          - If it's a BUY or SELL, the layout is: {Suit} for {Price}
        */}
        {isBidOffer ? PriceBlock : SuitBlock}
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          for
        </Typography>
        {isBidOffer ? SuitBlock : PriceBlock}
      </Box>

      {/* Far Right: Time */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: "normal",
          color: isPurchaseOrSale
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(0, 0, 0, 0.6)",
          minWidth: "fit-content", // Prevents time from being compressed
        }}
      >
        {data.time || "N/A"}
      </Typography>
    </Paper>
  );
};
