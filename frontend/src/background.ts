// src/background.ts

import type { AllPlayers, FullTrade, MarketHistory } from "@/types";

// --- State Management ---
// eslint-disable-next-line prefer-const
let playersLog: AllPlayers[] = [];
// eslint-disable-next-line prefer-const
let tradeLog: FullTrade[] = []; // This will store a running log of completed trades.
// eslint-disable-next-line prefer-const
let marketLog: MarketHistory[] = [];

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
    // This is the ONLY event we are handling for now.
    case "NEW_TRANSACTION_EVENT":
      console.log("Background received new transaction event.");
      console.log("Payload: ", message.payload);

      // Update the state with the fresh data from the payload.
      playersLog.unshift(message.payload.allPlayers);
      tradeLog.unshift(message.payload.trade);
      marketLog.unshift(message.payload.marketHistory);

      console.log("Sending data to update UI: ", {
        playersLog,
        tradeLog,
        marketLog,
      });
      // Broadcast updates to any open side panels.
      chrome.runtime.sendMessage({
        type: "PLAYERS_UPDATED",
        payload: playersLog,
      });
      chrome.runtime.sendMessage({
        type: "LOG_UPDATED",
        payload: tradeLog,
      });
      chrome.runtime.sendMessage({
        type: "MARKET_UPDATED",
        payload: marketLog,
      });
      break;

    // These handlers allow the side panel to get the initial data when it opens.
    case "GET_LATEST_PLAYERS":
      sendResponse(playersLog);
      break;
    case "GET_TRADE_LOG":
      sendResponse(tradeLog);
      break;
    case "GET_MARKET_HISTORY":
      sendResponse(marketLog);
  }
  return true; // Keep the message channel open for async responses.
});
