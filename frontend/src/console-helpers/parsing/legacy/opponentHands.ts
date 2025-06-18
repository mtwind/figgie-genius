// function parseOpponentHands() {
//     console.log("--- Running Final Opponent Parser (Name Fix v2) ---");

//     // Step 1: Find the user's chip icon first, which we know is a reliable anchor.
//     const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
//     if (!userChipIcon) {
//       console.error("Could not find the user's chip icon to start the search.");
//       return [];
//     }

//     // Step 2: From the chip icon, find the user's main container.
//     const userContainer = userChipIcon.closest('div[style*="background-color: rgb(255, 255, 255)"]');
//     if (!userContainer) {
//       console.error("Could not find the user's main container from the chip icon.");
//       return [];
//     }

//     // Step 3: The container for ALL opponents is the direct next sibling of the user's container.
//     const opponentsWrapper = userContainer.nextElementSibling;
//     if (!opponentsWrapper) {
//       console.error("Could not find the opponents' container next to the user's container.");
//       return [];
//     }

//     const opponentsData = [];
//     const opponentContainers = opponentsWrapper.children;

//     for (const container of opponentContainers) {
//       const headerBar = container.querySelector('div[style*="background-color: rgb(255,255,255)"]');
//       if (!headerBar) continue;

//       // Parse Color
//       const backgroundColor = headerBar.style.backgroundColor;
//       let color = 'unknown';
//       if (backgroundColor.includes('26, 167, 123')) color = 'green';
//       else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//       else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

//       // --- FIX: Get Player Name directly from the header ---
//       const nameElement = headerBar.querySelector('div[dir="auto"]');
//       const name = nameElement?.innerText.trim() || 'N/A';

//       // Parse Chips using THIS opponent's chip icon as an anchor
//       const opponentChipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
//       const chipsElement = opponentChipIcon?.nextElementSibling;
//       const chips = chipsElement?.innerText.trim() || 'N/A';

//       // Find Total Card Count using the purple card stack icon
//       const totalCardsIcon = container.querySelector('svg[id*="purple_cards_desktop_svg"]');
//       const totalCardsElement = totalCardsIcon?.parentElement?.nextElementSibling?.querySelector('div[dir="auto"]');
//       const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;

//       // Find Card Changes (+/-) using a structural selector
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
//         name,
//         color,
//         chips,
//         totalCards,
//         cardChanges,
//       });
//     }

//     console.log("Parsed Opponent Data:", opponentsData);
//     return opponentsData;
//   }

//   parseOpponentHands();
