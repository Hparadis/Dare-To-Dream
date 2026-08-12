// src/components/TypewriterWelcome.jsx
//
// The very first thing anyone sees. Three staggered beats:
//   Here At
//   Dare To Dream        (big, tilted, offset)
//   We [cycling word] How You Feel   (each word its own color)
//
// The word never really stops cycling — after the first pass, `onDone`
// fires once (moving the app on to the next stage) but the animation
// keeps breathing quietly in the background, now smaller and dimmer,
// while whatever comes next takes the foreground. Pass `compact` to put
// it in that background state.
import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
// eslint-disable-next-line no-unused-vars -- used via <motion.div>
import { motion } from "framer-motion";
import { BRAND_WHITE, BRAND_COLOR, BRAND_PINK, BRAND_YELLOW, BRAND_COLOR_GLOW } from "../theme/brand";
import { useWordCycle } from "../hooks/useWordCycle";

const WORDS = ["Understand", "Know", "Get", "Acknowledge"];
const WORD_COLORS = [BRAND_COLOR, BRAND_PINK, BRAND_YELLOW, BRAND_COLOR];

export default function TypewriterWelcome({ onDone, compact = false }) {
  const firedRef = useRef(false);

  const { displayed, wordIndex } = useWordCycle({
    words: WORDS,
    typeSpeed: 70,
    deleteSpeed: 35,
    holdMs: 650,
    loops: Infinity,
    onLoopComplete: () => {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone?.();
      }
    },
  });

  return (
    <motion.div
      animate={{ scale: compact ? 0.5 : 1, opacity: compact ? 0.75 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top left", width: "100%" }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: compact ? "auto" : "100vh",
          textAlign: "center",
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          px: { xs: 4, sm: 8, md: 12 },
          py: compact ? 4 : 0,
        }}
      >
        

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              }}
            >
              Here At
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 4, maxWidth: "100%" }}
          >
            <Typography
              sx={{
                color: BRAND_WHITE,
                fontWeight: 800,
                lineHeight: 1,
                fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.2rem" },
                wordBreak: "break-word",
              }}
            >
              Dare To Dream
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 28, maxWidth: "100%" }}
          >
            <Typography
              sx={{
                color: BRAND_WHITE,
                fontWeight: 600,
                fontSize: { xs: "1.15rem", sm: "1.5rem", md: "1.8rem" },
                maxWidth: "min(560px, 85vw)",
                wordBreak: "break-word",
              }}
            >
              We{" "}
              <Box component="span" sx={{ color: WORD_COLORS[wordIndex % WORD_COLORS.length] }}>
                {displayed}
                <Box
                  component="span"
                  sx={{ opacity: 0.6, animation: "dtd-cursor-blink 1s step-start infinite" }}
                >
                  |
                </Box>
              </Box>{" "}
              How You Feel
            </Typography>
          </motion.div>
        </Box>

        <style>{`
          @keyframes dtd-cursor-blink { 50% { opacity: 0; } }
          @keyframes dtd-glow-drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(4%, 3%) scale(1.1); }
          }
        `}</style>
      </Box>
    </motion.div>
  );
}
