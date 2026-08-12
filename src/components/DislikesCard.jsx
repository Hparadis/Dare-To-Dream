// src/components/DislikesCard.jsx
//
// Stage 1, screen 2. Each option gets its own accent color — the row
// fills with a soft tint of it on hover, and holds that fill once
// checked, so picking something feels like a small, specific choice
// rather than ticking an anonymous box.
import React, { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
// eslint-disable-next-line no-unused-vars -- used via <motion.div>
import { motion } from "framer-motion";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import {
  BRAND_COLOR,
  BRAND_COLOR_TEXT_ON,
  BRAND_WHITE,
  BRAND_PINK,
  BRAND_YELLOW,
  BRAND_GRAY_300,
  BRAND_GRAY_700,
  BRAND_GRAY_BORDER,
} from "../theme/brand";

// Add more here any time — nothing else needs to change to support it.
const DISLIKE_OPTIONS = [
  { key: "to_talk", label: "Talking a lot", accent: BRAND_COLOR },
  { key: "questions", label: "Being asked lots of questions", accent: BRAND_PINK },
  { key: "boring", label: "Boring, small talk", accent: BRAND_YELLOW },
];

function OptionRow({ option, checked, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onToggle}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.4,
          borderRadius: 3,
          cursor: "pointer",
          border: `1.5px solid ${checked ? option.accent : BRAND_GRAY_BORDER}`,
          background: checked ? alpha(option.accent, 0.14) : "transparent",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            background: alpha(option.accent, checked ? 0.18 : 0.08),
            borderColor: option.accent,
          },
        }}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            flexShrink: 0,
            borderRadius: "7px",
            border: `1.5px solid ${checked ? option.accent : BRAND_GRAY_300}`,
            background: checked ? option.accent : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
          }}
        >
          {checked && <CheckRoundedIcon sx={{ fontSize: 16, color: BRAND_COLOR_TEXT_ON }} />}
        </Box>
        <Typography variant="body2" sx={{ color: BRAND_WHITE }}>
          {option.label}
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function DislikesCard({ onSave, onSkip, saving = false }) {
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleSave = () => onSave?.({ dislikes: selected });

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        width: "100%",
        maxWidth: 480,
        boxSizing: "border-box",
        background: "transparent",
        border: "none",
        color: BRAND_WHITE,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        What should we avoid?
      </Typography>
      <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mb: 2.5 }}>
        Pick anything that's true for you — helps us not waste your time.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
        {DISLIKE_OPTIONS.map((opt, i) => (
          <OptionRow
            key={opt.key}
            option={opt}
            checked={selected.includes(opt.key)}
            onToggle={() => toggle(opt.key)}
            index={i}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={saving}
          onClick={handleSave}
          startIcon={<ArrowForwardRoundedIcon />}
          sx={{
            background: BRAND_COLOR,
            color: BRAND_COLOR_TEXT_ON,
            fontWeight: 600,
            justifyContent: "center",
            "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
          }}
        >
          Continue
        </Button>
        <Button
          fullWidth
          variant="text"
          disabled={saving}
          onClick={onSkip}
          startIcon={<SkipNextRoundedIcon />}
          sx={{ color: BRAND_GRAY_300, justifyContent: "center" }}
        >
          Skip
        </Button>
      </Box>
    </Paper>
  );
}
