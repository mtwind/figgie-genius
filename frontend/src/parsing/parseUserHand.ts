// src/parsing/parseUserHand.ts

import type { PlayerData } from '@/types'; // Import your main UserData interface

/**
 * Parses the user's dashboard by anchoring on the stable chip icon and traversing
 * the HTML structure. This function is completely size-agnostic and type-safe.
 * @returns A UserData object or null if parsing fails.
 */
export function parseUserHand(): PlayerData | null {
  // Step 1: Find the user's chip icon, our reliable anchor.
  const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');

  if (!chipIcon) {
    console.error("Could not find the user's chip icon to anchor the search.");
    return null;
  }

  // Step 2: From the icon, find the header bar and the main user container.
  const headerBar = chipIcon.closest('div[style*="background-color"]') as HTMLElement | null;
  const userContainer = headerBar?.parentElement;

  if (!headerBar || !userContainer) {
    console.error("Could not find the user's header or main container from the chip icon.");
    return null;
  }
  
  // --- Step 3: Now that we have the correct containers, parse the data ---

  // Parse Color
  const backgroundColor = headerBar.style.backgroundColor;
  let color = 'unknown';
  if (backgroundColor.includes('39, 115, 222')) color = 'blue';
  else if (backgroundColor.includes('26, 167, 123')) color = 'green';
  else if (backgroundColor.includes('239, 64, 67')) color = 'red';
  else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

  // Parse Name and Chips by their position relative to the chip icon.
  const chipIconContainer = chipIcon.parentElement;
  const nameElement = chipIconContainer?.previousElementSibling?.querySelector('div[dir="auto"]') as HTMLElement | null;
  const name = nameElement?.innerText.trim() || 'N/A';
  
  const chipsElement = chipIcon.nextElementSibling as HTMLElement | null;
  const chips = chipsElement?.innerText.trim() || 'N/A';

  // Parse Hand, Card Changes, and Total Cards
  const hand: { [key: string]: number } = {};
  const cardChanges: { [key: string]: string } = {};
  let totalCards = 0;
  const cardRow = userContainer.querySelector('div[style*="align-self: center"]');

  if (cardRow) {
    for (const cardDiv of Array.from(cardRow.children)) {
      // Find the card count div by its structural position.
      const countElement = cardDiv.querySelector('div[dir="auto"]') as HTMLElement | null;
      const countStr = countElement?.innerText || '0';
      const count = parseInt(countStr, 10);
      
      // Correctly find the changeElement as the next sibling of the countElement.
      const changeElement = countElement?.nextElementSibling as HTMLElement | null;
      const changeStr = changeElement?.innerText.trim() || '+0';
      
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
    isUser: true, // Flag this player as the user
    name,
    color,
    chips,
    totalCards,
    hand,
    cardChanges,
  };

  return userData;
}