// function parseUserHand() {
//     // Step 1: Find the user's chip icon, our reliable anchor.
//     const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  
//     if (!chipIcon) {
//       console.error("Could not find the user's chip icon to anchor the search.");
//       return null;
//     }
  
//     // Step 2: From the icon, find the header bar and the main user container.
//     const headerBar = chipIcon.closest('div[style*="background-color"]');
//     const userContainer = headerBar?.parentElement;
  
//     if (!headerBar || !userContainer) {
//       console.error("Could not find the user's header or main container from the chip icon.");
//       return null;
//     }
    
//     // --- Step 3: Now that we have the correct containers, parse the data ---
  
//     // Parse Color from the header's background.
//     const backgroundColor = headerBar.style.backgroundColor;
//     let color = 'unknown';
//     if (backgroundColor.includes('39, 115, 222')) color = 'blue';
//     else if (backgroundColor.includes('26, 167, 123')) color = 'green';
//     else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//     else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
//     // Parse Name and Chips by their position relative to the chip icon.
//     const chipIconContainer = chipIcon.parentElement;
//     const nameElement = chipIconContainer?.previousElementSibling?.querySelector('div[dir="auto"]');
//     const name = nameElement?.innerText.trim() || 'N/A';
    
//     const chipsElement = chipIcon.nextElementSibling;
//     const chips = chipsElement?.innerText.trim() || 'N/A';
  
//     // Parse Hand and Total Cards from the card row below the header.
//     const hand = {};
//     const cardChanges = {};
//     let totalCards = 0;
//     const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
  
//     if (cardRow) {
//       for (const cardDiv of cardRow.children) {
//         // Find the card count div first.
//         const countElement = cardDiv.querySelector('div[dir="auto"]');
//         const countStr = countElement?.innerText || '0';
//         const count = parseInt(countStr, 10);
  
//         // --- FIX: Correctly find the changeElement as the next sibling of the countElement ---
//         const changeElement = countElement?.nextElementSibling;
//         const changeStr = changeElement?.innerText.trim() || '+0';
        
//         const svgId = cardDiv.querySelector('svg')?.id || '';
//         let suit = 'Unknown';
  
//         if (svgId.includes('spades')) suit = 'Spades';
//         else if (svgId.includes('clubs')) suit = 'Clubs';
//         else if (svgId.includes('diamonds')) suit = 'Diamonds';
//         else if (svgId.includes('hearts')) suit = 'Hearts';
        
//         if (suit !== 'Unknown') {
//           hand[suit] = count;
//           cardChanges[suit] = changeStr;
//           totalCards += count;
//         }
//       }
//     }
  
//     const userData = {
//       name,
//       color,
//       chips,
//       totalCards,
//       hand,
//       cardChanges,
//     };
  
//     console.log("User Data (Final Console Version):", userData);
//     return userData;
//   }

//   console.log(parseUserHand());