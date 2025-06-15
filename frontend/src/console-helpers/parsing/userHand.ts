// export function parseUserHand() {
//   // Step 1: Find all chip icons to reliably identify the four player header bars.
//   const allChipIcons = document.querySelectorAll('svg[id*="chip_desktop_svg"]');
  
//   if (allChipIcons.length === 0) {
//     console.error("Could not find any chip icons on the page.");
//     return null;
//   }

//   let userHeaderBar = null;

//   // Step 2: Loop through the parent header of each chip icon.
//   for (const icon of allChipIcons) {
//     // Find the containing header bar for this icon.
//     const headerBar = icon.closest('div[style*="background-color"]');
//     if (!headerBar) continue;

//     // Step 3: Check if THIS header bar contains the user's unique larger font size.
//     const largeText = headerBar.querySelector('div[style*="font-size: 20px"]');
//     if (largeText) {
//       // If it does, this MUST be the user's header. We found it.
//       userHeaderBar = headerBar;
//       break;
//     }
//   }

//   if (!userHeaderBar) {
//     console.error("Could not find the user's header bar by process of elimination.");
//     return null;
//   }

//   // --- Step 4: Now that we have the correct user's header, parse all data from it. ---

//   const userContainer = userHeaderBar.parentElement;
//   if (!userContainer) return null;

//   const backgroundColor = userHeaderBar.style.backgroundColor;
//   let color = 'unknown';
//   if (backgroundColor.includes('39, 115, 222')) color = 'blue';
//   else if (backgroundColor.includes('26, 167, 123')) color = 'green';
//   else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//   else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

//   const textElementsInBar = userHeaderBar.querySelectorAll('div[style*="font-size: 20px"]');
//   const name = textElementsInBar[0]?.innerText.trim() || 'N/A';
//   const chips = textElementsInBar[1]?.innerText.trim() || 'N/A';
  
//   const hand = {};
//   let totalCards = 0;
//   const cardRow = userContainer.querySelector('div[style*="align-self: center"]');

//   if (cardRow) {
//     for (const cardDiv of cardRow.children) {
//       const countStr = cardDiv.querySelector('div[style*="font-size: 20px"]')?.innerText || '0';
//       const count = parseInt(countStr, 10);
      
//       const svgId = cardDiv.querySelector('svg')?.id || '';
//       let suit = 'Unknown';
//       if (svgId.includes('spades')) suit = 'Spades';
//       else if (svgId.includes('clubs')) suit = 'Clubs';
//       else if (svgId.includes('diamonds')) suit = 'Diamonds';
//       else if (svgId.includes('hearts')) suit = 'Hearts';
      
//       if (suit !== 'Unknown') {
//         hand[suit] = count;
//         totalCards += count;
//       }
//     }
//   }

//   const userData = { name, color, chips, totalCards, hand };
//   console.log("User Data (Final, Robust Version):", userData);
//   return userData;
// }