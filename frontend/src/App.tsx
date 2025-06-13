// frontend/src/App.tsx
import "./App.css";

function App() {
  const sendMessageToContentScript = () => {
    // Query for the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        // Send a message to the content script in the active tab
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GREETING", payload: "Hello from the popup!" },
          (response) => {
            if (chrome.runtime.lastError) {
              // This can happen if the content script is not injected on the page
              console.error(chrome.runtime.lastError.message);
            } else {
              console.log("Received response from content script:", response);
            }
          }
        );
      }
    });
  };

  return (
    <>
      <h1>Figgie Bot Control</h1>
      <div className="card">
        <button onClick={sendMessageToContentScript}>
          Send Message to Content Script
        </button>
      </div>
    </>
  );
}

export default App;
