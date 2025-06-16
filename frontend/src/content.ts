// src/content.ts
import { getGameStateSnapshot } from '@/parsing/parsing';

// ... (keep your debounce function here) ...
function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const handleNewTrade = () => {
  const gameState = getGameStateSnapshot();
  if (gameState) {
    // Send the new game state to the background script.
    chrome.runtime.sendMessage({ type: "GAME_STATE_UPDATE", payload: gameState });
  }
};

const debouncedHandleNewTrade = debounce(handleNewTrade, 250);

function observeTradeHistory() {
  // ... (the code to find the listContainer remains the same) ...
  const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                .find(div => (div as HTMLElement).innerText.trim() === 'Trade History');
  if (!tradeHistoryHeader) {
    setTimeout(observeTradeHistory, 2000);
    return;
  }
  const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
  const listContainer = commonContainer?.querySelector('div[class*="r-150rngu"]');
  if (!listContainer) return;

  const callback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        debouncedHandleNewTrade();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(listContainer, { childList: true, subtree: true });

  console.log("SUCCESS: Now observing the trade history for new trades.");
}

setTimeout(observeTradeHistory, 500);