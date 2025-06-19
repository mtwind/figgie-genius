// src/parsing/players.ts

import { parseOpponents } from "@/parsing/opponents";
import { parseUser } from "@/parsing/user";
import type { PlayerData } from "@/types";

/**
 * A wrapper function that finds all player dashboards on the page
 * and calls the appropriate parsers.
 * @returns An array of PlayerData objects for all players in the game.
 */
export function parsePlayers(): PlayerData[] | null {
  // Find the user's container using our robust anchor
  const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  const userContainer = chipIcon?.closest(
    'div[style*="background-color: rgb(255, 255, 255)"]'
  ) as HTMLElement | null;

  if (!userContainer) {
    console.error("Wrapper: Could not find the user's dashboard container.");
    return null;
  }

  // The opponents' container is the direct next sibling
  const opponentsWrapper = userContainer.nextElementSibling;
  if (!opponentsWrapper) {
    console.error("parsePlayers: Could not find opponents' wrapper.");
    return [];
  }

  // Parse all players
  const user = parseUser(userContainer as HTMLElement);
  const opponents = parseOpponents(opponentsWrapper);

  // Combine and return, filtering out any null user objects
  return [user, ...opponents].filter((p): p is PlayerData => p !== null);
}
