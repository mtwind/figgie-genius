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
  const isPurchaseOrSale = data.type === 3 || data.type === 4;

  // Choose color map based on transaction type
  const colorMap = isPurchaseOrSale ? strongColorMap : mediumColorMap;
  const backgroundColor = colorMap[data.player.color] || colorMap.unknown;

  // Determine the action text and layout order based on the transaction type
  let actionText = "";
  const isBidOffer = data.type === 1 || data.type === 2;

  switch (data.type) {
    case 1:
      actionText = "BID";
      break;
    case 2:
      actionText = "OFFERED";
      break;
    case 3:
      actionText = "BOUGHT";
      break;
    case 4:
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
        justifyContent: "space-between", // Pushes elements to the edges
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

      {/* Right side: Dynamically ordered elements */}
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
    </Paper>
  );
};

/* 
// excellent, now i want to update logs.tsx so that instead of just showing the entire gameState, it shows each bid/offer/purchase/sale in a BidOffer.tsx component. you wil have to update the content.js file to recognize any time a new bid, offer, or transaction is made. Then, you will have to send this to the UI and display it in the log
*/
