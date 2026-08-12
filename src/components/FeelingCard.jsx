// src/components/FeelingCard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  BRAND_COLOR,
  BRAND_COLOR_TEXT_ON,
  BRAND_WHITE,
  BRAND_PINK,
  BRAND_YELLOW,
  BRAND_GRAY_300,
  BRAND_GRAY_BORDER,
} from "../theme/brand";

const FEELING_OPTIONS = [
  { key: "lonely", label: "Lonely", accent: BRAND_COLOR },
  { key: "sad", label: "Sad", accent: BRAND_PINK },
  { key: "anxious", label: "Anxious", accent: BRAND_YELLOW },
  { key: "stressed", label: "Stressed", accent: BRAND_COLOR },
  { key: "just_talk", label: "Just want to talk", accent: BRAND_PINK },
];

function FeelingRow({ option, checked, onSelect, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onSelect}
        role="radio"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.2,
          borderRadius: 3,
          cursor: "pointer",
          border: `1.5px solid ${checked ? option.accent : BRAND_GRAY_BORDER}`,
          background: checked ? alpha(option.accent, 0.14) : "transparent",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
          "&:hover": { background: alpha(option.accent, checked ? 0.18 : 0.08), borderColor: option.accent },
        }}
      >
        <Box
          sx={{
            width: 18,
            height: 18,
            flexShrink: 0,
            borderRadius: "50%",
            border: `1.5px solid ${checked ? option.accent : BRAND_GRAY_300}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked && <Box sx={{ width: 9, height: 9, borderRadius: "50%", background: option.accent }} />}
        </Box>
        <Typography variant="body2" sx={{ color: BRAND_WHITE }}>{option.label}</Typography>
      </Box>
    </motion.div>
  );
}

export default function FeelingCard({ onSave, saving = false }) {
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState("");
  const canSubmit = Boolean(selected || detail.trim());

  const handleSave = () => canSubmit && onSave?.({ feeling: selected, detail: detail.trim() });

  return (
    <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, width: "100%", maxWidth: 480, boxSizing: "border-box", background: "transparent", border: "none", color: BRAND_WHITE }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>How are you feeling right now?</Typography>
      <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mb: 2.5 }}>
        Shared with them before you chat — so it's clear who they're about to talk to.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        {FEELING_OPTIONS.map((opt, i) => (
          <FeelingRow key={opt.key} option={opt} checked={selected === opt.key} onSelect={() => setSelected(opt.key)} index={i} />
        ))}
      </Box>

      <TextField
        fullWidth
        placeholder="Add a little more, if you want (optional)"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        multiline
        maxRows={3}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: BRAND_WHITE,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "14px",
            "& fieldset": { borderColor: BRAND_GRAY_BORDER },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
            "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        disabled={saving || !canSubmit}
        onClick={handleSave}
        startIcon={<ArrowForwardRoundedIcon />}
        sx={{
          background: BRAND_COLOR, color: BRAND_COLOR_TEXT_ON, fontWeight: 600, justifyContent: "center",
          "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
          "&.Mui-disabled": { background: "rgba(255,255,255,0.08)", color: BRAND_GRAY_300 },
        }}
      >
        Start chatting
      </Button>
    </Paper>
  );
}