import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NatureIcon from "@mui/icons-material/Nature"
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StarsIcon from "@mui/icons-material/Stars";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import BedtimeIcon from "@mui/icons-material/Bedtime";

import dailyQuotes from "../data/dailyQuotes";

export default function MotivationalContent() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const icons = {
    Monday: <LightbulbIcon sx={{ fontSize: 32, color: "#2196f3" }} />,
    Tuesday: <NatureIcon sx={{ fontSize: 32, color: "#4caf50" }} />,
    Wednesday: <WhatshotIcon sx={{ fontSize: 32, color: "#ff5722" }} />,
    Thursday: <StarsIcon sx={{ fontSize: 32, color: "#9c27b0" }} />,
    Friday: <FavoriteIcon sx={{ fontSize: 32, color: "#f44336" }} />,
    Saturday: <SelfImprovementIcon sx={{ fontSize: 32, color: "#ff9800" }} />,
    Sunday: <BedtimeIcon sx={{ fontSize: 32, color: "#3f51b5" }} />,
  };

  const today = new Date().getDay();
  const currentDay = dayNames[today];
  const quotes = dailyQuotes[currentDay];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Paper
      sx={{
        p: 2,
        mt: 4,
        backgroundColor: "rgba(33,150,243,0.1)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "#fff",
      }}
    >
      {icons[currentDay]}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {currentDay} Motivation
        </Typography>
        <Typography variant="body2">{randomQuote}</Typography>
      </Box>
    </Paper>
  );
}
