// src/pages/InviteButton.jsx
import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

export default function InviteButton() {
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    setLoading(true);
    // Simulate an API call delay (replace with your real invite call)
    setTimeout(() => {
      setLoading(false);
      setInvited(true);
    }, 1500);
  };

  if (invited) {
    return (
      <Button
        variant="contained"
        size="small"
        sx={{ backgroundColor: "green", color: "#fff", "&:hover": { backgroundColor: "green" } }}
      >
        Invited
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleInvite}
      disabled={loading}
      sx={{ backgroundColor: "#33", color: "#fff", "&:hover": { backgroundColor: "#33" } }}
    >
      {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Invite"}
    </Button>
  );
}
