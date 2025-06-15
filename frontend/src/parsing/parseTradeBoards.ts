// src/parsing/parseTradeBoards.ts

/**
 * Defines the shape for a single trade board entry, ensuring type safety.
 */
interface TradeBoardEntry {
  lastSale: string;
  bid: string;
  bidColor: string;
  offer: string;
  offerColor: string;
}

/**
 * Parses the data for all four trade boards by anchoring on the user's dashboard
 * and then navigating structurally. This function is completely size-agnostic and type-safe.
 * @returns A record object where keys are suit names and values are TradeBoardEntry objects.
 */
export function parseTradeBoards(): Record<string, TradeBoardEntry> {
  // Step 1 & 2: Use the working logic to find the user's main container.
  const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  if (!userChipIcon) {
    console.error("Could not find the user's chip icon to start the search.");
    return {};
  }
  const userContainer = userChipIcon.closest('div[style*="background-color: rgb(255, 255, 255)"]');
  if (!userContainer) {
    console.error("Could not find the user's main container from the chip icon.");
    return {};
  }

  // Step 3: Find the trade boards container relative to the user's container.
  const opponentsWrapper = userContainer.nextElementSibling;
  const tradeBoardsContainer = opponentsWrapper?.nextElementSibling;
  if (!tradeBoardsContainer) {
    console.error("Could not find the trade boards' container.");
    return {};
  }

  const tradeBoardsData: Record<string, TradeBoardEntry> = {};
  const suitRowWrappers = tradeBoardsContainer.children;

  for (const wrapper of Array.from(suitRowWrappers)) {
    const suitRow = wrapper.firstElementChild;
    if (!suitRow || suitRow.children.length < 3) continue;
    
    const [bidSide, centerIconContainer, offerSide] = Array.from(suitRow.children);

    const suitIcon = centerIconContainer.querySelector('svg');
    const lastSaleElement = centerIconContainer.querySelector('div[dir="auto"]') as HTMLElement | null;
    const lastSale = lastSaleElement?.innerText.trim() || 'N/A';

    let suit = 'Unknown';
    if (suitIcon) {
      const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
      if (pathData.includes('M47.37')) suit = 'Spades';
      else if (pathData.includes('M40.22')) suit = 'Clubs';
      else if (pathData.includes('M30.9')) suit = 'Diamonds';
      else if (pathData.includes('M55.11')) suit = 'Hearts';
    }

    const parseColorFromStyle = (element: Element | null): string => {
      const style = (element as HTMLElement)?.style.backgroundImage;
      if (!style) return 'none';
      if (style.includes('26, 167, 123')) return 'green';
      if (style.includes('239, 64, 67')) return 'red';
      if (style.includes('239, 168, 35')) return 'orange';
      if (style.includes('39, 115, 222')) return 'blue';
      return 'none';
    };

    const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
    const bidPriceElement = bidDisplay?.querySelector('div[dir="auto"]') as HTMLElement | null;
    const bidPrice = bidPriceElement?.innerText.trim() || "";
    const bidColor = parseColorFromStyle(bidDisplay);

    const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
    const offerPriceElement = offerDisplay?.querySelector('div[dir="auto"]') as HTMLElement | null;
    const offerPrice = offerPriceElement?.innerText.trim() || "";
    const offerColor = parseColorFromStyle(offerDisplay);

    if (suit !== 'Unknown') {
      tradeBoardsData[suit] = {
        lastSale,
        bid: bidPrice,
        bidColor,
        offer: offerPrice,
        offerColor
      };
    }
  }

  return tradeBoardsData;
}