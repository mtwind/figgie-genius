import { getMarkets, getTopBarData, getTrades } from "@/parsing/wrappers";
import type {
  AllPlayers,
  FullGameState,
  FullTrade,
  GameInfo,
  SuitData,
} from "@/types";
import { parsePlayers } from "./players";

export function parseAll() {
  const gameInfo: GameInfo | null = getTopBarData();
  const markets: Record<string, SuitData> | null = getMarkets();
  const trades: FullTrade[] = getTrades() ?? [];
  const allPlayers: AllPlayers | null = parsePlayers();

  const AllData: FullGameState = {
    gameInfo: gameInfo,
    players: allPlayers,
    marketHistory: null,
    suitData: markets,
    trade: trades[0],
  };

  // console.log("All Data: ", AllData);
  return AllData;
}
