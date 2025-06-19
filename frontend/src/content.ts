// src/content.ts

import { parsePlayers } from "@/parsing/players";
import { getTrades } from "@/parsing/wrappers";
import { AllPlayers, MarketHistory } from "./types";

// Debounce function to ensure we only fire once per trade event.
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// This is the single handler that runs when a new trade is detected.
const handleNewTrade = () => {
  // console.log("New trade detected. Fetching data...");

  // 1. Get ONLY the most recent trade by calling the wrapper with 'true'.
  const newTradeArray = getTrades(true);

  // 2. Get the updated state of all players.
  const allPlayers: AllPlayers = {
    players: parsePlayers() ?? [],
  };

  const marketHistory: MarketHistory = {
    market:
      newTradeArray && newTradeArray[0]
        ? [newTradeArray[0].buy, newTradeArray[0].sell].filter(
            (item): item is NonNullable<typeof item> => item !== null
          )
        : [],
  };

  if (
    newTradeArray &&
    newTradeArray.length > 0 &&
    allPlayers.players &&
    allPlayers.players.length > 0
  ) {
    console.log("NEW_TRANSACTION_EVENT: ", {
      trade: newTradeArray[0],
      allPlayers: allPlayers,
      marketHistory: marketHistory,
    });
    // 3. Send the single new trade and the updated player list to the background.
    chrome.runtime.sendMessage({
      type: "NEW_TRANSACTION_EVENT",
      payload: {
        trade: newTradeArray[0], // Send the first (and only) item in the array
        allPlayers: allPlayers,
        marketHistory: marketHistory,
      },
    });
  }
};

const debouncedHandleNewTrade = debounce(handleNewTrade, 250);

function observeTradeHistory() {
  const tradeHistoryHeader = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((div) => (div as HTMLElement).innerText.trim() === "Trade History");

  if (!tradeHistoryHeader) {
    console.warn("Could not find 'Trade History' header. Retrying...");
    setTimeout(observeTradeHistory, 2000);
    return;
  }

  const listContainer =
    tradeHistoryHeader.parentElement?.parentElement?.querySelector(
      'div[class*="r-150rngu"]'
    );
  if (!listContainer) {
    console.error("Could not find trade list container to observe.");
    return;
  }

  const callback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      // We only care about when new elements are added to the trade history list.
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // console.log("New Trade");
        debouncedHandleNewTrade();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(listContainer, { childList: true, subtree: true });
  console.log("SUCCESS: Now observing the trade history for new trades.");
}

// Wait a moment for the page to be ready before setting up the observer.
setTimeout(observeTradeHistory, 1500);
