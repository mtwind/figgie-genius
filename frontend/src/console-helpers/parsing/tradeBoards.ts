
// export function parseTradeBoards() {
//     // Find the user's container to use as a stable anchor.
//     const userContainer = document.querySelector('div[style*="border-top-left-radius: 2px"]');
//     if (!userContainer) {
//       console.error("Could not find the user's main container to anchor the search.");
//       return {};
//     }
  
//     // The opponents' wrapper is the user container's next sibling.
//     const opponentsWrapper = userContainer.nextElementSibling;
//     if (!opponentsWrapper) {
//       console.error("Could not find opponents' wrapper.");
//       return {};
//     }
    
//     // The trade boards' container is the opponents' wrapper's next sibling.
//     const tradeBoardsContainer = opponentsWrapper.nextElementSibling;
//     if (!tradeBoardsContainer) {
//       console.error("Could not find the trade boards' container.");
//       return {};
//     }
  
//     const tradeBoardsData = {};
    
//     // Get the direct children, which are the WRAPPERS for each suit row.
//     const suitRowWrappers = tradeBoardsContainer.children;
    
//     for (const wrapper of suitRowWrappers) {
//       // FIX: Select the inner row from within the wrapper.
//       const suitRow = wrapper.querySelector('div[style*="min-height: 95px"]');
//       if (!suitRow || suitRow.children.length < 3) continue;
      
//       const [bidSide, centerIconContainer, offerSide] = suitRow.children;
  
//       const suitIcon = centerIconContainer.querySelector('svg');
//       const lastSaleElement = centerIconContainer.querySelector('div[style*="font-size: 16px;"]');
//       const lastSale = lastSaleElement?.innerText.trim() || 'N/A';
  
//       let suit = 'Unknown';
//       if (suitIcon) {
//         const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//         if (pathData.includes('M47.37')) suit = 'Spades';
//         else if (pathData.includes('M40.22')) suit = 'Clubs';
//         else if (pathData.includes('M30.9')) suit = 'Diamonds';
//         else if (pathData.includes('M55.11')) suit = 'Hearts';
//       }
      
//       const parseColorFromStyle = (element) => {
//         const style = element?.style.backgroundImage;
//         if (!style) return 'none';
//         if (style.includes('26, 167, 123')) return 'green';
//         if (style.includes('239, 64, 67')) return 'red';
//         if (style.includes('239, 168, 35')) return 'orange';
//         if (style.includes('39, 115, 222')) return 'blue';
//         return 'none';
//       };
  
//       // Get the displayed bid/offer numbers from the display divs
//       const bidPriceElement = bidSide.querySelector('div[style*="font-size: 24px"]');
//       const bidPrice = bidPriceElement ? bidPriceElement.innerText.trim() : "";
  
//       const offerPriceElement = offerSide.querySelector('div[style*="font-size: 24px"]');
//       const offerPrice = offerPriceElement ? offerPriceElement.innerText.trim() : "";
      
//       const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
//       const bidColor = parseColorFromStyle(bidDisplay);
      
//       const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
//       const offerColor = parseColorFromStyle(offerDisplay);
  
//       if (suit !== 'Unknown') {
//         tradeBoardsData[suit] = { lastSale, bid: bidPrice, bidColor, offer: offerPrice, offerColor };
//       }
//     }
  
//     console.log("Trade Boards Data:", tradeBoardsData);
//     return tradeBoardsData;
//   }