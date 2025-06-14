// frontend/src/App.tsx

import { Box, Button } from "@mui/material";

function App() {
  const handleSendMessage = () => {
    // Find the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        // Send a message directly to the content script in that tab
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "POPUP_ACTION",
          payload: "Hello from the popup!",
        });
      }
    });
  };

  return (
    // We use Box to set a consistent size for the popup.
    <Box
      sx={{
        width: 320,
        height: 150,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>Figgie Genius Popup</p>
      <Button variant="contained" onClick={handleSendMessage}>
        Send Test Message
      </Button>
    </Box>
  );
}

export default App;
