// src/parsing/parseTradeHistory.ts
import { parseTime } from "@/parsing/time";
import type { BidOfferData, FullTrade, TradeData } from "@/types";

// FIX: Add a type for the helper function's parameter.
const parseColorFromRgb = (rgbString: string | null | undefined): string => {
  if (!rgbString) return "unknown";
  if (rgbString.includes("26, 167, 123")) return "green";
  if (rgbString.includes("239, 64, 67")) return "red";
  if (rgbString.includes("239, 168, 35")) return "orange";
  if (rgbString.includes("39, 115, 222")) return "blue";
  return "unknown";
};

export function parseSingleTrade(tradeRow: HTMLDivElement): FullTrade | null {
  const columns = tradeRow.children;
  if (columns.length < 4) return null;

  const buyerNameElement = columns[0].querySelector(
    "div"
  ) as HTMLElement | null;
  const buyer = {
    name: buyerNameElement?.innerText.trim() || "N/A",
    color: parseColorFromRgb(buyerNameElement?.style.color),
  };

  const suitIcon = columns[1].querySelector("svg");
  let suit = "Unknown";
  if (suitIcon) {
    const pathData = suitIcon.querySelector("path")?.getAttribute("d") || "";
    if (pathData.includes("M47.37")) suit = "Spades";
    else if (pathData.includes("M40.22")) suit = "Clubs";
    else if (pathData.includes("M30.9")) suit = "Diamonds";
    else if (pathData.includes("M55.11")) suit = "Hearts";
  }

  const sellerNameElement = columns[2].querySelector(
    "div"
  ) as HTMLElement | null;
  const seller = {
    name: sellerNameElement?.innerText.trim() || "N/A",
    color: parseColorFromRgb(sellerNameElement?.style.color),
  };

  // FIX: Assert the column as HTMLElement to access .innerText
  const price = (columns[3] as HTMLElement).innerText.trim() || "N/A";
  const time = parseTime();

  const buy: BidOfferData = {
    player: buyer,
    price: parseInt(price),
    suit: suit,
    type: "BUY",
    time: time?.timeRemaining,
  };

  const sell: BidOfferData = {
    player: seller,
    price: parseInt(price),
    suit: suit,
    type: "SELL",
    time: time?.timeRemaining,
  };

  const trade: TradeData = {
    buyer: buyer,
    suit: suit,
    seller: seller,
    price: price,
    time: time?.timeRemaining,
  };

  const full: FullTrade = {
    buy: buy,
    sell: sell,
    trade: trade,
  };

  return full;
}
