// /**
//  * Parses the top bar HTML element to extract time, game name, and round number.
//  * @param {HTMLElement} topBarElement The main div element for the top bar.
//  * @returns {object|null} An object with the parsed info, or null if parsing fails.
//  */
// function parseTopBar(topBarElement) {
//     if (!topBarElement) {
//       console.error("The provided topBarElement is invalid.");
//       return null;
//     }
  
//     // --- Find elements *within* the provided topBarElement ---
  
//     // Find the timer by its content (the ':').
//     const timerElement = Array.from(topBarElement.querySelectorAll('div[dir="auto"]'))
//                               .find(el => el.innerText.includes(':'));
  
//     // Find the 'eye' spectator icon to use as an anchor.
//     const spectatorIcon = topBarElement.querySelector('svg[id*="spectator_icon_svg"]');
    
//     // The 'Round' element is the previous sibling of the spectator icon's container.
//     const roundElement = spectatorIcon?.parentElement?.previousElementSibling;
    
//     // The 'Game Name' element is the first child of the Round element's parent container.
//     const gameNameElement = roundElement?.parentElement?.firstElementChild;
  
//     const gameInfo = {
//       timeRemaining: timerElement?.innerText.trim() || 'N/A',
//       gameName: gameNameElement?.innerText.trim() || 'N/A',
//       round: roundElement?.innerText.trim() || 'N/A'
//     };
    
//     console.log("Parsed Top Bar Info:", gameInfo);
//     return gameInfo;
//   }