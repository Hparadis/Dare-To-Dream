// src/components/HangoutInviteCard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON, BRAND_WHITE, BRAND_PINK, BRAND_GRAY_300, BRAND_GRAY_BORDER } from "../theme/brand";

export default function HangoutInviteCard({ onSend, sending = false }) {
  const [note, setNote] = useState("");
  const canSend = note.trim().length > 0;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, background: "transparent", border: "none", width: "100%", maxWidth: 420, color: BRAND_WHITE, boxSizing: "border-box" }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Say why</Typography>
      <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mb: 2.5 }}>
        A quick note goes a long way — e.g. "Want to play pool sometime?"
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="What do you want to do together?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: BRAND_WHITE, background: "rgba(255,255,255,0.05)", borderRadius: "14px",
            "& fieldset": { borderColor: BRAND_GRAY_BORDER },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
            "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
          },
        }}
      />
      <Button
        fullWidth variant="contained" disabled={!canSend || sending}
        onClick={() => onSend?.(note.trim())}
        startIcon={<SendRoundedIcon />}
        sx={{ background: BRAND_PINK, color: BRAND_COLOR_TEXT_ON, fontWeight: 600, justifyContent: "center", "&:hover": { background: BRAND_PINK, opacity: 0.9 }, "&.Mui-disabled": { background: "rgba(255,255,255,0.08)", color: BRAND_GRAY_300 } }}
      >
        Send invite
      </Button>
    </Paper>
  );
}