// src/pages/DesktopMemberOverlay.jsx
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

export default function DesktopMemberOverlay({ open, onClose, type, members }) {
  if (!open) return null;
  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        top: 100,
        left: "20%",
        right: "20%",
        backgroundColor: "rgba(0,0,0,0.9)",
        color: "#fff",
        p: 3,
        borderRadius: 2,
        zIndex: 2100,
      }}
    >
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Members
      </Typography>
      {members.map((member, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{member.name}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {member.description}
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#2196f3", color: "#fff" }}
          >
            {type === "friends" ? "Invite" : "Join"}
          </Button>
        </Box>
      ))}
    </Paper>
  );
}
