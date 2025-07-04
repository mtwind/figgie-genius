// src/content.ts

import { parseAll } from "@/parsing/parseAll";
import { getTrades } from "@/parsing/wrappers";
import { parseBidOffer } from "./parsing/bidOffer";
import { FullGameState, MarketHistory } from "./types";
import { findBidOfferContainer, findMarketContainer } from "./util/findMarket";

// This variable will store the unique ID of the last processed trade.
let lastProcessedTradeId: string | null = null;

let currentMarketHistory: MarketHistory | null = { market: [] };

// Add a flag to control observer operations
let isGamePaused = false;

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
  if (isGamePaused) {
    console.log("Game is paused - skipping trade processing");
    return;
  }

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
  if (isGamePaused) {
    console.log("Game is paused - skipping bid/offer processing");
    return;
  }

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

function observeGameName() {
  // Find the top bar element first
  const topBarElement = document.querySelector(
    'div[style*="background-color: rgb(128, 74, 153)"]'
  ) as HTMLElement;

  if (!topBarElement) {
    console.log(
      "Top bar element not found. Retrying game name observer in 2 seconds..."
    );
    setTimeout(observeGameName, 2000);
    return;
  }

  const spectatorIcon = topBarElement.querySelector(
    'svg[id*="spectator_icon_svg"]'
  );

  // The 'Round' element is the previous sibling of the spectator icon's container.
  const roundElement = spectatorIcon?.parentElement
    ?.previousElementSibling as HTMLElement | null;

  // The 'Game Name' element is the previous sibling of the round element (they're both children of the same container)
  const gameNameElement = roundElement?.parentElement
    ?.previousElementSibling as HTMLElement | null;

  if (!gameNameElement) {
    console.log("Game name element not found. Retrying in 2 seconds...");
    setTimeout(observeGameName, 2000);
    return;
  }

  console.log("SUCCESS: Now observing game name for pause status.");

  // Create observer for the game name element
  const gameNameObserver = new MutationObserver(() => {
    handleGameNameChange(gameNameElement);
  });

  gameNameObserver.observe(gameNameElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Initial check
  handleGameNameChange(gameNameElement);

  return gameNameObserver;
}

function handleGameNameChange(gameNameElement: HTMLElement): void {
  const gameNameText = gameNameElement.innerText.trim();
  const wasGamePaused = isGamePaused;

  // Update pause status
  isGamePaused = gameNameText === "Paused";

  // Log status changes and send updates to background
  if (isGamePaused && !wasGamePaused) {
    console.log("Game PAUSED - All observers suspended");

    // Send pause notification to background
    chrome.runtime.sendMessage({
      type: "GAME_PAUSED",
      payload: { paused: true },
    });
  } else if (!isGamePaused && wasGamePaused) {
    console.log("Game RESUMED - All observers active");

    // Send resume notification to background
    chrome.runtime.sendMessage({
      type: "GAME_RESUMED",
      payload: { paused: false },
    });
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
    if (currentMarketHistory) {
      currentMarketHistory.market = [];
    }

    // Send a message to background to clear the stored data
    chrome.runtime.sendMessage({
      type: "CLEAR_GAME_DATA",
    });
  }
}

// --- INITIALIZATION AND CLEANUP ---

function initializeAllObservers() {
  console.log("Initializing content script observers...");

  // Start the game name observer first
  observeGameName();

  // Start the trade history observer (this will check if we're in game)
  observeTradeHistory();
}

function initializeBidOfferObservers() {
  if (isGamePaused) {
    console.log("Game is paused - skipping bid/offer observer initialization");
    return;
  }

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
