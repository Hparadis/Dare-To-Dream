// src/pages/MobileMemberListModal.jsx
import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MobileMemberListModal({ open, onClose, type, members }) {
  // Track status per member name: 'idle' | 'loading' | 'done'
  const [statusMap, setStatusMap] = useState({});

  const handleAction = (name) => {
    setStatusMap((m) => ({ ...m, [name]: "loading" }));
    setTimeout(() => {
      setStatusMap((m) => ({ ...m, [name]: "done" }));
    }, 1000);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(51,51,51,0.8)",
          backdropFilter: "blur(10px)",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
          border: "1px solid #33",
          color: "#fff",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "center", color: "#fff" }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Typography>

      {members && members.length > 0 ? (
        members.map((member, index) => {
          const status = statusMap[member.name] || "idle";
          const isInvite = type === "friends";
          const label =
            status === "loading"
              ? isInvite
                ? "Inviting..."
                : "Joining..."
              : status === "done"
              ? isInvite
                ? "✓ Invited"
                : "✓ Joined"
              : isInvite
              ? "Invite"
              : "Join";

          return (
            <Accordion
              key={member.name}
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "1px solid #33",
                mb: 1,
                color: "#fff",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              >
                <Typography>{member.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{member.description}</Typography>
                <Box sx={{ mt: 1 }}>
                <Button
                size="small"
                variant="contained"
                color="success"                       // always green
                disabled={status === "loading" || status === "done"}
                onClick={() => handleAction(member.name)}
                startIcon={
                    status === "loading" ? (
                    <CircularProgress 
                        size={16} 
                        color="success"                // spinner inherits the button's green
                    />
                    ) : null
                }
                sx={{ 
                    minWidth: 100, 
                    color: "#fff"                      // ensure text stays white 
                }}
                >
                {label}
                </Button>

                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography variant="body2" sx={{ color: "#fff" }}>
          No {type} available.
        </Typography>
      )}
    </Drawer>
  );
}
