// src/parsing/parseTradeRow.ts

import { parseTime } from "@/parsing/time";
import type { BidOfferData } from "@/types";

// A helper function to parse a player's color from an rgb() string.
const parseColorFromRgb = (rgbString: string | null | undefined): string => {
  if (!rgbString) return "unknown";
  if (rgbString.includes("26, 167, 123")) return "green";
  if (rgbString.includes("239, 64, 67")) return "red";
  else if (rgbString.includes("239, 168, 35")) return "orange";
  else if (rgbString.includes("39, 115, 222")) return "blue";
  return "unknown";
};

/**
 * Parses a single trade history row element and returns two objects: one for the buyer
 * and one for the seller, each formatted as a BidOfferData object.
 * @param tradeRowWrapper The outer div that wraps a single trade history row.
 * @returns An array containing two BidOfferData objects, or null if parsing fails.
 */
export function parseTradeRow(
  tradeRowWrapper: HTMLDivElement
): BidOfferData[] | null {
  // The actual row element is nested one level down.
  // const tradeRowElement = tradeRowWrapper.querySelector('div[aria-disabled="true"]');
  // if (!tradeRowElement) {
  //   console.error("Could not find the inner [aria-disabled='true'] row element.");
  //   return null;
  // }
  console.log("TradeRowWrapper in func: ", tradeRowWrapper);

  const columns = tradeRowWrapper.children;
  if (columns.length < 4) {
    console.error(
      `Found the row, but it only has ${columns.length} columns, not 4.`
    );
    return null;
  }

  // --- Parse each column based on its structural position ---

  const buyerNameElement = columns[0].querySelector(
    'div[dir="auto"]'
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
    'div[dir="auto"]'
  ) as HTMLElement | null;
  const seller = {
    name: sellerNameElement?.innerText.trim() || "N/A",
    color: parseColorFromRgb(sellerNameElement?.style.color),
  };

  const price = parseInt((columns[3] as HTMLElement).innerText.trim(), 10) || 0;
  const time = parseTime();

  // --- Create two separate data objects, conforming to the BidOfferData interface ---

  const buyerEvent: BidOfferData = {
    player: buyer,
    type: "BUY",
    suit: suit,
    price: price,
    time: time?.timeRemaining,
  };

  const sellerEvent: BidOfferData = {
    player: seller,
    type: "SELL",
    suit: suit,
    price: price,
    time: time?.timeRemaining,
  };

  const tradeData: BidOfferData[] = [buyerEvent, sellerEvent];

  return tradeData;
}
