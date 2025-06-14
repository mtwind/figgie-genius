// frontend/src/content.ts

console.log("Content Script Loaded on this page.");

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "POPUP_ACTION") {
    console.log("Message received from popup:", message.payload);
    // You can add other logic here later.
  }
});