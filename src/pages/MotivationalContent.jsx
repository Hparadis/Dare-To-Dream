// src/pages/MotivationalContent.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export default function MotivationalContent() {
  const quotes = [
    "Believe you can and you're halfway there.",
    "Dream big, work hard, stay focused.",
    "Your only limit is you.",
  ];
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
      }}
    >
      <LightbulbIcon sx={{ fontSize: 32, color: "#2196f3" }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Tip of the Day
        </Typography>
        <Typography variant="body2">{randomQuote}</Typography>
      </Box>
    </Paper>
  );
}
