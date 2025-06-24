export function findMarketContainer(
  suit: "spades" | "clubs" | "diamonds" | "hearts"
) {
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

  const map = {
    spades: 0,
    clubs: 1,
    diamonds: 2,
    hearts: 3,
  };

  return tradeBoardsContainer.children[map[suit]];
}

export function findBidOfferContainer(
  suitBoard: HTMLDivElement,
  isBid: boolean
): HTMLDivElement | null {
  const container = suitBoard.firstElementChild as HTMLDivElement | null;
  if (!container) {
    console.error("Could not find the container element.");
    return null;
  }
  const bid = container.children[0] as HTMLDivElement | undefined;
  const offer = container.children[2] as HTMLDivElement | undefined;

  return isBid ? bid ?? null : offer ?? null;
}
