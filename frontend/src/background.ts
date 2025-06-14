// frontend/src/background.ts

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