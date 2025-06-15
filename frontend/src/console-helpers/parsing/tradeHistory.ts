
export function parseTradeHistory() {
    // A helper function to convert an rgb(x, y, z) string to a simple color name
    const parseColorFromRgb = (rgbString) => {
      if (!rgbString) return 'unknown';
      if (rgbString.includes('26, 167, 123')) return 'green';
      if (rgbString.includes('239, 64, 67')) return 'red';
      if (rgbString.includes('239, 168, 35')) return 'orange';
      if (rgbString.includes('39, 115, 222')) return 'blue';
      return 'unknown';
    };
  
    // Step 1: Find the "Trade History" header text (this worked).
    const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                  .find(div => div.innerText.trim() === 'Trade History');
  
    if (!tradeHistoryHeader) {
      console.error("Could not find the 'Trade History' header.");
      return [];
    }
  
    // Step 2 (FIXED): Get the main container by going up two parent levels from the header.
    const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
    
    if (!commonContainer) {
      console.error("Could not find the common container for trade history.");
      return [];
    }
  
    // Step 3: Find all trade rows within this container using the stable attribute selector.
    const tradeRows = commonContainer.querySelectorAll('div[aria-disabled="true"]');
    const trades = [];
  
    tradeRows.forEach(row => {
      const columns = row.children;
      if (columns.length < 4) return;
  
      const buyerNameElement = columns[0].querySelector('div');
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
      
      const sellerNameElement = columns[2].querySelector('div');
      const seller = {
        name: sellerNameElement?.innerText.trim() || 'N/A',
        color: parseColorFromRgb(sellerNameElement?.style.color)
      };
  
      const price = columns[3].innerText.trim() || 'N/A';
  
      trades.push({ buyer, suit, seller, price });
    });
  
    console.log("Parsed Trade History:", trades);
    return trades;
  }