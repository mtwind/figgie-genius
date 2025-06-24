// src/components/tabs/data/Data.tsx

import { BidOffer } from "@/components/trades/BidOffer";
import type { BidOfferData } from "@/types";
import { Box, Typography } from "@mui/material";

interface DataProps {
  marketLog: BidOfferData[];
}

const Data = ({ marketLog: bidOfferLog }: DataProps) => {
  console.log("Data bidOfferLog: ", bidOfferLog);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        Bid/Offer Log
      </Typography>
      {/* Check if the log has bid/offer items before trying to map */}
      {bidOfferLog && bidOfferLog.length > 0 ? (
        // Map over the log of bid/offers. The most recent is first.
        bidOfferLog.map((bidOfferData, index) => {
          console.log("Bid/Offer ", index, ": ", bidOfferData);
          return (
            <Box key={index} sx={{ mb: 0.5 }}>
              <BidOffer data={bidOfferData} />
            </Box>
          );
        })
      ) : (
        <Typography sx={{ p: 1 }} color="text.secondary">
          No bid/offer activity has been recorded yet.
        </Typography>
      )}
    </Box>
  );
};

export default Data;
