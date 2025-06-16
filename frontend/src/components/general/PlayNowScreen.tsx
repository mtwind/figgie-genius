// src/components/PlayNowScreen.tsx
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function PlayNowScreen() {
  const handlePlayNow = () => {
    // This opens the Figgie play page in a new tab
    chrome.tabs.create({ url: "https://www.figgie.com/play" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        p: 3, // Add some padding
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Figgie Genius
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        Uh uh, it looks like you aren't on the Play Figgie page...
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<PlayCircleOutlineIcon />}
        onClick={handlePlayNow}
      >
        Play Now
      </Button>
    </Box>
  );
}

export default PlayNowScreen;
