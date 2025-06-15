// src/parsing/parseTradeBoards.ts

interface TradeBoardEntry {
  lastSale: string;
  bid: string;
  bidColor: string;
  offer: string;
  offerColor: string;
}

export function parseTradeBoards() {
  const userContainer = document.querySelector(
    'div[style*="border-top-left-radius: 2px"]'
  );
  if (!userContainer) return {};

  const opponentsWrapper = userContainer.nextElementSibling;
  if (!opponentsWrapper) return {};

  const tradeBoardsContainer = opponentsWrapper.nextElementSibling;
  if (!tradeBoardsContainer) {
    console.error("Could not find the trade boards container.");
    return {};
  }

  // FIX: Add an explicit type for the main data object.
  const tradeBoardsData: Record<string, TradeBoardEntry> = {};
  
  const suitRows = tradeBoardsContainer.querySelectorAll('div[style*="min-height: 95px"]');
  
  for (const suitRow of Array.from(suitRows)) {
    const innerRow = suitRow.querySelector('div[style*="min-height: 95px"]');
    if (!innerRow || innerRow.children.length < 3) continue;

    const [bidSide, centerIconContainer, offerSide] = Array.from(innerRow.children);

    const suitIcon = centerIconContainer.querySelector('svg');
    // FIX: Assert the element as HTMLElement to access .innerText.
    const lastSaleElement = centerIconContainer.querySelector('div[style*="font-size: 16px;"]') as HTMLElement | null;
    const lastSale = lastSaleElement?.innerText.trim() || 'N/A';

    let suit = 'Unknown';
    if (suitIcon) {
      const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
      if (pathData.includes('M47.37')) suit = 'Spades';
      else if (pathData.includes('M40.22')) suit = 'Clubs';
      else if (pathData.includes('M30.9')) suit = 'Diamonds';
      else if (pathData.includes('M55.11')) suit = 'Hearts';
    }

    // FIX: Add type for the helper function's parameter.
    const parseColorFromStyle = (element: Element | null): string => {
      const style = (element as HTMLElement)?.style.backgroundImage;
      if (!style) return 'none';
      if (style.includes('26, 167, 123')) return 'green';
      if (style.includes('239, 64, 67')) return 'red';
      if (style.includes('239, 168, 35')) return 'orange';
      if (style.includes('39, 115, 222')) return 'blue';
      return 'none';
    };

    const bidPriceElement = bidSide.querySelector('div[style*="font-size: 24px"]') as HTMLElement | null;
    const bidPrice = bidPriceElement ? bidPriceElement.innerText.trim() : "";

    const offerPriceElement = offerSide.querySelector('div[style*="font-size: 24px"]') as HTMLElement | null;
    const offerPrice = offerPriceElement ? offerPriceElement.innerText.trim() : "";
    
    const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
    const bidColor = parseColorFromStyle(bidDisplay);
    
    const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
    const offerColor = parseColorFromStyle(offerDisplay);

    if (suit !== 'Unknown') {
      tradeBoardsData[suit] = { lastSale, bid: bidPrice, bidColor, offer: offerPrice, offerColor };
    }
  }
  return tradeBoardsData;
}