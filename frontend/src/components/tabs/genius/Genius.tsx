// src/components/tabs/Genius.tsx

import { BidOffer } from "@/components/trades/BidOffer"; // Import your new component
import type { BidOfferData } from "@/types"; // Import your types
import { BidOfferType } from "@/types";
import { Box, Divider, Typography } from "@mui/material";

// Create mock data for each transaction type
const mockBid: BidOfferData = {
  player: { name: "Bot-Rabbit", color: "green" },
  type: BidOfferType.BID,
  suit: "Spades",
  price: 12,
};

const mockOffer: BidOfferData = {
  player: { name: "Bot-Dinosaur", color: "red" },
  type: BidOfferType.OFFER,
  suit: "Clubs",
  price: 15,
};

const mockBuy: BidOfferData = {
  player: { name: "mtwind2003", color: "blue" },
  type: BidOfferType.BUY,
  suit: "Diamonds",
  price: 14,
};

const mockSell: BidOfferData = {
  player: { name: "Bot-Skunk", color: "orange" },
  type: BidOfferType.SELL,
  suit: "Hearts",
  price: 10,
};

const Genius = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bid/Offer Component Samples
      </Typography>

      {/* Render a component for each mock data object */}
      <Typography variant="overline">Bid Example</Typography>
      <BidOffer data={mockBid} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline">Offer Example</Typography>
      <BidOffer data={mockOffer} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline">Buy Example</Typography>
      <BidOffer data={mockBuy} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline">Sell Example</Typography>
      <BidOffer data={mockSell} />
    </Box>
  );
};

export default Genius;
