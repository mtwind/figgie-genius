export function parseUserHand() {
    // Step 1: Find the user's unique avatar icon first. This is our unshakable anchor.
    // The 'user_icon_tophat_0_svg__a' ID is unique to the player's avatar.
    const avatarElement = document.querySelector('svg[id*="user_icon_tophat"]');
  
    if (!avatarElement) {
      console.error("Could not find the user's avatar icon to anchor the search.");
      return null;
    }
  
    // Step 2: From the avatar, traverse UP to the main container for the user's section.
    // The .closest() method finds the nearest parent that matches this style.
    const userContainer = avatarElement.closest('div[style*="border-top-left-radius: 2px"]');
  
    if (!userContainer) {
      console.error("Could not find the main user container by traversing up from the avatar.");
      return null;
    }
  
    // Step 3: Now that we have the correct userContainer, find the header bar inside it.
    const headerBar = userContainer.querySelector('div[style*="background-color"]');
    if (!headerBar) {
      console.error("Could not find header bar within the user container.");
      return null;
    }
  
    // From here, the rest of the logic can proceed as before, because we are now
    // guaranteed to be searching within the correct part of the page.
  
    const backgroundColor = headerBar.style.backgroundColor;
    let color = 'unknown';
    if (backgroundColor.includes('39, 115, 222')) color = 'blue';
    else if (backgroundColor.includes('26, 167, 123')) color = 'green';
    else if (backgroundColor.includes('239, 64, 67')) color = 'red';
    else if (backgroundColor.includes('239, 168, 35')) color = 'orange';
  
    const nameElement = headerBar.querySelector('div[style*="font-size: 20px"]');
    const name = nameElement?.innerText.trim() || 'N/A';
  
    const chipIcon = headerBar.querySelector('svg[id*="chip_desktop_svg"]');
    const chipsElement = chipIcon?.nextElementSibling;
    const chips = chipsElement?.innerText.trim() || 'N/A';
    
    const hand = {};
    let totalCards = 0;
    const cardRow = userContainer.querySelector('div[style*="align-self: center"]');
  
    if (cardRow) {
      const cardElements = cardRow.children;
      for (const cardDiv of cardElements) {
        const countStr = cardDiv.querySelector('div[style*="font-size: 20px"]')?.innerText || '0';
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
  
    console.log("User Data:", userData);
    return userData;
  }