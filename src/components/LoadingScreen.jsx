// src/components/LoadingScreen.jsx
//
// The generic "give us a second" loader, reused wherever a moment of
// loading happens outside the main hero (see TypewriterWelcome for that
// bespoke treatment). Same typing rhythm, simpler single-line layout.
import React from "react";
import { Box, Typography } from "@mui/material";
import { BRAND_WHITE, BRAND_COLOR } from "../theme/brand";
import { useWordCycle } from "../hooks/useWordCycle";

export default function LoadingScreen({
  prefix = "",
  words = ["Loading"],
  suffix = "",
  onDone,
  typeSpeed = 70,
  deleteSpeed = 35,
  holdMs = 700,
  loops = 1,
}) {
  const { displayed } = useWordCycle({ words, typeSpeed, deleteSpeed, holdMs, loops, onDone });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          color: BRAND_WHITE,
          fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2rem" },
          lineHeight: 1.35,
          maxWidth: "min(640px, 90vw)",
          wordBreak: "break-word",
        }}
      >
        {prefix}
        <Box component="span" sx={{ color: BRAND_COLOR }}>
          {displayed}
          <Box
            component="span"
            sx={{ opacity: 0.6, animation: "dtd-cursor-blink 1s step-start infinite" }}
          >
            |
          </Box>
        </Box>
        {suffix}
      </Typography>
      <style>{`@keyframes dtd-cursor-blink { 50% { opacity: 0; } }`}</style>
    </Box>
  );
}
