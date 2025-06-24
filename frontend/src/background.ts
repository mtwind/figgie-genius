// src/background.ts

import type { FullGameState } from "@/types";

// eslint-disable-next-line prefer-const
let gameStateLog: FullGameState[] = [];
let currentGameState: FullGameState | null = null;

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
      console.log("Background received initial game state:");
      console.log(message.payload);

      // Store the initial game state separately
      currentGameState = message.payload.gameState;

      console.log(
        "Sending initial game state to update UI: ",
        currentGameState
      );
      // Broadcast initial state to any open side panels.
      chrome.runtime.sendMessage({
        type: "INITIAL_GAME_STATE_UPDATED",
        payload: currentGameState,
      });

      break;

    case "NEW_TRANSACTION_EVENT":
      console.log("Background received new transaction event:");
      console.log(message.payload);

      // Update the current game state
      currentGameState = message.payload.gameState;
      // Add to trade log
      gameStateLog.unshift(message.payload.gameState);

      console.log("Sending data to update UI: ", {
        currentGameState,
        gameStateLog,
      });
      // Broadcast updates to any open side panels.
      chrome.runtime.sendMessage({
        type: "GAME_STATE_UPDATED",
        payload: { currentGameState, gameStateLog },
      });

      break; // These handlers allow the side panel to get the initial data when it opens.
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
