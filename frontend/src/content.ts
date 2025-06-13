// frontend/src/content.ts
console.log("Figgie Bot Content Script Injected!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GREETING") {
    console.log("Content script received message:", message.payload);
    sendResponse({ farewell: "goodbye" });
  }
});