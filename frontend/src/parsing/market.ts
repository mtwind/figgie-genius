// src/parsing/fullMarket.ts

import { parseBidOffer } from "@/parsing/bidOffer"; // Import your existing function
import type { SuitData } from "@/types";

/**
 * Parses a single suit's trade board element to extract the last sale, bid, and offer data.
 * @param marketElementWrapper The outer div that wraps a single suit's trade board.
 * @returns A MarketDataOld object or null if parsing fails.
 */
export function parseMarket(
  marketElementWrapper: HTMLDivElement
): SuitData | null {
  // The actual row with the 3 columns is nested one level down.
  const marketElement = marketElementWrapper.firstElementChild;
  if (!marketElement || marketElement.children.length < 3) {
    console.error("Could not find the 3 main columns in the provided element.");
    return null;
  }

  const centerIconContainer = Array.from(marketElement.children)[1];

  // --- Get Last Sale from the Center Column ---
  const lastSaleElement = centerIconContainer.querySelector(
    'div[dir="auto"]'
  ) as HTMLElement | null;
  const lastSale = lastSaleElement
    ? parseInt(lastSaleElement.innerText.trim(), 10)
    : 0;

  // --- Get Bid and Offer data by calling the imported parseBidOffer function ---
  const bidData = parseBidOffer(marketElementWrapper as HTMLDivElement, true);
  const offerData = parseBidOffer(
    marketElementWrapper as HTMLDivElement,
    false
  );

  const marketData: SuitData = {
    lastSale: lastSale.toString(),
    bid: bidData,
    offer: offerData,
    suit: bidData?.suit ?? null,
  };

  return marketData;
}
