// src/parsing/parseTopBar.ts

/**
 * Defines the shape of the object returned by the parser.
 */
interface TopBarInfo {
  timeRemaining: string;
  gameName: string;
  round: string;
}

/**
 * Parses the top bar for time, game name, and round number using font-size-safe selectors.
 * @returns A TopBarInfo object or null if essential elements aren't found.
 */
export function parseTopBar(): TopBarInfo | null {
  // Find the timer by looking for the only text that contains a colon.
  // TS-FIX: We cast 'el' to HTMLElement to safely access .innerText.
  const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                            .find(el => (el as HTMLElement).innerText.includes(':')) as HTMLElement | undefined;

  // Find the round number text.
  const roundElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                           .find(el => (el as HTMLElement).innerText.startsWith('Round ')) as HTMLElement | undefined;
  
  // TS-FIX: Declare gameNameElement with its potential types.
  let gameNameElement: Element | null = null;

  // Use optional chaining (?.) to safely access properties that might be null.
  if (roundElement) {
    const parentContainer = roundElement.parentElement?.parentElement;
    if (parentContainer) {
      gameNameElement = parentContainer.firstElementChild;
    }
  }
  
  // If any of the key elements weren't found, we can't continue.
  if (!timerElement || !gameNameElement || !roundElement) {
      console.error("Could not parse all required elements from the top bar.");
      return null;
  }

  const gameInfo: TopBarInfo = {
    // TS-FIX: We know these elements exist now, so we can safely access innerText.
    timeRemaining: timerElement.innerText.trim(),
    gameName: (gameNameElement as HTMLElement).innerText.trim(),
    round: roundElement.innerText.trim()
  };
  
  return gameInfo;
}