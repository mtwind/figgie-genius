// import { PlayerCard } from "@/components/PlayerCard"; // Import the new component
import type { FullGameState } from "@/types";
import { Box, Typography } from "@mui/material";

interface HomeProps {
  gameState: FullGameState | null;
}

const Home = ({ gameState }: HomeProps) => {
  if (!gameState) {
    return <Typography sx={{ p: 2 }}>Loading player data...</Typography>;
  }

  const { players } = gameState;
  console.log(players);
  return (
    <Box sx={{ p: 1 }}>
      {/* Render a card for the user */}
      {/* <PlayerCard
        playerName={user.name}
        playerColor={user.color}
        chips={user.chips}
        totalCards={user.totalCards}
        hand={user.hand}
      /> */}
      {/* Render a card for each opponent */}
      {/* {players.map((op) => (
        <PlayerCard
          key={op.name}
          isUser={op.isUser}
          playerName={op.name}
          playerColor={op.color}
          chips={op.chips}
          totalCards={op.totalCards}
          hand={op.hand}
          cardChanges={op.cardChanges}
        />
      ))} */}
    </Box>
  );
};

export default Home;
