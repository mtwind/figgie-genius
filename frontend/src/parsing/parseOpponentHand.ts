// src/parsing/parseOpponentHand.ts

export function parseOpponentHands() {
  const userContainer = document.querySelector('div[style*="border-top-left-radius: 2px"]');
  if (!userContainer) return [];
  const opponentsWrapper = userContainer.nextElementSibling;
  if (!opponentsWrapper) return [];

  const opponentsData = [];
  for (const container of Array.from(opponentsWrapper.children)) {
    const headerBar = container.querySelector('div[style*="background-color"]') as HTMLElement | null;
    if (!headerBar) continue;

    const backgroundColor = headerBar.style.backgroundColor;
    let color = 'unknown';
     if (backgroundColor.includes('26, 167, 123')) color = 'green';
     // ... (other color checks)

    const nameElement = headerBar.querySelector('div[style*="font-size: 14px"]') as HTMLElement | null;
    const name = nameElement?.innerText.trim() || 'N/A';

    const chipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
    const chipsElement = chipIcon?.nextElementSibling as HTMLElement | null;
    const chips = chipsElement?.innerText.trim() || 'N/A';
    
    const totalCardsElement = container.querySelector('div[style*="font-size: 24px; color: rgb(255, 255, 255);"]') as HTMLElement | null;
    const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;

    // FIX: Give cardChanges an explicit type
    const cardChanges: { [key: string]: string } = {};
    const tradesContainer = container.querySelector('div[style*="flex-direction: column;"]');
    if (tradesContainer) {
      for (const row of Array.from(tradesContainer.children)) {
        const suitIcon = row.querySelector('svg');
        const tradeValueElement = row.querySelector('div[style*="font-size: 16px;"][style*="align-self: flex-end;"]') as HTMLElement | null;
        if (!suitIcon || !tradeValueElement) continue;

        let suit = 'Unknown';
        const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
        if (pathData.includes('M47.37')) suit = 'Spades';
        // ... (other suit checks)

        if (suit !== 'Unknown') {
          cardChanges[suit] = tradeValueElement.innerText.trim() || '0';
        }
      }
    }
    opponentsData.push({ name, color, chips, totalCards, cardChanges });
  }
  return opponentsData;
}

