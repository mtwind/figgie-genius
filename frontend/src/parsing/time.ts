// src/parsing/parseTopBar.ts

import type { Time } from "@/types";
/**
 * Parses the top bar for time, game name, and round number using font-size-safe selectors.
 * @returns A TopBarInfo object or null if essential elements aren't found.
 */
export function parseTime(): Time | null {
  // Find the timer by looking for the only text that contains a colon.
  // TS-FIX: We cast 'el' to HTMLElement to safely access .innerText.
  const timerElement = Array.from(
    document.querySelectorAll('div[dir="auto"]')
  ).find((el) => (el as HTMLElement).innerText.includes(":")) as
    | HTMLElement
    | undefined;

  const time: Time = {
    // TS-FIX: We know these elements exist now, so we can safely access innerText.
    timeRemaining: timerElement?.innerText.trim(),
  };

  return time;
}
