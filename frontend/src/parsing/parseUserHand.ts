// src/parsing/parseUserHand.ts

// Define a clear shape for the data this function will return.
interface UserHand {
  name: string;
  color: string;
  chips: string;
  totalCards: number;
  hand: { [key: string]: number };
}

// Add the return type to the function signature.
export function parseUserHand(): UserHand | null {
  // Find all chip icons to reliably identify the four player header bars.
  const allChipIcons = document.querySelectorAll('svg[id*="chip_desktop_svg"]');
  
  if (allChipIcons.length === 0) {
    console.error("Could not find any chip icons on the page.");
    return null;
  }

  // TS-FIX: Add an explicit type for the variable.
  let userHeaderBar: HTMLElement | null = null;

  // Loop through the NodeList of icons.
  for (const icon of allChipIcons) {
    // Find the containing header bar for this icon.
    // TS-FIX: Assert the result of .closest() to be an HTMLElement.
    const headerBar = icon.closest('div[style*="background-color"]') as HTMLElement | null;
    if (!headerBar) continue;

    // Check if THIS header bar contains the user's unique larger font size.
    const largeText = headerBar.querySelector('div[style*="font-size: 20px"]');
    if (largeText) {
      userHeaderBar = headerBar;
      break;
    }
  }

  if (!userHeaderBar) {
    console.error("Could not find the user's header bar by process of elimination.");
    return null;
  }

  const userContainer = userHeaderBar.parentElement;
  if (!userContainer) return null;

  // Parse Color
  const backgroundColor = userHeaderBar.style.backgroundColor;
  let color = 'unknown';
  if (backgroundColor.includes('39, 115, 222')) color = 'blue';
  else if (backgroundColor.includes('26, 167, 123')) color = 'green';
  else if (backgroundColor.includes('239, 64, 67')) color = 'red';
  else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

  // Parse Name and Chips
  const textElementsInBar = userHeaderBar.querySelectorAll('div[style*="font-size: 20px"]');
  const name = (textElementsInBar[0] as HTMLElement)?.innerText.trim() || 'N/A';
  const chips = (textElementsInBar[1] as HTMLElement)?.innerText.trim() || 'N/A';
  
  // TS-FIX: Give the 'hand' object an explicit index signature.
  const hand: { [key: string]: number } = {};
  let totalCards = 0;
  const cardRow = userContainer.querySelector('div[style*="align-self: center"]');

  if (cardRow) {
    // TS-FIX: Convert HTMLCollection to an array to loop safely.
    for (const cardDiv of Array.from(cardRow.children)) {
      const countStr = (cardDiv.querySelector('div[style*="font-size: 20px"]') as HTMLElement)?.innerText || '0';
      const count = parseInt(countStr, 10);
      
      const svgId = cardDiv.querySelector('svg')?.id || '';
      let suit = 'Unknown';
      if (svgId.includes('spades')) suit = 'Spades';
      else if (svgId.includes('clubs')) suit = 'Clubs';
      else if (svgId.includes('diamonds')) suit = 'Diamonds';
      else if (svgId.includes('hearts')) suit = 'Hearts';
      
      if (suit !== 'Unknown') {
        hand[suit] = count;
        totalCards += count;
      }
    }
  }

  const userData: UserHand = {
    name,
    color,
    chips,
    totalCards,
    hand,
  };

  console.log("User Data (Final, Type-Safe Version):", userData);
  return userData;
}