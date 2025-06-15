// src/content.ts

import { getGameStateSnapshot } from '@/parsing/parsing';

console.log("Content script loaded. Setting up trade observer...");

function observeTradeHistory() {
  const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                .find(div => (div as HTMLElement).innerText.trim() === 'Trade History');

  if (!tradeHistoryHeader) {
    console.warn("Could not find 'Trade History' header. Retrying...");
    setTimeout(observeTradeHistory, 2000);
    return;
  }

  const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
  const listContainer = commonContainer?.querySelector('div[class*="r-150rngu"]');

  if (!listContainer) {
    console.error("Could not find the trade list container to observe.");
    return;
  }

  // FIX: Add explicit types for the callback parameters.
  const callback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('New trade detected!');
        getGameStateSnapshot();
      }
    }
  };

  const observer = new MutationObserver(callback);
  const config = { childList: true, subtree: true };
  observer.observe(listContainer, config);

  console.log("SUCCESS: Now observing the trade history for new trades.");
}

setTimeout(observeTradeHistory, 500);