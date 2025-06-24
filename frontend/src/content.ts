// src/content.ts

import { parseAll } from "@/parsing/parseAll";
import { getTrades } from "@/parsing/wrappers";
import { parseBidOffer } from "./parsing/bidOffer";
import { FullGameState, MarketHistory } from "./types";
import { findBidOfferContainer, findMarketContainer } from "./util/findMarket";

// This variable will store the unique ID of the last processed trade.
let lastProcessedTradeId: string | null = null;

let currentMarketHistory: MarketHistory | null = { market: [] };

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
    // const marketHistory: MarketHistory = {
    //   market: [allTrades[0].buy, allTrades[0].sell].filter(
    //     (item): item is NonNullable<typeof item> => item !== null
    //   ),
    // };

    const buy = allTrades[0].buy;
    const sell = allTrades[0].sell;

    if (buy && sell) {
      if (currentMarketHistory && currentMarketHistory.market) {
        currentMarketHistory.market.unshift(buy);
        currentMarketHistory.market.unshift(sell);
      } else if (currentMarketHistory) {
        currentMarketHistory.market = [buy, sell];
      } else {
        currentMarketHistory = {
          market: [buy, sell],
        };
      }
    }

    const gameState: FullGameState = {
      gameInfo: fullGame.gameInfo,
      trade: fullGame.trade,
      players: fullGame.players,
      marketHistory: currentMarketHistory,
      suitData: fullGame.suitData,
    };

    console.log("Game state for ", lastProcessedTradeId, ": ", gameState);

    chrome.runtime.sendMessage({
      type: "NEW_TRANSACTION_EVENT",
      payload: { gameState },
    });

    if (currentMarketHistory) {
      currentMarketHistory.market = [];
    }
  }
};

function handleBidOfferChange(
  marketContainer: HTMLDivElement,
  suit: "spades" | "clubs" | "diamonds" | "hearts",
  isBid: boolean
): void {
  try {
    // Use existing parseBidOffer function to extract the data
    const bidOfferData = parseBidOffer(marketContainer, isBid);

    if (bidOfferData) {
      if (currentMarketHistory && currentMarketHistory.market) {
        currentMarketHistory.market.unshift(bidOfferData);
      } else if (currentMarketHistory) {
        currentMarketHistory.market = [bidOfferData];
      } else {
        currentMarketHistory = {
          market: [bidOfferData],
        };
      }
    }

    if (bidOfferData) {
      const type = isBid ? "BID" : "OFFER";
      console.log(`${type} change detected for ${suit}:`, bidOfferData);

      // Send the bid/offer update to background
      chrome.runtime.sendMessage({
        type: "BID_OFFER_UPDATE",
        payload: { bidOfferData },
      });
    }
  } catch (error) {
    console.error(
      `Error parsing ${isBid ? "bid" : "offer"} for ${suit}:`,
      error
    );
  }
}

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

  initializeBidOfferObservers();
}

function observeBidOfferChanges() {
  const suits: ("spades" | "clubs" | "diamonds" | "hearts")[] = [
    "spades",
    "clubs",
    "diamonds",
    "hearts",
  ];
  const observers: MutationObserver[] = [];

  suits.forEach((suit) => {
    // Find the market container for this suit using existing function
    const marketContainer = findMarketContainer(suit) as HTMLDivElement | null;
    if (!marketContainer) {
      console.log(`Could not find market container for ${suit}`);
      return;
    }

    // Find bid and offer containers using existing function
    const bidContainer = findBidOfferContainer(marketContainer, true); // true for bid
    const offerContainer = findBidOfferContainer(marketContainer, false); // false for offer

    // Create observer for bid container
    if (bidContainer) {
      const bidObserver = new MutationObserver(() => {
        handleBidOfferChange(marketContainer, suit, true); // true for bid
      });
      bidObserver.observe(bidContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      observers.push(bidObserver);
      console.log(`Observing ${suit} bid changes`);
    }

    // Create observer for offer container
    if (offerContainer) {
      const offerObserver = new MutationObserver(() => {
        handleBidOfferChange(marketContainer, suit, false); // false for offer
      });
      offerObserver.observe(offerContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      observers.push(offerObserver);
      console.log(`Observing ${suit} offer changes`);
    }
  });

  return observers;
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

// --- INITIALIZATION AND CLEANUP ---

function initializeAllObservers() {
  console.log("Initializing content script observers...");

  // Start the trade history observer (this will check if we're in game)
  observeTradeHistory();
}

function initializeBidOfferObservers() {
  console.log("Game detected - initializing bid/offer observers...");

  setTimeout(() => {
    const bidOfferObservers = observeBidOfferChanges();
    console.log(`Initialized ${bidOfferObservers.length} bid/offer observers`);
  }, 1000); // Shorter delay since we know we're in game
}

function initializeUIMonitoring() {
  console.log("Starting UI monitoring...");

  // Start periodic UI presence checking
  const uiMonitoringInterval = setInterval(checkGameUIPresence, 3000);

  // Initial check after page load
  setTimeout(checkGameUIPresence, 500);

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    clearInterval(uiMonitoringInterval);
    console.log("Content script: Cleaned up intervals before page unload");
  });

  return uiMonitoringInterval;
}

// --- MAIN INITIALIZATION ---

// Initialize observers and monitoring
setTimeout(() => {
  initializeAllObservers();
}, 1500);

// Initialize UI monitoring
initializeUIMonitoring();
