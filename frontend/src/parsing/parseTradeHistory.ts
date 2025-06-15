// src/parsing/parseTradeHistory.ts

// FIX: Define an interface for a single trade object for type safety.
interface Trade {
  buyer: { name: string; color: string; };
  suit: string;
  seller: { name: string; color: string; };
  price: string;
}

// FIX: Add a type for the helper function's parameter.
const parseColorFromRgb = (rgbString: string | null | undefined): string => {
  if (!rgbString) return 'unknown';
  if (rgbString.includes('26, 167, 123')) return 'green';
  if (rgbString.includes('239, 64, 67')) return 'red';
  if (rgbString.includes('239, 168, 35')) return 'orange';
  if (rgbString.includes('39, 115, 222')) return 'blue';
  return 'unknown';
};

export function parseTradeHistory(): Trade[] {
  const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                .find(div => (div as HTMLElement).innerText.trim() === 'Trade History');

  if (!tradeHistoryHeader) return [];
  const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
  if (!commonContainer) return [];
  const listContainer = commonContainer.querySelector('div[class*="r-150rngu"]');
  if (!listContainer) return [];

  const tradeRows = listContainer.querySelectorAll('div[aria-disabled="true"]');
  // FIX: Define the type of the 'trades' array.
  const trades: Trade[] = [];

  tradeRows.forEach(row => {
    const columns = row.children;
    if (columns.length < 4) return;

    const buyerNameElement = columns[0].querySelector('div') as HTMLElement | null;
    const buyer = {
      name: buyerNameElement?.innerText.trim() || 'N/A',
      color: parseColorFromRgb(buyerNameElement?.style.color)
    };

    const suitIcon = columns[1].querySelector('svg');
    let suit = 'Unknown';
    if (suitIcon) {
      const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
      if (pathData.includes('M47.37')) suit = 'Spades';
      else if (pathData.includes('M40.22')) suit = 'Clubs';
      else if (pathData.includes('M30.9')) suit = 'Diamonds';
      else if (pathData.includes('M55.11')) suit = 'Hearts';
    }
    
    const sellerNameElement = columns[2].querySelector('div') as HTMLElement | null;
    const seller = {
      name: sellerNameElement?.innerText.trim() || 'N/A',
      color: parseColorFromRgb(sellerNameElement?.style.color)
    };

    // FIX: Assert the column as HTMLElement to access .innerText
    const price = (columns[3] as HTMLElement).innerText.trim() || 'N/A';

    trades.push({ buyer, suit, seller, price });
  });

  return trades;
}