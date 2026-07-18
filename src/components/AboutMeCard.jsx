// src/components/AboutMeCard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, IconButton, Tooltip, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON } from "../theme/brand";

/**
 * onSave receives { name, age, hobbies } — not a single string — so this
 * can also be reused anywhere else a short profile is needed.
 */
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
      color: "#fff",
      background: "rgba(255,255,255,0.05)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
      "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
    },
    "& .MuiInputLabel-root": { color: "#999" },
    "& .MuiInputLabel-root.Mui-focused": { color: BRAND_COLOR },
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        width: "100%",
        maxWidth: { xs: "100%", sm: 480, md: 560 },
        mx: "auto",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: allowSkip ? "space-between" : "flex-end",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
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
          disabled={!canSave || saving}
          onClick={handleSave}
          sx={{
            background: BRAND_COLOR,
            color: BRAND_COLOR_TEXT_ON,
            fontWeight: 600,
            "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
            "&.Mui-disabled": { background: "#444", color: "#777" },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Paper>
  );
}
