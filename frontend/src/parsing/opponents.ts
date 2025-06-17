// src/parsing/parseOpponentHand.ts

import type { PlayerData } from '@/types'; // Import the unified PlayerData type

/**
 * Parses the container holding all opponent dashboards to extract data for each one.
 * This function is completely size-agnostic and type-safe.
 * @param opponentsWrapper The main div element that contains the three opponent blocks.
 * @returns An array of PlayerData objects.
 */
export function parseOpponents(opponentsWrapper: Element): PlayerData[] {
  if (!opponentsWrapper) {
    console.error("The provided opponentsWrapper element is invalid.");
    return [];
  }

  const opponentsData: PlayerData[] = [];
  const opponentContainers = opponentsWrapper.children;

  for (const container of Array.from(opponentContainers)) {
    const headerBar = container.querySelector('div[style*="background-color"]') as HTMLElement | null;
    if (!headerBar) continue;

    // Parse Color
    const backgroundColor = headerBar.style.backgroundColor;
    let color = 'unknown';
    if (backgroundColor.includes('26, 167, 123')) color = 'green';
    else if (backgroundColor.includes('239, 64, 67')) color = 'red';
    else if (backgroundColor.includes('239, 168, 35')) color = 'orange';

    // Parse Name & Chips using THIS opponent's chip icon as an anchor
    const opponentChipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
    const chipIconContainer = opponentChipIcon?.parentElement;

    const nameElement = chipIconContainer?.previousElementSibling as HTMLElement | null;
    const name = nameElement?.innerText.trim() || 'N/A';
    
    const chipsElement = opponentChipIcon?.nextElementSibling as HTMLElement | null;
    const chips = chipsElement?.innerText.trim() || 'N/A';

    // Find Total Card Count using the purple card stack icon
    const totalCardsIcon = container.querySelector('svg[id*="purple_cards_desktop_svg"]');
    const totalCardsElement = totalCardsIcon?.parentElement?.nextElementSibling?.querySelector('div[dir="auto"]') as HTMLElement | null;
    const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;
    
    // Find Card Changes (+/-) using a structural selector
    const cardChanges: { [key: string]: string } = {};
    const tradesContainer = container.querySelector('div[style*="flex-direction: column;"]');
    
    if (tradesContainer) {
      for (const row of Array.from(tradesContainer.children)) {
        const tradeValueElement = row.lastElementChild?.querySelector('div[dir="auto"]') as HTMLElement | null;
        const suitIcon = row.querySelector('svg');
        
        if (!suitIcon || !tradeValueElement) continue;

        let suit = 'Unknown';
        const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
        if (pathData.includes('M47.37')) suit = 'Spades';
        else if (pathData.includes('M40.22')) suit = 'Clubs';
        else if (pathData.includes('M30.9')) suit = 'Diamonds';
        else if (pathData.includes('M55.11')) suit = 'Hearts';

        if (suit !== 'Unknown') {
          cardChanges[suit] = tradeValueElement.innerText.trim() || '0';
        }
      }
    }

    opponentsData.push({
      isUser: false,
      name,
      color,
      chips,
      totalCards,
      hand: { Spades: 0, Clubs: 0, Diamonds: 0, Hearts: 0 },
      cardChanges,
    });
  }

  return opponentsData;
}