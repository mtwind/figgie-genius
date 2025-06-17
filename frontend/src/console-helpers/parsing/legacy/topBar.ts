// function parseTopBar() {
//     console.log("--- Running Final Top Bar Parser ---");
  
//     // This method for finding the timer is robust and correct.
//     const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
//                               .find(el => el.innerText.includes(':'));
  
//     // --- New, More Accurate Logic for Game Name and Round ---
  
//     // Find the 'Round' text first.
//     const roundElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
//                              .find(el => el.innerText.startsWith('Round '));
    
//     let gameNameElement = null;
//     // Check if we found the round element before proceeding.
//     if (roundElement) {
//       // The parent container holds both the game name and the round info line.
//       const parentContainer = roundElement.parentElement.parentElement;
      
//       // The game name div is the first child of this parent container.
//       // The text of this element might be the game name or "Paused".
//       gameNameElement = parentContainer.firstElementChild;
//     }
    
//     const gameInfo = {
//       timeRemaining: timerElement?.innerText.trim() || 'N/A',
//       // We now correctly reference the gameNameElement found via hierarchy.
//       gameName: gameNameElement?.innerText.trim() || 'N/A',
//       round: roundElement?.innerText.trim() || 'N/A'
//     };
    
//     console.log("Parsed Top Bar Info:", gameInfo);
//     return gameInfo;
//   }
  
//   // To run, paste the code above into the console, then run this line:
//   parseTopBar();