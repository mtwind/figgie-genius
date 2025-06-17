// frontend/src/types.ts

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
  
  
  // Defines the shape for a single market on the trade board
  export interface MarketData {
    lastSale: string;
    bid: string;
    bidColor: string;
    offer: string;
    offerColor: string;
  }  // Enum-like constants for bid/offer types
  export const BidOfferType = {
    BID: 1,
    OFFER: 2,
    BUY: 3,
    SELL: 4
  } as const;

  export type BidOfferTypeValue = typeof BidOfferType[keyof typeof BidOfferType];

  export interface BidOfferData {
    player: { name: string; color: string};
    price: number;
    suit: string;
    type: BidOfferTypeValue;
  }
  
  // Defines the shape for a single trade in the history
  export interface TradeData {
    buyer: { name: string; color: string; };
    suit: string;
    seller: { name: string; color: string; };
    price: string;
  }
  
  // This is the main interface that combines all other types
  export interface FullGameState {
    gameInfo: GameInfo | null;
    players: PlayerData[];
    markets: Record<string, MarketData>;
    lastTrade: TradeData | null;
  }