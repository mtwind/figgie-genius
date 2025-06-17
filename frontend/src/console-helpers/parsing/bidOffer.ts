// /**
//  * Parses a single trade board row to extract bid or offer data.
//  * @param {HTMLDivElement} suitRowWrapper The specific HTML div element that wraps a single suit's trade board.
//  * @returns {object|null} A BidOfferData object if a bid or offer is found, otherwise null.
//  */
// function parseBidOffer(suitRowWrapper) {
//     const parseColorFromStyle = (element) => {
//       const style = element?.style.backgroundImage;
//       if (!style) return 'none';
//       if (style.includes('26, 167, 123')) return 'green';
//       if (style.includes('239, 64, 67')) return 'red';
//       if (style.includes('239, 168, 35')) return 'orange';
//       if (style.includes('39, 115, 222')) return 'blue';
//       return 'none';
//     };
  
//     const suitRow = suitRowWrapper.firstElementChild;
//     if (!suitRow || suitRow.children.length < 3) return null;
    
//     const [bidSide, centerIconContainer, offerSide] = suitRow.children;
  
//     const suitIcon = centerIconContainer.querySelector('svg');
//     let suit = 'Unknown';
//     if (suitIcon) {
//       const pathData = suitIcon.querySelector('path')?.getAttribute('d') || '';
//       if (pathData.includes('M47.37')) suit = 'Spades';
//       else if (pathData.includes('M40.22')) suit = 'Clubs';
//       else if (pathData.includes('M30.9')) suit = 'Diamonds';
//       else if (pathData.includes('M55.11')) suit = 'Hearts';
//     }
//     if (suit === 'Unknown') return null;
  
//     const bidDisplay = bidSide.querySelector('div[style*="background-image"]');
//     const bidPriceElement = bidDisplay?.querySelector('div[dir="auto"]');
//     const bidPrice = bidPriceElement?.innerText.trim();
//     const bidColor = parseColorFromStyle(bidDisplay);
  
//     if (bidPrice && bidColor !== 'none') {
//       return {
//         player: { name: 'Unknown Player', color: bidColor },
//         type: 'BID',
//         suit: suit,
//         price: parseInt(bidPrice, 10),
//       };
//     }
  
//     const offerDisplay = offerSide.querySelector('div[style*="background-image"]');
//     const offerPriceElement = offerDisplay?.querySelector('div[dir="auto"]');
//     const offerPrice = offerPriceElement?.innerText.trim();
//     const offerColor = parseColorFromStyle(offerDisplay);
  
//     if (offerPrice && offerColor !== 'none') {
//       return {
//         player: { name: 'Unknown Player', color: offerColor },
//         type: 'OFFER',
//         suit: suit,
//         price: parseInt(offerPrice, 10),
//       };
//     }
  
//     return null;
//   }