// export function parseOpponentHands() {
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