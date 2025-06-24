// src/content.ts

import { parseAll } from "@/parsing/parseAll";
import { getTrades } from "@/parsing/wrappers";
import { FullGameState, MarketHistory } from "./types";

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

    const fullGame = parseAll();

    // We can derive the market events from the most recent trade.
    const marketHistory: MarketHistory = {
      market: [allTrades[0].buy, allTrades[0].sell].filter(
        (item): item is NonNullable<typeof item> => item !== null
      ),
    };

    const gameState: FullGameState = {
      gameInfo: fullGame.gameInfo,
      trade: fullGame.trade,
      players: fullGame.players,
      marketHistory: marketHistory,
      suitData: fullGame.suitData,
    };

    console.log("Game state for ", lastProcessedTradeId, ": ", gameState);

    chrome.runtime.sendMessage({
      type: "NEW_TRANSACTION_EVENT",
      payload: { gameState },
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
  
  // Send initial game state with only players and game info
  const fullGame = parseAll();
  const initialGameState: FullGameState = {
    gameInfo: fullGame.gameInfo,
    trade: { trade: null, buy: null, sell: null },
    players: fullGame.players,
    marketHistory: { market: [] },
    suitData: {},
  };
  console.log("Sending initial game state:", initialGameState);

  chrome.runtime.sendMessage({
    type: "INITIAL_GAME_STATE",
    payload: {
      gameState: initialGameState,
    },
  });
}

// Function to check if the game UI is still present
function checkGameUIPresence() {
  // Look for the Trade History element as an indicator that the game UI is loaded
  const tradeHistoryHeader = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((div) => (div as HTMLElement).innerText.trim() === "Trade History");

  if (!tradeHistoryHeader) {
    // Game UI is not present, reset all data
    console.log("Game UI not detected, resetting data...");
    lastProcessedTradeId = null;

    // Send a message to background to clear the stored data
    chrome.runtime.sendMessage({
      type: "CLEAR_GAME_DATA",
    });
  }
}

// Monitor for page changes/reloads by checking UI presence every 3 seconds
const uiMonitorInterval = setInterval(checkGameUIPresence, 3000);

// Also check immediately when the script loads (in case of page reload)
setTimeout(checkGameUIPresence, 500);

// Clean up interval if the script is unloaded
window.addEventListener("beforeunload", () => {
  clearInterval(uiMonitorInterval);
});

// Initial setup
setTimeout(observeTradeHistory, 1500);
