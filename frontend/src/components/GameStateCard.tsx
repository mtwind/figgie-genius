// // src/components/GameStateCard.tsx
// import PlayerCard from "@/components/PlayerCard";
// import { SuitIcon } from "@/components/SuitIcon";
// import type { FullGameState, OpponentData, UserData } from "@/types";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Divider,
//   Grid,
//   Typography,
// } from "@mui/material";

// interface GameStateCardProps {
//   gameState: FullGameState | null;
// }

// // Helper to create the colored player circles
// const PlayerCircle = ({ color }: { color: string }) => (
//   <Box
//     sx={{
//       width: 16,
//       height: 16,
//       borderRadius: "50%",
//       backgroundColor: color,
//       border: "1px solid #ccc",
//     }}
//   />
// );

// const GameStateCard = ({ gameState }: GameStateCardProps) => {
//   if (!gameState || !gameState.user) {
//     return (
//       <Accordion disabled>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography color="text.secondary">
//             Waiting for game data...
//           </Typography>
//         </AccordionSummary>
//       </Accordion>
//     );
//   }

//   const { user, opponents, markets, lastTrade } = gameState;
//   console.log(markets, lastTrade);
//   const allPlayers = [user, ...opponents];

//   const colorMap: { [key: string]: string } = {
//     blue: "#2773de",
//     green: "#1aa77b",
//     red: "#ef4043",
//     orange: "#efa823",
//   };

//   return (
//     <Accordion defaultExpanded sx={{ boxShadow: 3 }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Box sx={{ width: "100%" }}>
//           {/* --- FIXED GRID IMPLEMENTATION --- */}
//           <Grid
//             container
//             spacing={1}
//             sx={{ textAlign: "center", alignItems: "center" }}
//           >
//             <Grid size={1}></Grid>
//             {allPlayers.map((p) => (
//               <Grid
//                 size={1.5}
//                 key={p.name}
//                 sx={{ display: "flex", justifyContent: "center" }}
//               >
//                 <PlayerCircle color={colorMap[p.color] || "#888"} />
//               </Grid>
//             ))}
//             <Grid size={2}>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 Fair Price
//               </Typography>
//             </Grid>
//             <Grid size={2}>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 Goal Suit
//               </Typography>
//             </Grid>
//             <Grid size={2}>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 Cards Seen
//               </Typography>
//             </Grid>
//             <Grid size={2}>
//               <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                 Most Sales
//               </Typography>
//             </Grid>
//           </Grid>
//           <Divider sx={{ my: 1 }} />

//           {["Spades", "Clubs", "Diamonds", "Hearts"].map((suit) => (
//             <Grid
//               container
//               spacing={1}
//               key={suit}
//               sx={{ textAlign: "center", alignItems: "center", mb: 0.5 }}
//             >
//               <Grid size={1}>
//                 <SuitIcon suit={suit} />
//               </Grid>
//               {allPlayers.map((p) => {
//                 const hand =
//                   (p as UserData).hand || (p as OpponentData).cardChanges;
//                 return (
//                   <Grid size={1.5} key={`${p.name}-${suit}`}>
//                     <Typography variant="body2">{hand[suit] || "0"}</Typography>
//                   </Grid>
//                 );
//               })}
//               <Grid size={2}>
//                 <Typography variant="body2" color="text.secondary">
//                   --
//                 </Typography>
//               </Grid>
//               <Grid size={2}>
//                 <Typography variant="body2" color="text.secondary">
//                   --
//                 </Typography>
//               </Grid>
//               <Grid size={2}>
//                 <Typography variant="body2" color="text.secondary">
//                   --
//                 </Typography>
//               </Grid>
//               <Grid size={2}>
//                 <Typography variant="body2" color="text.secondary">
//                   --
//                 </Typography>
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       </AccordionSummary>
//       <AccordionDetails sx={{ backgroundColor: "#f8f9fa" }}>
//         <PlayerCard player={user} isUser={true} />
//         {opponents.map((op) => (
//           <PlayerCard key={op.name} player={op} isUser={false} />
//         ))}
//       </AccordionDetails>
//     </Accordion>
//   );
// };

// export default GameStateCard;
