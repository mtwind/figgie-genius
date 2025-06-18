// /**
//  * Parses the user's dashboard element to extract all relevant data.
//  * @param {HTMLElement} userContainer The main div element for the user's dashboard.
//  * @returns {object|null} An object with the parsed user data, or null if parsing fails.
//  */
// function parseUserHand(userContainer) {
//     if (!userContainer) {
//       console.error("The provided userContainer element is invalid.");
//       return null;
//     }

//     // --- Parse the data from within the provided userContainer ---

//     const headerBar = userContainer.querySelector('div[style*="background-color: rgb(255,255,255)"]');
//     if (!headerBar) {
//       console.error("Could not find the header bar within the user container.");
//       return null;
//     }

//     // Parse Color
//     const backgroundColor = headerBar.style.backgroundColor;
//     let color = 'unknown';
//     if (backgroundColor.includes('39, 115, 222')) color = 'blue';
//     else if (backgroundColor.includes('26, 167, 123')) color = 'green';
//     else if (backgroundColor.includes('239, 64, 67')) color = 'red';
//     else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

//     // Parse Name and Chips by finding the chip icon within the header
//     const chipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
//     const chipIconContainer = chipIcon?.parentElement;
//     const nameElement = chipIconContainer?.previousElementSibling?.querySelector('div[dir="auto"]');
//     const name = nameElement?.innerText.trim() || 'N/A';

//     const chipsElement = chipIcon?.nextElementSibling;
//     const chips = chipsElement?.innerText.trim() || 'N/A';

//     // Parse Hand, Card Changes, and Total Cards
//     const hand = {};
//     const cardChanges = {};
//     let totalCards = 0;

//     const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
//     if (cardRow) {
//       for (const cardDiv of cardRow.children) {
//         const textContainer = cardDiv.querySelector('div[style*="align-items: center;"]');
//         if (!textContainer) continue;

//         const countElement = textContainer.firstElementChild;
//         const changeElement = countElement?.nextElementSibling;

//         const countStr = countElement?.innerText || '0';
//         const count = parseInt(countStr, 10);

//         // FIX: Default to the string '0' if the change element is empty or not found.
//         const changeStr = changeElement?.innerText.trim() || '0';

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
//       isUser: true,
//       name,
//       color,
//       chips,
//       totalCards,
//       hand,
//       cardChanges,
//     };

//     console.log("Parsed User Data:", userData);
//     return userData;
//   }
