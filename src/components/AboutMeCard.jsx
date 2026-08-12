// src/components/AboutMeCard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Grid } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import {
  BRAND_COLOR,
  BRAND_COLOR_TEXT_ON,
  BRAND_WHITE,
  BRAND_GRAY_300,
  BRAND_GRAY_BORDER,
} from "../theme/brand";

export default function AboutMeCard({
  title = "Let us know a bit about yourself",
  subtitle,
  onSave,
  onSkip,
  saving = false,
  allowSkip = true,
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hobbies, setHobbies] = useState("");

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    onSave({ name: name.trim(), age: age.trim(), hobbies: hobbies.trim() });
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: BRAND_WHITE,
      background: "rgba(255,255,255,0.05)",
      borderRadius: "14px",
      "& fieldset": { borderColor: BRAND_GRAY_BORDER },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
      "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
    },
    "& .MuiInputLabel-root": { color: BRAND_GRAY_300 },
    "& .MuiInputLabel-root.Mui-focused": { color: BRAND_COLOR },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        background: "transparent",
        border: "none",
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        color: BRAND_WHITE,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 2.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mb: 2.5 }}>
          {subtitle}
        </Typography>
      )}

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={fieldSx} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Hobbies / interests"
            placeholder="hiking, music, gaming..."
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            sx={fieldSx}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!canSave || saving}
          onClick={handleSave}
          startIcon={<ArrowForwardRoundedIcon />}
          sx={{
            background: BRAND_COLOR,
            color: BRAND_COLOR_TEXT_ON,
            fontWeight: 600,
            justifyContent: "center",
            "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
            "&.Mui-disabled": { background: "rgba(255,255,255,0.08)", color: BRAND_GRAY_300 },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        {allowSkip && (
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
        )}
      </Box>
    </Paper>
  );
}