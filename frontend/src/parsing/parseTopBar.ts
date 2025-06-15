export function parseTopBar() {
    // Find the timer by searching for the element whose text includes a colon ':'
    const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                              .find(el => el.innerText.includes(':'));
  
    // The selectors for these two were already working correctly
    const gameNameElement = document.querySelector('div[style*="font-size: 20px"]');
    const roundElement = Array.from(document.querySelectorAll('div[style*="font-size: 14px"]'))
                              .find(el => el.innerText.includes('Round'));
  
    const gameInfo = {
      timeRemaining: timerElement?.innerText.trim() || 'N/A',
      gameName: gameNameElement?.innerText.trim() || 'N/A',
      round: roundElement?.innerText.trim() || 'N/A'
    };
  
    console.log("Top Bar Info:", gameInfo);
    return gameInfo;
}