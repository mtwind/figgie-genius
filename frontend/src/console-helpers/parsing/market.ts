// import { parseBidOffer } from "@/console-helpers/parsing/bidOffer";
// /**
//  * Parses a single suit's trade board to extract the last sale, bid, and offer data.
//  * This function assumes a 'parseBidOffer(element)' function is already defined in the environment.
//  * @param {HTMLDivElement} marketElementWrapper The outer div that wraps a single suit's trade board.
//  * @returns {object|null} An object representing the market data for that suit.
//  */
// function parseMarket(marketElementWrapper) {
//   // The actual row with the 3 columns is nested one level down.
//   const marketElement = marketElementWrapper.firstElementChild;
//   if (!marketElement || marketElement.children.length < 3) {
//     console.error("Could not find the 3 main columns in the provided element.");
//     return null;
//   }

//   const [bidSide, centerIconContainer, offerSide] = marketElement.children;

//   // --- Get Last Sale from the Center Column ---
//   const lastSaleElement = centerIconContainer.querySelector('div[dir="auto"]');
//   const lastSale = lastSaleElement ? lastSaleElement.innerText.trim() : "N/A";

//   // --- Get Bid and Offer data by calling the existing parseBidOffer function ---
//   const bidData = parseBidOffer(marketElementWrapper, true); // Re-uses your perfected function
//   const offerData = parseBidOffer(marketElementWrapper, false); // Re-uses your perfected function

//   const marketData = {
//     lastSale: lastSale,
//     bid: bidData,
//     offer: offerData,
//   };

//   console.log("Parsed Market Data:", marketData);
//   return marketData;
// }
