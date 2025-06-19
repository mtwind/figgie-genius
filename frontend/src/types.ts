// frontend/src/types.ts

export interface Time {
  timeRemaining: string | undefined;
}

export interface PlayerColors {
  players: { [key: string]: string };
}

// Defines the shape of the game's top bar information
export interface GameInfo {
  timeRemaining: string;
  gameName: string;
  round: string;
}

// Defines the shape of the user's hand and personal data
export interface PlayerData {
  isUser: boolean;
  name: string;
  color: string;
  chips: string;
  totalCards: number;
  hand: { [key: string]: number };
  cardChanges: { [key: string]: string };
}

export interface AllPlayers {
  players: PlayerData[];
}

export interface MarketHistory {
  market: BidOfferData[] | null;
}

export interface BidOfferData {
  player: { name: string; color: string };
  price: number;
  suit: string;
  type: "BID" | "OFFER" | "BUY" | "SELL"; // 1=BID, 2=OFFER, 3=BUY, 4=SELL
  time: string | undefined;
}

// Defines the shape for a single trade in the history
export interface TradeData {
  buyer: { name: string; color: string };
  suit: string;
  seller: { name: string; color: string };
  price: string;
  time: string | undefined;
}

export interface FullTrade {
  buy: BidOfferData | null;
  sell: BidOfferData | null;
  trade: TradeData | null | undefined;
}

// Defines the shape for a single market on the trade board
export interface MarketData {
  lastSale: string;
  bid: BidOfferData | null;
  offer: BidOfferData | null;
  suit: string | null;
}

export interface FullGameState {
  gameInfo: GameInfo | null;
  players: PlayerData[] | null;
  markets: MarketData[];
  trades: FullTrade[];
}

export interface MarketDataOld {
  lastSale: string;
  bid: string;
  bidColor: string;
  offer: string;
  offerColor: string;
}

// This is the main interface that combines all other types
export interface FullGameStateOld {
  gameInfo: GameInfo | null;
  players: PlayerData[];
  markets: Record<string, MarketData>;
  lastTrade: TradeData | null;
}
