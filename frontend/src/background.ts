// frontend/src/background.ts

// This variable will hold the most recent game state.
let latestGameState: unknown = null;

const welcomePage = 'sidepanel-welcome.html';
const mainPage = 'sidepanel-main.html';
const figgieUrl = 'https://www.figgie.com/play';

// Allow users to open the side panel by clicking the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, _info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);

  // Check if the user is on the Figgie game page
  const isFiggiePage = url.href.startsWith(figgieUrl);

  // Set the side panel's HTML file based on the URL
  await chrome.sidePanel.setOptions({
    tabId,
    path: isFiggiePage ? mainPage : welcomePage,
    enabled: true
  });
});

// --- NEW: Add a listener for messages from other scripts ---
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Listen for updates from the content script
  if (message.type === "GAME_STATE_UPDATE") {
    console.log("Background script received new game state.");
    latestGameState = message.payload;
  }

  // Listen for requests from the side panel
  if (message.type === "GET_LATEST_STATE") {
    sendResponse(latestGameState);
  }

  // Keep the message channel open for async response
  return true;
});