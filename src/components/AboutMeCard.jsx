// src/components/AboutMeCard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, IconButton, Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BRAND_GRADIENT = "linear-gradient(45deg, #FF6B8B 0%, #6200EE 50%, #03DAC6 100%)";

export default function AboutMeCard({
  title = "Let us know a bit about yourself",
  subtitle,
  onSave,
  onSkip,
  saving = false,
  allowSkip = true,
}) {
  const [value, setValue] = useState("");

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        maxWidth: 440,
        width: "100%",
        mx: "auto",
        color: "#fff",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 1.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "#aaa", mb: 1.5 }}>
          {subtitle}
        </Typography>
      )}
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="Your name, age, whatever feels comfortable to share..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            background: "rgba(255,255,255,0.05)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
          },
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: allowSkip ? "space-between" : "flex-end" }}>
        {allowSkip && (
          <Tooltip title="Skip for now">
            <span>
              <IconButton onClick={onSkip} disabled={saving} sx={{ color: "#888" }} aria-label="skip">
                <ArrowForwardIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Button
          variant="contained"
          disabled={!value.trim() || saving}
          onClick={() => onSave(value.trim())}
          sx={{
            backgroundImage: BRAND_GRADIENT,
            color: "#fff",
            fontWeight: 600,
            "&:hover": { opacity: 0.9, backgroundImage: BRAND_GRADIENT },
            "&.Mui-disabled": { backgroundImage: "none", background: "#444", color: "#777" },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Paper>
  );
}
