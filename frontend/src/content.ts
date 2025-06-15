// frontend/src/content.ts

import { getGameStateSnapshot } from '@/parsing/parsing';

/**
 * A type-safe debounce function using generics.
 * It ensures that the debounced function has the same arguments
 * as the original function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 */
function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  // TS-FIX: Define the type for the timeout identifier.
  let timeoutId: ReturnType<typeof setTimeout>;

  // TS-FIX: Use TypeScript's utility types to correctly type the arguments.
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Create a debounced version of our snapshot function.
// This is now fully type-checked.
const debouncedGetGameState = debounce(getGameStateSnapshot, 100);

/**
 * Finds the trade history list and starts observing it for new trades.
 */
function observeTradeHistory() {
  const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                .find(div => (div as HTMLElement).innerText.trim() === 'Trade History');

  if (!tradeHistoryHeader) {
    console.warn("Could not find 'Trade History' header to set up observer. Will retry in 2 seconds.");
    setTimeout(observeTradeHistory, 2000);
    return;
  }

  const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
  const listContainer = commonContainer?.querySelector('div[class*="r-150rngu"]');

  if (!listContainer) {
    console.error("Could not find the trade list container to observe.");
    return;
  }

  // The types for the MutationObserver callback are already correct.
  const callback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('New trade change detected! Triggering debounced snapshot...');
        debouncedGetGameState();
      }
    }
  };

  const observer = new MutationObserver(callback);
  const config = { 
    childList: true,
    subtree: true 
  };

  observer.observe(listContainer, config);

  console.log("SUCCESS: Now observing the trade history for new trades.");
}

// Start the process after a short delay.
setTimeout(observeTradeHistory, 500);