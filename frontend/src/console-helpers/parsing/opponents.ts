// /**
//  * Parses the container holding all opponent dashboards to extract data for each one.
//  * @param {HTMLElement} opponentsWrapper The main div element that contains the three opponent blocks.
//  * @returns {Array<object>} An array of objects, each containing parsed data for one opponent.
//  */
// function parseOpponentHands(opponentsWrapper) {
//     if (!opponentsWrapper) {
//       console.error("The provided opponentsWrapper element is invalid.");
//       return [];
//     }
  
//     const opponentsData = [];
//     const opponentContainers = opponentsWrapper.children;
  
//     for (const container of opponentContainers) {
//       const headerBar = container.querySelector('div[style*="background-color"]');
//       if (!headerBar) continue;
  
//       // Parse Color
//       const backgroundColor = headerBar.style.backgroundColor;
//       let color = 'unknown';
//       if (backgroundColor.includes('26, 167, 123')) color = 'green';
//       else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//       else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
//       // Parse Name & Chips
//       const opponentChipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
//       const chipIconContainer = opponentChipIcon?.parentElement;
  
//       const nameElement = chipIconContainer?.previousElementSibling;
//       const name = nameElement?.innerText.trim() || 'N/A';
      
//       // --- FIX: Use the more specific nextElementSibling selector for chips ---
//       const chipsElement = opponentChipIcon?.nextElementSibling;
//       const chips = chipsElement?.innerText.trim() || 'N/A';
  
//       // Find Total Card Count
//       const totalCardsIcon = container.querySelector('svg[id*="purple_cards_desktop_svg"]');
//       const totalCardsElement = totalCardsIcon?.parentElement?.nextElementSibling?.querySelector('div[dir="auto"]');
//       const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;
      
//       // Find Card Changes
//       const cardChanges = {};
//       const tradesContainer = container.querySelector('div[style*="flex-direction: column;"]');
      
//       if (tradesContainer) {
//         for (const row of tradesContainer.children) {
//           const tradeValueElement = row.lastElementChild.querySelector('div[dir="auto"]');
//           const suitIcon = row.querySelector('svg');
          
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
//         isUser: false,
//         name,
//         color,
//         chips,
//         totalCards,
//         hand: { Spades: 0, Clubs: 0, Diamonds: 0, Hearts: 0 },
//         cardChanges,
//       });
//     }
  
//     console.log("Parsed Opponent Data:", opponentsData);
//     return opponentsData;
//   }


