// src/components/SuitIcon.tsx

import { Box } from "@mui/material";

// Define the component's props for type safety
interface SuitIconProps {
  suit: string;
  size?: { width: string; height: string };
}

export const SuitIcon = ({ suit, size }: SuitIconProps) => {
  // If the suit is unknown, don't render anything.
  if (!suit || suit === "Unknown") {
    return null;
  }

  // Dynamically construct the path to the image in your public folder.
  // We assume the images are named 'Spades.png', 'Clubs.png', etc.
  // Note: The path starts with '/' which points to the root of the 'public' directory.
  const iconPath = `/suits/${suit}.png`;

  return (
    <Box
      component="img"
      src={iconPath}
      alt={`${suit} icon`}
      // Apply styling to control the size of the icon
      sx={{
        width: size ? size.width : "20px",
        height: size ? size.height : "20px",
      }}
    />
  );
};
