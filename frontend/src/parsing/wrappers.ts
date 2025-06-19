import { parseMarket } from "@/parsing/market";
import { parseOpponents } from "@/parsing/opponents";
import { parseSingleTrade } from "@/parsing/singleTrade";
import { parseTopBar } from "@/parsing/topBar";
import { parseUser } from "@/parsing/user";
import type { FullTrade, GameInfo, MarketData, PlayerData } from "@/types";

/**
 * WRAPPER 1: Finds the top bar element and passes it to the parser.
 */
export function getTopBarData(): GameInfo | null {
  // Use the exact RGB value you provided for a reliable selection.
  const timerElement = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((el) => (el as HTMLElement).innerText.includes(":")) as
    | HTMLElement
    | undefined;

  // Step 2: From that unique timer, traverse up to the closest parent div
  // that has a background-color style. This will be the main purple top bar.
  const topBarElement = timerElement?.closest(
    'div[style*="background-color"]'
  ) as HTMLElement | undefined;

  if (!topBarElement) {
    console.error("Wrapper: Could not find topBarElement.");
    return null;
  }
  return parseTopBar(topBarElement);
}

/**
 * WRAPPER 2: Finds the user's dashboard element and passes it to the parser.
 */
export function getUserData(): PlayerData | null {
  // This robustly finds the user's container by anchoring on the unique BID input field.
  const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  const userContainer = chipIcon?.closest(
    'div[style*="background-color: rgb(255, 255, 255)"]'
  ) as HTMLElement | null;

  if (!userContainer) {
    console.error("Wrapper: Could not find the user's dashboard container.");
    return null;
  }
  return parseUser(userContainer as HTMLElement);
}

/**
 * WRAPPER 3: Finds the container for all opponents and passes it to the parser.
 */
export function getOpponentData(): PlayerData[] {
  // This robustly finds the opponents' container by looking for the element
  // that comes directly after the user's container.
  const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  const userContainer = chipIcon?.closest(
    'div[style*="background-color: rgb(255, 255, 255)"]'
  ) as HTMLElement | null;

  const opponentsWrapper = userContainer?.nextElementSibling;
  if (!opponentsWrapper) {
    console.error("Wrapper: Could not find the opponents' container.");
    return [];
  }
  return parseOpponents(opponentsWrapper as HTMLElement);
}

export function getMarkets(): Record<string, MarketData> | null {
  const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  const userContainer = userChipIcon?.closest(
    'div[style*="background-color: rgb(255, 255, 255)"]'
  );
  const opponentsWrapper = userContainer?.nextElementSibling;
  const tradeBoardsContainer = opponentsWrapper?.nextElementSibling;

  if (!tradeBoardsContainer) {
    console.error("Wrapper: Could not find the trade boards container.");
    return null;
  }

  // Initialize an empty object to store market data by suit name
  const marketData: Record<string, MarketData> = {};

  for (const wrapper of Array.from(tradeBoardsContainer.children)) {
    const market: MarketData | null = parseMarket(wrapper as HTMLDivElement);
    if (
      market &&
      market.suit !== "Unknown" &&
      market.suit !== null &&
      market.suit !== undefined
    ) {
      // Use the suit name as the key to store the market data object
      marketData[market.suit] = market;
    }
  }

  return marketData;
}

export function getTrades(last: boolean = false): FullTrade[] | null | [] {
  const tradeHistoryHeader = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((div) => (div as HTMLElement).innerText.trim() === "Trade History");

  if (!tradeHistoryHeader) return [];
  const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
  if (!commonContainer) return [];
  const listContainer = commonContainer.querySelector(
    'div[class*="r-150rngu"]'
  );
  if (!listContainer) return [];

  const tradeRows = listContainer.querySelectorAll('div[aria-disabled="true"]');
  const trades: FullTrade[] = [];
  tradeRows.forEach((row) => {
    const trade = parseSingleTrade(row as HTMLDivElement);
    if (trade) {
      trades.push(trade);
    }
    if (last) {
      return trades;
    }
  });

  return trades;
}
