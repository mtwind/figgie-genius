// src/parsing/parseTopBar.ts

export function parseTopBar() {
  const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                            // FIX: Assert the type of 'el' to be HTMLElement
                            .find(el => (el as HTMLElement).innerText.includes(':')) as HTMLElement | undefined;

  const gameNameElement = document.querySelector('div[style*="font-size: 20px"]') as HTMLElement | null;

  const roundElement = Array.from(document.querySelectorAll('div[style*="font-size: 14px"]'))
                            .find(el => (el as HTMLElement).innerText.includes('Round')) as HTMLElement | undefined;

  const gameInfo = {
    timeRemaining: timerElement?.innerText.trim() || 'N/A',
    gameName: gameNameElement?.innerText.trim() || 'N/A',
    round: roundElement?.innerText.trim() || 'N/A'
  };
  
  return gameInfo;
}