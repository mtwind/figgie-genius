

function parseTopBar() {
    console.log("--- Running Final Top Bar Parser ---");
  
    // This method for finding the timer is robust and correct.
    const timerElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                              .find(el => el.innerText.includes(':'));
  
    // --- New, More Accurate Logic for Game Name and Round ---
  
    // Find the 'Round' text first.
    const roundElement = Array.from(document.querySelectorAll('div[dir="auto"]'))
                             .find(el => el.innerText.startsWith('Round '));
    
    let gameNameElement = null;
    // Check if we found the round element before proceeding.
    if (roundElement) {
      // The parent container holds both the game name and the round info line.
      const parentContainer = roundElement.parentElement.parentElement;
      
      // The game name div is the first child of this parent container.
      // The text of this element might be the game name or "Paused".
      gameNameElement = parentContainer.firstElementChild;
    }
    
    const gameInfo = {
      timeRemaining: timerElement?.innerText.trim() || 'N/A',
      // We now correctly reference the gameNameElement found via hierarchy.
      gameName: gameNameElement?.innerText.trim() || 'N/A',
      round: roundElement?.innerText.trim() || 'N/A'
    };
    
    console.log("Parsed Top Bar Info:", gameInfo);
    return gameInfo;
  }

  function parseUserHand() {
    // Step 1: Find the chip icon in the header. This is our unique and reliable anchor.
    const chipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
  
    if (!chipIcon) {
      console.error("Could not find the user's chip icon to anchor the search.");
      return null;
    }
  
    // Step 2: From the icon, find the header bar and the main user container.
    const headerBar = chipIcon.closest('div[style*="background-color"]');
    const userContainer = headerBar?.parentElement;
  
    if (!headerBar || !userContainer) {
      console.error("Could not find the user's header or main container from the chip icon.");
      return null;
    }
    
    // --- Step 3: Now that we have the correct containers, parse the data ---
  
    // Parse Color from the header's background.
    const backgroundColor = headerBar.style.backgroundColor;
    let color = 'unknown';
    if (backgroundColor.includes('39, 115, 222')) color = 'blue';
    else if (backgroundColor.includes('26, 167, 123')) color = 'green';
    else if (backgroundColor.includes('239, 64, 67')) color = 'red';
    else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
    // Parse Name and Chips by their position relative to the chip icon.
    const chipIconContainer = chipIcon.parentElement;
    const nameElement = chipIconContainer?.previousElementSibling?.querySelector('div[dir="auto"]');
    const name = nameElement?.innerText.trim() || 'N/A';
    
    const chipsElement = chipIcon.nextElementSibling;
    const chips = chipsElement?.innerText.trim() || 'N/A';
  
    // Parse Hand and Total Cards from the card row below the header.
    const hand = {};
    let totalCards = 0;
    const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
  
    if (cardRow) {
      for (const cardDiv of cardRow.children) {
        // Find the card count div by its structural position, not its font size.
        const countElement = cardDiv.querySelector('div[dir="auto"]');
        const countStr = countElement?.innerText || '0';
        const count = parseInt(countStr, 10);
        
        const svgId = cardDiv.querySelector('svg')?.id || '';
        let suit = 'Unknown';
  
        if (svgId.includes('spades')) suit = 'Spades';
        else if (svgId.includes('clubs')) suit = 'Clubs';
        else if (svgId.includes('diamonds')) suit = 'Diamonds';
        else if (svgId.includes('hearts')) suit = 'Hearts';
        
        if (suit !== 'Unknown') {
          hand[suit] = count;
          totalCards += count;
        }
      }
    }
  
    const userData = {
      name,
      color,
      chips,
      totalCards,
      hand,
    };
  
    console.log("User Data (Final Console Version):", userData);
    return userData;
  }

  function parseOpponentHands() {
    console.log("--- Running Final Opponent Parser (Name Fix v2) ---");
  
    // Step 1: Find the user's chip icon first, which we know is a reliable anchor.
    const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
    if (!userChipIcon) {
      console.error("Could not find the user's chip icon to start the search.");
      return [];
    }
  
    // Step 2: From the chip icon, find the user's main container.
    const userContainer = userChipIcon.closest('div[style*="background-color: rgb(255, 255, 255)"]');
    if (!userContainer) {
      console.error("Could not find the user's main container from the chip icon.");
      return [];
    }
  
    // Step 3: The container for ALL opponents is the direct next sibling of the user's container.
    const opponentsWrapper = userContainer.nextElementSibling;
    if (!opponentsWrapper) {
      console.error("Could not find the opponents' container next to the user's container.");
      return [];
    }
  
    const opponentsData = [];
    const opponentContainers = opponentsWrapper.children;
  
    for (const container of opponentContainers) {
      const headerBar = container.querySelector('div[style*="background-color"]');
      if (!headerBar) continue;
  
      // Parse Color
      const backgroundColor = headerBar.style.backgroundColor;
      let color = 'unknown';
      if (backgroundColor.includes('26, 167, 123')) color = 'green';
      else if (backgroundColor.includes('239, 64, 67')) color = 'red';
      else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
      // --- FIX: Get Player Name directly from the header ---
      const nameElement = headerBar.querySelector('div[dir="auto"]');
      const name = nameElement?.innerText.trim() || 'N/A';
      
      // Parse Chips using THIS opponent's chip icon as an anchor
      const opponentChipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
      const chipsElement = opponentChipIcon?.nextElementSibling;
      const chips = chipsElement?.innerText.trim() || 'N/A';
  
      // Find Total Card Count using the purple card stack icon
      const totalCardsIcon = container.querySelector('svg[id*="purple_cards_desktop_svg"]');
      const totalCardsElement = totalCardsIcon?.parentElement?.nextElementSibling?.querySelector('div[dir="auto"]');
      const totalCards = totalCardsElement ? parseInt(totalCardsElement.innerText.trim(), 10) : 0;
      
      // Find Card Changes (+/-) using a structural selector
      const cardChanges = {};
      const tradesContainer = container.querySelector('div[style*="flex-direction: column;"]');
      
      if (tradesContainer) {
        for (const row of tradesContainer.children) {
          const tradeValueElement = row.lastElementChild.querySelector('div[dir="auto"]');
          const suitIcon = row.querySelector('svg');
          
          if (!suitIcon || !tradeValueElement) continue;
  
          let suit = 'Unknown';
          const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
          if (pathData.includes('M47.37')) suit = 'Spades';
          else if (pathData.includes('M40.22')) suit = 'Clubs';
          else if (pathData.includes('M30.9')) suit = 'Diamonds';
          else if (pathData.includes('M55.11')) suit = 'Hearts';
  
          if (suit !== 'Unknown') {
            cardChanges[suit] = tradeValueElement.innerText.trim() || '0';
          }
        }
      }
  
      opponentsData.push({
        name,
        color,
        chips,
        totalCards,
        cardChanges,
      });
    }
  
    console.log("Parsed Opponent Data:", opponentsData);
    return opponentsData;
  }

  function parseTradeBoards() {
    console.log("--- Running Final, Structurally-Anchored Trade Board Parser ---");
  
    // Step 1 & 2: Use the user-provided, working logic to find the user's main container.
    const userChipIcon = document.querySelector('svg[id*="chip_desktop_svg"]');
    if (!userChipIcon) {
      console.error("Could not find the user's chip icon to start the search.");
      return {};
    }
    const userContainer = userChipIcon.closest('div[style*="background-color: rgb(255, 255, 255)"]');
    if (!userContainer) {
      console.error("Could not find the user's main container from the chip icon.");
      return {};
    }
  
    // Step 3: As you correctly instructed, find the trade board container relative to the user's container.
    const opponentsWrapper = userContainer.nextElementSibling;
    const tradeBoardsContainer = opponentsWrapper?.nextElementSibling;
  
    if (!tradeBoardsContainer) {
      console.error("Could not find the trade boards' container.");
      return {};
    }
  
    const tradeBoardsData = {};
    const suitRowWrappers = tradeBoardsContainer.children;
  
    for (const wrapper of suitRowWrappers) {
      // The actual row is nested one level down inside the wrapper.
      const suitRow = wrapper.firstElementChild;
      if (!suitRow || suitRow.children.length < 3) continue;
      
      const [bidSide, centerIconContainer, offerSide] = suitRow.children;
  
      // --- Parse Center Column ---
      const suitIcon = centerIconContainer.querySelector('svg');
      const lastSaleElement = centerIconContainer.querySelector('div[dir="auto"]');
      const lastSale = lastSaleElement?.innerText.trim() || 'N/A';
  
      let suit = 'Unknown';
      if (suitIcon) {
        const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
        if (pathData.includes('M47.37')) suit = 'Spades';
        else if (pathData.includes('M40.22')) suit = 'Clubs';
        else if (pathData.includes('M30.9')) suit = 'Diamonds';
        else if (pathData.includes('M55.11')) suit = 'Hearts';
      }
  
      // --- Helper to parse color from background gradient ---
      const parseColorFromStyle = (element) => {
        const style = element?.style.backgroundImage;
        if (!style) return 'none';
        if (style.includes('26, 167, 123')) return 'green';
        if (style.includes('239, 64, 67')) return 'red';
        if (style.includes('239, 168, 35')) return 'orange';
        if (style.includes('39, 115, 222')) return 'blue';
        return 'none';
      };
  
      // --- Parse Bid (Left) Side ---
      const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
      // Correctly find the public price display, not the input field.
      const bidPriceElement = bidDisplay?.querySelector('div[dir="auto"]');
      const bidPrice = bidPriceElement?.innerText.trim() || "";
      const bidColor = parseColorFromStyle(bidDisplay);
  
      // --- Parse Offer (Right) Side ---
      const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
      // Correctly find the public price display.
      const offerPriceElement = offerDisplay?.querySelector('div[dir="auto"]');
      const offerPrice = offerPriceElement?.innerText.trim() || "";
      const offerColor = parseColorFromStyle(offerDisplay);
  
      if (suit !== 'Unknown') {
        tradeBoardsData[suit] = {
          lastSale,
          bid: bidPrice,
          bidColor,
          offer: offerPrice,
          offerColor
        };
      }
    }
  
    console.log("Parsed Trade Boards Data:", tradeBoardsData);
    return tradeBoardsData;
  }
  
function parseTradeHistory() {
    // A helper function to convert an rgb(x, y, z) string to a simple color name
    const parseColorFromRgb = (rgbString) => {
      if (!rgbString) return 'unknown';
      if (rgbString.includes('26, 167, 123')) return 'green';
      if (rgbString.includes('239, 64, 67')) return 'red';
      if (rgbString.includes('239, 168, 35')) return 'orange';
      if (rgbString.includes('39, 115, 222')) return 'blue';
      return 'unknown';
    };
  
    // Step 1: Find the "Trade History" header text (this worked).
    const tradeHistoryHeader = Array.from(document.querySelectorAll('div[dir="auto"]'))
                                  .find(div => div.innerText.trim() === 'Trade History');
  
    if (!tradeHistoryHeader) {
      console.error("Could not find the 'Trade History' header.");
      return [];
    }
  
    // Step 2 (FIXED): Get the main container by going up two parent levels from the header.
    const commonContainer = tradeHistoryHeader.parentElement?.parentElement;
    
    if (!commonContainer) {
      console.error("Could not find the common container for trade history.");
      return [];
    }
  
    // Step 3: Find all trade rows within this container using the stable attribute selector.
    const tradeRows = commonContainer.querySelectorAll('div[aria-disabled="true"]');
    const trades = [];
  
    tradeRows.forEach(row => {
      const columns = row.children;
      if (columns.length < 4) return;
  
      const buyerNameElement = columns[0].querySelector('div');
      const buyer = {
        name: buyerNameElement?.innerText.trim() || 'N/A',
        color: parseColorFromRgb(buyerNameElement?.style.color)
      };
  
      const suitIcon = columns[1].querySelector('svg');
      let suit = 'Unknown';
      if (suitIcon) {
        const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
        if (pathData.includes('M47.37')) suit = 'Spades';
        else if (pathData.includes('M40.22')) suit = 'Clubs';
        else if (pathData.includes('M30.9')) suit = 'Diamonds';
        else if (pathData.includes('M55.11')) suit = 'Hearts';
      }
      
      const sellerNameElement = columns[2].querySelector('div');
      const seller = {
        name: sellerNameElement?.innerText.trim() || 'N/A',
        color: parseColorFromRgb(sellerNameElement?.style.color)
      };
  
      const price = columns[3].innerText.trim() || 'N/A';
  
      trades.push({ buyer, suit, seller, price });
    });
  
    console.log("Parsed Trade History:", trades);
    return trades;
  }

/**
 * Executes all individual parsing functions to capture a complete snapshot of the game state.
 * @returns A single JSON object containing all relevant game data.
 */
function getGameStateSnapshot() {
  // Step 2: Call each imported function to get a piece of the game state.
  const gameInfo = parseTopBar(); // from parseTopBar.ts
  const user = parseUserHand(); // from parseUserHand.ts
  const opponents = parseOpponentHands(); // from parseOpponentHand.ts
  const markets = parseTradeBoards(); // from parseTradeBoards.ts
  const tradeHistory = parseTradeHistory(); // from parseTradeHistory.ts

  // Step 3: As requested, isolate only the most recent trade.
  // The first element in the tradeHistory array is the most recent one.
  const lastTrade = tradeHistory[0] || null;

  // Step 4: Assemble all the data into a single, comprehensive object.
  const fullGameState = {
    gameInfo,
    user,
    opponents,
    markets,
    lastTrade
  };

  // Optional: Log the final object to the console for easy debugging.
  console.log("--- FIGGIE GENIUS: FULL GAME STATE SNAPSHOT ---");
  console.log(JSON.stringify(fullGameState, null, 2));

  return fullGameState;
}

console.log(getGameStateSnapshot());