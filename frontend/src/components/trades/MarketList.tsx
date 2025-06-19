// src/components/trades/MarketList.tsx

import { BidOffer } from "@/components/trades/BidOffer";
import type { MarketHistory } from "@/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

interface MarketListProps {
  marketHistory: MarketHistory;
}

export const MarketList = ({ marketHistory }: MarketListProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="market-history-content"
        id="market-history-header"
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          View Market History
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {marketHistory.market && marketHistory.market.length > 0 ? (
            marketHistory.market.map((bidOffer, index) => (
              <BidOffer key={index} data={bidOffer} />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No market history available
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
