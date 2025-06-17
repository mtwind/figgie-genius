// /**
//  * Parses a single trade history row element and returns two objects: one for the buyer
//  * and one for the seller, each formatted as a BidOfferData object.
//  * @param {HTMLDivElement} tradeRowWrapper The outer div that wraps a single trade history row.
//  * @returns {Array<object>|null} An array containing two objects (buyer and seller), or null if parsing fails.
//  */
// function parseTradeRow(tradeRowWrapper) {
//     // Helper to parse color from an rgb() string
//     const parseColorFromRgb = (rgbString) => {
//       if (!rgbString) return 'unknown';
//       if (rgbString.includes('26, 167, 123')) return 'green';
//       if (rgbString.includes('239, 64, 67')) return 'red';
//       else if (rgbString.includes('239, 168, 35')) return 'orange';
//       else if (rgbString.includes('39, 115, 222')) return 'blue';
//       return 'unknown';
//     };
  
//     // Select the inner div which is the actual row with the columns
//     const tradeRowElement = tradeRowWrapper.querySelector('div[aria-disabled="true"]');
//     if (!tradeRowElement) {
//       console.error("Could not find the inner [aria-disabled='true'] row element.");
//       return null;
//     }
  
//     const columns = tradeRowElement.children;
//     if (columns.length < 4) {
//       console.error(`Found the row, but it only has ${columns.length} columns, not 4.`);
//       return null;
//     }
  
//     // --- Parse all data points from the row ---
  
//     const buyerNameElement = columns[0].querySelector('div[dir="auto"]');
//     const buyer = {
//       name: buyerNameElement?.innerText.trim() || 'N/A',
//       color: parseColorFromRgb(buyerNameElement?.style.color)
//     };
  
//     const suitIcon = columns[1].querySelector('svg');
//     let suit = 'Unknown';
//     if (suitIcon) {
//       const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//       if (pathData.includes('M47.37')) suit = 'Spades';
//       else if (pathData.includes('M40.22')) suit = 'Clubs';
//       else if (pathData.includes('M30.9')) suit = 'Diamonds';
//       else if (pathData.includes('M55.11')) suit = 'Hearts';
//     }
    
//     const sellerNameElement = columns[2].querySelector('div[dir="auto"]');
//     const seller = {
//       name: sellerNameElement?.innerText.trim() || 'N/A',
//       color: parseColorFromRgb(sellerNameElement?.style.color)
//     };
  
//     const price = parseInt(columns[3].innerText.trim(), 10) || 0;
  
//     // --- Create two separate data objects ---
  
//     const buyerEvent = {
//       player: buyer,
//       type: 'BUY',
//       suit: suit,
//       price: price,
//     };
  
//     const sellerEvent = {
//       player: seller,
//       type: 'SELL',
//       suit: suit,
//       price: price,
//     };
  
//     const tradeData = [buyerEvent, sellerEvent];
  
//     console.log("Parsed Trade Row (Buyer & Seller):", tradeData);
//     return tradeData;
//   }