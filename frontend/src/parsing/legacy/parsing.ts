// parseAll.ts

// Step 1: Import all the working parser functions from their respective files.
// (Assuming they are in the same directory, adjust paths if needed)
import { parseOpponentHands } from '@/parsing/legacy/parseOpponentHand';
import { parseTopBar } from '@/parsing/legacy/parseTopBar';
import { parseTradeBoards } from '@/parsing/legacy/parseTradeBoards';
import { parseTradeHistory } from '@/parsing/legacy/parseTradeHistory';
import { parseUserHand } from '@/parsing/legacy/parseUserHand';

/**
 * Executes all individual parsing functions to capture a complete snapshot of the game state.
 * @returns A single JSON object containing all relevant game data.
 */
export function getGameStateSnapshot() {
  // Step 2: Call each imported function to get a piece of the game state.
  const gameInfo = parseTopBar(); // from parseTopBar.ts
  const user = parseUserHand(); // from parseUserHand.ts
  const opponents = parseOpponentHands(); // from parseOpponentHand.ts
  const markets = parseTradeBoards(); // from parseTradeBoards.ts
  const tradeHistory = parseTradeHistory(); // from parseTradeHistory.ts

  // Step 3: As requested, isolate only the most recent trade.
  // The first element in the tradeHistory array is the most recent one.
  const lastTrade = tradeHistory[0] || null;

  console.log(user, opponents);

  const players = [user, ...opponents];
  // Step 4: Assemble all the data into a single, comprehensive object.
  const fullGameState = {
    gameInfo,
    players,
    markets,
    lastTrade
  };

  // Optional: Log the final object to the console for easy debugging.
  // console.log("--- FIGGIE GENIUS: FULL GAME STATE SNAPSHOT ---");
  // console.log(JSON.stringify(fullGameState, null, 2));

  return fullGameState;
}