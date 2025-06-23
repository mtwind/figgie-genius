// src/content.ts

import { parsePlayers } from "@/parsing/players";
import { getTrades } from "@/parsing/wrappers";
import { AllPlayers, MarketHistory } from "./types";

// This variable will store the unique ID of the last processed trade.
let lastProcessedTradeId: string | null = null;

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

const handleNewTrade = () => {
  // --- FIX: Get ALL trades first to find the total count ---
  const allTrades = getTrades(false);
  if (!allTrades || allTrades.length === 0) {
    return;
  }

  const mostRecentTrade = allTrades[0].trade;
  if (!mostRecentTrade) return;

  // --- FIX: Create a more robust unique ID ---
  // We now include the total number of trades (the length of the array) in the ID.
  const currentTradeId = `${mostRecentTrade.buyer.name}-${mostRecentTrade.suit}-${mostRecentTrade.seller.name}-${mostRecentTrade.price}-${allTrades.length}`;

  // Only proceed if the trade ID is new.
  if (currentTradeId !== lastProcessedTradeId) {
    console.log(`New unique trade processed: ${currentTradeId}`);
    lastProcessedTradeId = currentTradeId; // Update the last processed ID

    const allPlayers: AllPlayers = {
      players: parsePlayers() ?? [],
    };

    // We can derive the market events from the most recent trade.
    const marketHistory: MarketHistory = {
      market: [allTrades[0].buy, allTrades[0].sell].filter(
        (item): item is NonNullable<typeof item> => item !== null
      ),
    };

    chrome.runtime.sendMessage({
      type: "NEW_TRANSACTION_EVENT",
      payload: {
        trade: allTrades[0],
        allPlayers: allPlayers,
        marketHistory: marketHistory,
      },
    });
  }
};

const debouncedHandleNewTrade = debounce(handleNewTrade, 150);

function observeTradeHistory() {
  const tradeHistoryHeader = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((div) => (div as HTMLElement).innerText.trim() === "Trade History");

  if (!tradeHistoryHeader) {
    setTimeout(observeTradeHistory, 2000);
    return;
  }

  const listContainer =
    tradeHistoryHeader.parentElement?.parentElement?.querySelector(
      'div[class*="r-150rngu"]'
    );
  if (!listContainer) return;

  const callback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        debouncedHandleNewTrade();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(listContainer, { childList: true, subtree: true });
  console.log("SUCCESS: Now observing the trade history for new trades.");
}

// Initial setup
setTimeout(observeTradeHistory, 1500);
