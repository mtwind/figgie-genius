// src/background.ts

import type { BidOfferData, FullGameState } from "@/types";

// eslint-disable-next-line prefer-const
let gameStateLog: FullGameState[] = [];
const marketLog: BidOfferData[] = [];
let currentGameState: FullGameState | null = null;
let buy: BidOfferData;
let sell: BidOfferData;

// Side panel setup logic remains the same...
const welcomePage = "sidepanel-welcome.html";
const mainPage = "sidepanel-main.html";
const figgieUrl = "https://www.figgie.com/play";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, _info, tab) => {
  if (!tab.url) return;
  const isFiggiePage = tab.url.startsWith(figgieUrl);
  await chrome.sidePanel.setOptions({
    tabId,
    path: isFiggiePage ? mainPage : welcomePage,
    enabled: true,
  });
});

// --- Message Handling ---
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "INITIAL_GAME_STATE":
      // console.log("Background received initial game state:");
      // console.log(message.payload);

      // Store the initial game state separately
      currentGameState = message.payload.gameState;

      // console.log(
      //   "Sending initial game state to update UI: ",
      //   currentGameState
      // );
      // Broadcast initial state to any open side panels.
      chrome.runtime.sendMessage({
        type: "INITIAL_GAME_STATE_UPDATED",
        payload: currentGameState,
      });

      break;

    case "NEW_TRANSACTION_EVENT":
      // console.log("Background received new transaction event:");
      // console.log(message.payload);

      // Update the current game state
      currentGameState = message.payload.gameState;
      // Add to trade log
      gameStateLog.unshift(message.payload.gameState);

      buy = message.payload.gameState.trade.buy;
      sell = message.payload.gameState.trade.sell;
      marketLog.unshift(buy);
      marketLog.unshift(sell);

      // console.log("Sending data to update UI: ", {
      //   currentGameState,
      //   gameStateLog,
      // });
      // Broadcast updates to any open side panels.
      chrome.runtime.sendMessage({
        type: "GAME_STATE_UPDATED",
        payload: { currentGameState, gameStateLog, marketLog },
      });

      break; // These handlers allow the side panel to get the initial data when it opens.

    case "BID_OFFER_UPDATE":
      marketLog.unshift(message.payload.bidOfferData);

      chrome.runtime.sendMessage({
        type: "BID_OFFER_UPDATE",
        payload: { marketLog },
      });
      break;

    case "GET_LATEST_GAME_STATE":
      sendResponse({ currentGameState, gameStateLog });
      break;

    case "CLEAR_GAME_DATA":
      console.log("Clearing all game data due to page reload/navigation");
      gameStateLog.length = 0; // Clear the array
      currentGameState = null; // Clear current state

      // Notify UI components that data has been cleared
      chrome.runtime.sendMessage({
        type: "GAME_STATE_UPDATED",
        payload: { currentGameState: null, gameStateLog: [] },
      });
      break;
  }
  return true; // Keep the message channel open for async responses.
});
