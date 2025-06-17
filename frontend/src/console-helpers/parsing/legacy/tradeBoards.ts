// function parseTradeBoards() {
//     console.log("--- Running Final, Structurally-Anchored Trade Board Parser ---");
  
//     // Step 1 & 2: Use the user-provided, working logic to find the user's main container.
//     const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
//     if (!userChipIcon) {
//       console.error("Could not find the user's chip icon to start the search.");
//       return {};
//     }
//     const userContainer = userChipIcon.closest('div[style*="background-color: rgb(255, 255, 255)"]');
//     if (!userContainer) {
//       console.error("Could not find the user's main container from the chip icon.");
//       return {};
//     }
  
//     // Step 3: As you correctly instructed, find the trade board container relative to the user's container.
//     const opponentsWrapper = userContainer.nextElementSibling;
//     const tradeBoardsContainer = opponentsWrapper?.nextElementSibling;
  
//     if (!tradeBoardsContainer) {
//       console.error("Could not find the trade boards' container.");
//       return {};
//     }
  
//     const tradeBoardsData = {};
//     const suitRowWrappers = tradeBoardsContainer.children;
  
//     for (const wrapper of suitRowWrappers) {
//       // The actual row is nested one level down inside the wrapper.
//       const suitRow = wrapper.firstElementChild;
//       if (!suitRow || suitRow.children.length < 3) continue;
      
//       const [bidSide, centerIconContainer, offerSide] = suitRow.children;
  
//       // --- Parse Center Column ---
//       const suitIcon = centerIconContainer.querySelector('svg');
//       const lastSaleElement = centerIconContainer.querySelector('div[dir="auto"]');
//       const lastSale = lastSaleElement?.innerText.trim() || 'N/A';
  
//       let suit = 'Unknown';
//       if (suitIcon) {
//         const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//         if (pathData.includes('M47.37')) suit = 'Spades';
//         else if (pathData.includes('M40.22')) suit = 'Clubs';
//         else if (pathData.includes('M30.9')) suit = 'Diamonds';
//         else if (pathData.includes('M55.11')) suit = 'Hearts';
//       }
  
//       // --- Helper to parse color from background gradient ---
//       const parseColorFromStyle = (element) => {
//         const style = element?.style.backgroundImage;
//         if (!style) return 'none';
//         if (style.includes('26, 167, 123')) return 'green';
//         if (style.includes('239, 64, 67')) return 'red';
//         if (style.includes('239, 168, 35')) return 'orange';
//         if (style.includes('39, 115, 222')) return 'blue';
//         return 'none';
//       };
  
//       // --- Parse Bid (Left) Side ---
//       const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
//       // Correctly find the public price display, not the input field.
//       const bidPriceElement = bidDisplay?.querySelector('div[dir="auto"]');
//       const bidPrice = bidPriceElement?.innerText.trim() || "";
//       const bidColor = parseColorFromStyle(bidDisplay);
  
//       // --- Parse Offer (Right) Side ---
//       const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
//       // Correctly find the public price display.
//       const offerPriceElement = offerDisplay?.querySelector('div[dir="auto"]');
//       const offerPrice = offerPriceElement?.innerText.trim() || "";
//       const offerColor = parseColorFromStyle(offerDisplay);
  
//       if (suit !== 'Unknown') {
//         tradeBoardsData[suit] = {
//           lastSale,
//           bid: bidPrice,
//           bidColor,
//           offer: offerPrice,
//           offerColor
//         };
//       }
//     }
  
//     console.log("Parsed Trade Boards Data:", tradeBoardsData);
//     return tradeBoardsData;
//   }


//   parseTradeBoards();