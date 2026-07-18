// src/components/TypewriterWelcome.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const BRAND_GRADIENT = "#fff";

export default function TypewriterWelcome({
  text = "Welcome to Dare To Dream",
  onDone,
  typeSpeed = 95,
  holdMs = 900,
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    let timer;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(tick, typeSpeed);
      } else {
        timer = setTimeout(() => {
          if (!cancelled) onDone?.();
        }, holdMs);
      }
    };

    timer = setTimeout(tick, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, typeSpeed, holdMs, onDone]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Poppins, Segoe UI",
          fontWeight: 700,
          backgroundImage: BRAND_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          minHeight: "1.2em",
          textAlign: "center",
        }}
      >
        {shown}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "2px",
            ml: 0.5,
            color: "#fff",
            animation: "dtd-blink 1s step-start infinite",
          }}
        >
          |
        </Box>
      </Typography>
      <style>{"@keyframes dtd-blink { 50% { opacity: 0; } }"}</style>
    </Box>
  );
}
