// src/parsing/parseBidOffer.ts

import type { BidOfferData } from '@/types';
import { BidOfferType } from '@/types';

/**
 * A helper function to parse a player's color from a background-image style.
 * @param element The HTML element with the background-image style.
 * @returns A simple color string (e.g., 'green', 'red').
 */
const parseColorFromStyle = (element: Element | null): string => {
  // TS-FIX: Assert the element to HTMLElement to safely access its style property
  const style = (element as HTMLElement)?.style.backgroundImage;
  if (!style) return 'none';
  if (style.includes('26, 167, 123')) return 'green';
  if (style.includes('239, 64, 67')) return 'red';
  if (style.includes('239, 168, 35')) return 'orange';
  if (style.includes('39, 115, 222')) return 'blue';
  return 'none';
};

/**
 * Parses a single trade board row to extract bid or offer data.
 * @param suitRowWrapper The specific HTML div element that wraps a single suit's trade board.
 * @returns A BidOfferData object if a bid or offer is found, otherwise null.
 */
export function parseBidOffer(suitRowWrapper: HTMLDivElement): BidOfferData | null {
  // The actual row with 3 columns is nested one level down inside the wrapper.
  const suitRow = suitRowWrapper.firstElementChild;

  // Ensure the inner row and its 3 main children exist
  if (!suitRow || suitRow.children.length < 3) {
    return null;
  }
  
  const [bidSide, centerIconContainer, offerSide] = Array.from(suitRow.children);

  // --- Parse the Suit from the Center Column ---
  const suitIcon = centerIconContainer.querySelector('svg');
  let suit = 'Unknown';
  if (suitIcon) {
    const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
    if (pathData.includes('M47.37')) suit = 'Spades';
    else if (pathData.includes('M40.22')) suit = 'Clubs';
    else if (pathData.includes('M30.9')) suit = 'Diamonds';
    else if (pathData.includes('M55.11')) suit = 'Hearts';
  }
  if (suit === 'Unknown') return null;

  // --- Check for an active Bid on the Left Side ---
  const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
  const bidPriceElement = bidDisplay?.querySelector('div[dir="auto"]') as HTMLElement | null;
  const bidPrice = bidPriceElement?.innerText.trim();
  const bidColor = parseColorFromStyle(bidDisplay);

  if (bidPrice && bidColor !== 'none') {
    const data: BidOfferData = {
      player: { name: 'Unknown Player', color: bidColor }, // Name is not available in this context
      type: BidOfferType.BID,
      suit: suit,
      price: parseInt(bidPrice, 10),
    };
    return data;
  }

  // --- Check for an active Offer on the Right Side ---
  const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
  const offerPriceElement = offerDisplay?.querySelector('div[dir="auto"]') as HTMLElement | null;
  const offerPrice = offerPriceElement?.innerText.trim();
  const offerColor = parseColorFromStyle(offerDisplay);

  if (offerPrice && offerColor !== 'none') {
    const data: BidOfferData = {
        player: { name: 'Unknown Player', color: bidColor }, // Name is not available in this context
        type: BidOfferType.OFFER,
        suit: suit,
        price: parseInt(offerPrice, 10),
      };
      return data;
  }

  // If no active bid or offer was found, return null.
  return null;
}