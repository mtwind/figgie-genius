import {
  getMarkets,
  getOpponentData,
  getTopBarData,
  getTrades,
  getUserData,
} from "@/parsing/wrappers";
import type {
  FullGameState,
  FullTrade,
  GameInfo,
  MarketData,
  PlayerData,
} from "@/types";

export function parseAll() {
  const gameInfo: GameInfo | null = getTopBarData();
  const user: PlayerData | null = getUserData();
  const opponents: PlayerData[] = getOpponentData();
  const markets: Record<string, MarketData> | null = getMarkets();
  const trades: FullTrade[] = getTrades() ?? [];
  const AllData: FullGameState = {
    gameInfo: gameInfo,
    players: [user, ...opponents].filter((p): p is PlayerData => p !== null),
    markets: markets ? Object.values(markets) : [],
    trades: trades,
  };

  // console.log("All Data: ", AllData);
  return AllData;
}
