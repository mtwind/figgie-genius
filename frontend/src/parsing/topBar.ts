// src/parsing/parseTopBar.ts

import type { GameInfo } from "@/types";

/**
 * Parses the top bar HTML element to extract time, game name, and round number.
 * @param topBarElement The main div element for the top bar.
 * @returns A GameInfo object or null if parsing fails.
 */
export function parseTopBar(topBarElement: HTMLElement): GameInfo | null {
  if (!topBarElement) {
    console.error("The provided topBarElement is invalid.");
    return null;
  }

  // --- Find elements *within* the provided topBarElement ---

  // Find the timer by its content (the ':').
  const timerElement = Array.from(
    topBarElement.querySelectorAll('div[dir="auto"]')
  ).find((el) => (el as HTMLElement).innerText.includes(":")) as
    | HTMLElement
    | undefined;

  // Find the 'eye' spectator icon as an anchor.
  const spectatorIcon = topBarElement.querySelector(
    'svg[id*="spectator_icon_svg"]'
  );

  // The 'Round' element is the previous sibling of the spectator icon's container.
  const roundElement = spectatorIcon?.parentElement
    ?.previousElementSibling as HTMLElement | null;

  // The 'Game Name' element is the previous sibling of the round element (they're both children of the same container)
  const gameNameElement = roundElement?.parentElement
    ?.previousElementSibling as HTMLElement | null;

  // If any of the key elements weren't found, we can't create a valid object.
  if (!timerElement || !gameNameElement || !roundElement) {
    console.error("Could not parse all required elements from the top bar.");
    console.error("Timer found:", !!timerElement);
    console.error("Game name found:", !!gameNameElement);
    console.error("Round found:", !!roundElement);
    return null;
  }

  const gameInfo: GameInfo = {
    timeRemaining: timerElement.innerText.trim(),
    gameName: gameNameElement.innerText.trim(),
    round: roundElement.innerText.trim(),
  };

  return gameInfo;
}
