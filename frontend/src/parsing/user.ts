// src/parsing/parseUserHand.ts

import type { PlayerData } from '@/types'; // Import the unified PlayerData type

/**
 * Parses the user's dashboard by taking the container element as input and
 * using icon-based anchors to be size-agnostic.
 * @param userContainer The main div element for the user's dashboard.
 * @returns A PlayerData object or null if parsing fails.
 */
export function parseUser(userContainer: Element): PlayerData | null {
  if (!userContainer) {
    console.error("The provided userContainer element is invalid.");
    return null;
  }

  // --- Parse data from within the provided userContainer ---

  const headerBar = userContainer.querySelector('div[style*="background-color"]') as HTMLElement | null;
  if (!headerBar) {
    console.error("Could not find the header bar within the user container.");
    return null;
  }

  // Parse Color
  const backgroundColor = headerBar.style.backgroundColor;
  let color = 'unknown';
  if (backgroundColor.includes('39, 115, 222')) color = 'blue';
  else if (backgroundColor.includes('26, 167, 123')) color = 'green';
  else if (backgroundColor.includes('239, 64, 67')) color = 'red';
  else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

  // Parse Name and Chips by finding the chip icon within the header
  const chipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
  const chipIconContainer = chipIcon?.parentElement;
  const nameElement = chipIconContainer?.previousElementSibling?.querySelector('div[dir="auto"]') as HTMLElement | null;
  const name = nameElement?.innerText.trim() || 'N/A';
  
  const chipsElement = chipIcon?.nextElementSibling as HTMLElement | null;
  const chips = chipsElement?.innerText.trim() || 'N/A';

  // Parse Hand, Card Changes, and Total Cards
  const hand: { [key: string]: number } = {};
  const cardChanges: { [key: string]: string } = {};
  let totalCards = 0;
  
  const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
  if (cardRow) {
    for (const cardDiv of Array.from(cardRow.children)) {
      const textContainer = cardDiv.querySelector('div[style*="align-items: center;"]');
      if (!textContainer) continue;

      const countElement = textContainer.firstElementChild as HTMLElement | null;
      const changeElement = countElement?.nextElementSibling as HTMLElement | null;
      
      const countStr = countElement?.innerText || '0';
      const count = parseInt(countStr, 10);
      const changeStr = changeElement?.innerText.trim() || '0';
      
      const svgId = cardDiv.querySelector('svg')?.id || '';
      let suit = 'Unknown';
      if (svgId.includes('spades')) suit = 'Spades';
      else if (svgId.includes('clubs')) suit = 'Clubs';
      else if (svgId.includes('diamonds')) suit = 'Diamonds';
      else if (svgId.includes('hearts')) suit = 'Hearts';
      
      if (suit !== 'Unknown') {
        hand[suit] = count;
        cardChanges[suit] = changeStr;
        totalCards += count;
      }
    }
  }

  const userData: PlayerData = {
    isUser: true,
    name,
    color,
    chips,
    totalCards,
    hand,
    cardChanges,
  };

  return userData;
}