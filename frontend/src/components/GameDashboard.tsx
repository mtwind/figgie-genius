// src/components/GameDashboard.tsx
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function GameDashboard() {
  // In the future, you'll have a useEffect here to get game data
  // from the content script.

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ p: 2, flexGrow: 1 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="body1">
            You are on the Figgie play page!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            This is where your game data and analysis will appear.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default GameDashboard;
