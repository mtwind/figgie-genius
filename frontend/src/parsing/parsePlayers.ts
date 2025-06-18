export function parsePlayers(): { [key: string]: string } | null {
  const players: { [key: string]: string } = {};

  const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');

  if (!chipIcon) {
    console.error("Could not find the user's chip icon to anchor the search.");
    return null;
  }

  // Step 2: From the icon, find the header bar and the main user container.
  const headerBar = chipIcon.closest(
    'div[style*="background-color"]'
  ) as HTMLElement | null;
  const userContainer = headerBar?.parentElement;

  if (!headerBar || !userContainer) {
    console.error(
      "Could not find the user's header or main container from the chip icon."
    );
    return null;
  }

  // Parse Color
  const backgroundColor = headerBar.style.backgroundColor;
  let color = "unknown";
  if (backgroundColor.includes("39, 115, 222")) color = "blue";
  else if (backgroundColor.includes("26, 167, 123")) color = "green";
  else if (backgroundColor.includes("239, 64, 67")) color = "red";
  else if (backgroundColor.includes("239, 168, 35")) color = "orange";

  // Parse Name and Chips by their position relative to the chip icon.
  const chipIconContainer = chipIcon.parentElement;
  const nameElement = chipIconContainer?.previousElementSibling?.querySelector(
    'div[dir="auto"]'
  ) as HTMLElement | null;
  const name = nameElement?.innerText.trim() || "N/A";

  players[color] = name;

  const opponentsWrapper = userContainer.nextElementSibling;
  if (!opponentsWrapper) {
    console.error(
      "Could not find the opponents' container next to the user's container."
    );
    return null;
  }

  const opponentContainers = opponentsWrapper.children;

  for (const container of Array.from(opponentContainers)) {
    const headerBar = container.querySelector(
      'div[style*="background-color"]'
    ) as HTMLElement | null;
    if (!headerBar) continue;

    // Parse Color
    const backgroundColor = headerBar.style.backgroundColor;
    let color = "unknown";
    if (backgroundColor.includes("26, 167, 123")) color = "green";
    else if (backgroundColor.includes("239, 64, 67")) color = "red";
    else if (backgroundColor.includes("239, 168, 35")) color = "orange";

    // Get Player Name directly from the header
    const nameElement = headerBar.querySelector(
      'div[dir="auto"]'
    ) as HTMLElement | null;
    const name = nameElement?.innerText.trim() || "N/A";

    players[color] = name;
  }

  return players;
}
