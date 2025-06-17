// function parseSingleTrade(tradeDiv) {
//   // A helper function to convert an rgb(x, y, z) string to a simple color name
//   const parseColorFromRgb = (rgbString) => {
//     if (!rgbString) return "unknown";
//     if (rgbString.includes("26, 167, 123")) return "green";
//     if (rgbString.includes("239, 64, 67")) return "red";
//     if (rgbString.includes("239, 168, 35")) return "orange";
//     if (rgbString.includes("39, 115, 222")) return "blue";
//     return "unknown";
//   };
//   // const tradeRow = tradeDiv.querySelectorAll('div[aria-disabled="true"]');
//   const columns = tradeDiv.children;
//   if (columns.length < 4) return;

//   const buyerNameElement = columns[0].querySelector("div");
//   const buyer = {
//     name: buyerNameElement?.innerText.trim() || "N/A",
//     color: parseColorFromRgb(buyerNameElement?.style.color),
//   };

//   const suitIcon = columns[1].querySelector("svg");
//   let suit = "Unknown";
//   if (suitIcon) {
//     const pathData = suitIcon.querySelector("path")?.getAttribute("d") || "";
//     if (pathData.includes("M47.37")) suit = "Spades";
//     else if (pathData.includes("M40.22")) suit = "Clubs";
//     else if (pathData.includes("M30.9")) suit = "Diamonds";
//     else if (pathData.includes("M55.11")) suit = "Hearts";
//   }

//   const sellerNameElement = columns[2].querySelector("div");
//   const seller = {
//     name: sellerNameElement?.innerText.trim() || "N/A",
//     color: parseColorFromRgb(sellerNameElement?.style.color),
//   };

//   const price = columns[3].innerText.trim() || "N/A";

//   const trade = {
//     seller,
//     buyer,
//     price,
//     suit,
//   };

//   console.log("Parsed Trade:", trade);
//   return trade;
// }
