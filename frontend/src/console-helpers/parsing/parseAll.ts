

// function parseTopBar() {
//     // Find the timer by searching for the element whose text includes a colon ':'
//     const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
//                               .find(el => el.innerText.includes(':'));
  
//     // The selectors for these two were already working correctly
//     const gameNameElement = document.querySelector('div[style*="font-size: 20px"]');
//     const roundElement = Array.from(document.querySelectorAll('div[style*="font-size: 14px"]'))
//                               .find(el => el.innerText.includes('Round'));
  
//     const gameInfo = {
//       timeRemaining: timerElement?.innerText.trim() || 'N/A',
//       gameName: gameNameElement?.innerText.trim() || 'N/A',
//       round: roundElement?.innerText.trim() || 'N/A'
//     };
  
//     console.log("Top Bar Info:", gameInfo);
//     return gameInfo;
// }

// function parseUserHand() {
//     // Step 1: Find all chip icons to reliably identify the four player header bars.
//     const allChipIcons = document.querySelectorAll('svg[id*="chip_desktop_svg"]');
    
//     if (allChipIcons.length === 0) {
//       console.error("Could not find any chip icons on the page.");
//       return null;
//     }
  
//     let userHeaderBar = null;
  
//     // Step 2: Loop through the parent header of each chip icon.
//     for (const icon of allChipIcons) {
//       // Find the containing header bar for this icon.
//       const headerBar = icon.closest('div[style*="background-color"]');
//       if (!headerBar) continue;
  
//       // Step 3: Check if THIS header bar contains the user's unique larger font size.
//       const largeText = headerBar.querySelector('div[style*="font-size: 20px"]');
//       if (largeText) {
//         // If it does, this MUST be the user's header. We found it.
//         userHeaderBar = headerBar;
//         break;
//       }
//     }
  
//     if (!userHeaderBar) {
//       console.error("Could not find the user's header bar by process of elimination.");
//       return null;
//     }
  
//     // --- Step 4: Now that we have the correct user's header, parse all data from it. ---
  
//     const userContainer = userHeaderBar.parentElement;
//     if (!userContainer) return null;
  
//     const backgroundColor = userHeaderBar.style.backgroundColor;
//     let color = 'unknown';
//     if (backgroundColor.includes('39, 115, 222')) color = 'blue';
//     else if (backgroundColor.includes('26, 167, 123')) color = 'green';
//     else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//     else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
//     const textElementsInBar = userHeaderBar.querySelectorAll('div[style*="font-size: 20px"]');
//     const name = textElementsInBar[0]?.innerText.trim() || 'N/A';
//     const chips = textElementsInBar[1]?.innerText.trim() || 'N/A';
    
//     const hand = {};
//     let totalCards = 0;
//     const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
  
//     if (cardRow) {
//       for (const cardDiv of cardRow.children) {
//         const countStr = cardDiv.querySelector('div[style*="font-size: 20px"]')?.innerText || '0';
//         const count = parseInt(countStr, 10);
        
//         const svgId = cardDiv.querySelector('svg')?.id || '';
//         let suit = 'Unknown';
//         if (svgId.includes('spades')) suit = 'Spades';
//         else if (svgId.includes('clubs')) suit = 'Clubs';
//         else if (svgId.includes('diamonds')) suit = 'Diamonds';
//         else if (svgId.includes('hearts')) suit = 'Hearts';
        
//         if (suit !== 'Unknown') {
//           hand[suit] = count;
//           totalCards += count;
//         }
//       }
//     }
  
//     const userData = { name, color, chips, totalCards, hand };
//     console.log("User Data (Final, Robust Version):", userData);
//     return userData;
//   }

// function parseOpponentHands() {
//     // Find the user's container to use as a stable anchor point.
//     const userContainer = document.querySelector(
//       'div[style*="border-top-left-radius: 2px"]'
//     );
  
//     if (!userContainer) {
//       console.error("Could not find the user's main container to anchor the search.");
//       return [];
//     }
  
//     // The container for ALL opponents is the direct next sibling.
//     const opponentsWrapper = userContainer.nextElementSibling;
  
//     if (!opponentsWrapper) {
//       console.error("Opponent wrapper container not found.");
//       return [];
//     }
  
//     const opponentsData = [];
//     const opponentContainers = opponentsWrapper.children;
  
//     for (const container of opponentContainers) {
//       // --- Parse Header Bar for Name, Chips, and Color ---
//       const headerBar = container.querySelector('div[style*="background-color"]');
//       if (!headerBar) continue;
  
//       // 1. Get Player Color
//       const backgroundColor = headerBar.style.backgroundColor;
//       let color = 'unknown';
//       if (backgroundColor.includes('26, 167, 123')) color = 'green';
//       else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//       else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
//       // 2. Get Player Name
//       const nameElement = headerBar.querySelector('div[style*="font-size: 14px"]');
//       const name = nameElement?.innerText.trim() || 'N/A';
  
//       // 3. Get Player Chips (FIXED LOGIC)
//       const chipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
//       const chipsElement = chipIcon?.nextElementSibling; // The chips div is the next sibling of the icon
//       const chips = chipsElement?.innerText.trim() || 'N/A';
      
//       // --- Parse Total Cards ---
//       const totalCardsElement = container.querySelector('div[style*="font-size: 24px; color: rgb(255, 255, 255);"]');
//       const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;
  
//       // --- Parse Card Changes ---
//       const cardChanges = {};
//       const tradesContainer = container.querySelector('div[style*="flex-direction: column;"]');
//       if (tradesContainer) {
//         const tradeRows = tradesContainer.children;
//         for (const row of tradeRows) {
//           const suitIcon = row.querySelector('svg');
//           const tradeValueElement = row.querySelector('div[style*="font-size: 16px;"][style*="align-self: flex-end;"]');
          
//           if (!suitIcon || !tradeValueElement) continue;
  
//           let suit = 'Unknown';
//           const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//           if (pathData.includes('M47.37')) suit = 'Spades';
//           else if (pathData.includes('M40.22')) suit = 'Clubs';
//           else if (pathData.includes('M30.9')) suit = 'Diamonds';
//           else if (pathData.includes('M55.11')) suit = 'Hearts';
  
//           if (suit !== 'Unknown') {
//             cardChanges[suit] = tradeValueElement.innerText.trim() || '0';
//           }
//         }
//       }
  
//       opponentsData.push({
//         name,
//         color, // <-- New property
//         chips,
//         totalCards,
//         cardChanges,
//       });
//     }
  
//     console.log("Opponent Data:", opponentsData);
//     return opponentsData;
//   }

// function parseTradeBoards() {
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
  
// function parseTradeHistory() {
//     // A helper function to convert an rgb(x, y, z) string to a simple color name
//     const parseColorFromRgb = (rgbString) => {
//       if (!rgbString) return 'unknown';
//       if (rgbString.includes('26, 167, 123')) return 'green';
//       if (rgbString.includes('239, 64, 67')) return 'red';
//       if (rgbString.includes('239, 168, 35')) return 'orange';
//       if (rgbString.includes('39, 115, 222')) return 'blue';
//       return 'unknown';
//     };
  
//     // Step 1: Find the "Trade History" header text (this worked).
//     const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
//                                   .find(div => div.innerText.trim() === 'Trade History');
  
//     if (!tradeHistoryHeader) {
//       console.error("Could not find the 'Trade History' header.");
//       return [];
//     }
  
//     // Step 2 (FIXED): Get the main container by going up two parent levels from the header.
//     const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
    
//     if (!commonContainer) {
//       console.error("Could not find the common container for trade history.");
//       return [];
//     }
  
//     // Step 3: Find all trade rows within this container using the stable attribute selector.
//     const tradeRows = commonContainer.querySelectorAll('div[aria-disabled="true"]');
//     const trades = [];
  
//     tradeRows.forEach(row => {
//       const columns = row.children;
//       if (columns.length < 4) return;
  
//       const buyerNameElement = columns[0].querySelector('div');
//       const buyer = {
//         name: buyerNameElement?.innerText.trim() || 'N/A',
//         color: parseColorFromRgb(buyerNameElement?.style.color)
//       };
  
//       const suitIcon = columns[1].querySelector('svg');
//       let suit = 'Unknown';
//       if (suitIcon) {
//         const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//         if (pathData.includes('M47.37')) suit = 'Spades';
//         else if (pathData.includes('M40.22')) suit = 'Clubs';
//         else if (pathData.includes('M30.9')) suit = 'Diamonds';
//         else if (pathData.includes('M55.11')) suit = 'Hearts';
//       }
      
//       const sellerNameElement = columns[2].querySelector('div');
//       const seller = {
//         name: sellerNameElement?.innerText.trim() || 'N/A',
//         color: parseColorFromRgb(sellerNameElement?.style.color)
//       };
  
//       const price = columns[3].innerText.trim() || 'N/A';
  
//       trades.push({ buyer, suit, seller, price });
//     });
  
//     console.log("Parsed Trade History:", trades);
//     return trades;
//   }

// /**
//  * Executes all individual parsing functions to capture a complete snapshot of the game state.
//  * @returns A single JSON object containing all relevant game data.
//  */
// function getGameStateSnapshot() {
//   // Step 2: Call each imported function to get a piece of the game state.
//   const gameInfo = parseTopBar(); // from parseTopBar.ts
//   const user = parseUserHand(); // from parseUserHand.ts
//   const opponents = parseOpponentHands(); // from parseOpponentHand.ts
//   const markets = parseTradeBoards(); // from parseTradeBoards.ts
//   const tradeHistory = parseTradeHistory(); // from parseTradeHistory.ts

//   // Step 3: As requested, isolate only the most recent trade.
//   // The first element in the tradeHistory array is the most recent one.
//   const lastTrade = tradeHistory[0] || null;

//   // Step 4: Assemble all the data into a single, comprehensive object.
//   const fullGameState = {
//     gameInfo,
//     user,
//     opponents,
//     markets,
//     lastTrade
//   };

//   // Optional: Log the final object to the console for easy debugging.
//   console.log("--- FIGGIE GENIUS: FULL GAME STATE SNAPSHOT ---");
//   console.log(JSON.stringify(fullGameState, null, 2));

//   return fullGameState;
// }

// console.log(getGameStateSnapshot());