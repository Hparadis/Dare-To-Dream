// src/components/SharedOverlayContent.jsx
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { fetchUserProfilesByIds } from "../api";

const SharedOverlayContent = ({
  title,
  items,
  onItemClick,
  emptyMessage,
  type,
  inviteStatus = {},
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  const navigate = useNavigate();

  const [memberProfiles, setMemberProfiles] = useState({});
  const [loadingMembers, setLoadingMembers] = useState(false);

  const getIdKey = (item) => item.id || item.groupId || item.communityId || item.userId;

  useEffect(() => {
    if (!safeItems.length) return;

    const loadMembers = async () => {
      setLoadingMembers(true);
      const newProfiles = {};

      for (const item of safeItems) {
        if ((type === "groups" || type === "communities") && Array.isArray(item.members) && item.members.length > 0) {
          try {
            const profiles = await fetchUserProfilesByIds(item.members);
            const idKey = getIdKey(item);
            newProfiles[idKey] = Array.isArray(profiles) ? profiles : [];
          } catch (err) {
            console.error(`Error fetching members for ${item.name || item.title}`, err);
            newProfiles[getIdKey(item)] = [];
          }
        }
      }

      setMemberProfiles(newProfiles);
      setLoadingMembers(false);
    };

    loadMembers();
  }, [safeItems, type]);

  // Helper to format top row members
  const formatMemberNames = (members) => {
    if (!members || members.length === 0) return "";
    const names = members.map((m) => m.name || "Anonymous");
    if (names.length <= 3) return names.join(", ");
    return names.slice(0, 3).join(", ") + ` +${names.length - 3} more`;
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ color: "#fff", marginBottom: "1rem", fontWeight: "bold" }}
      >
        {title}
      </Typography>

      {safeItems.length === 0 ? (
        <Box sx={{ color: "red", p: 1, textAlign: "center" }}>{emptyMessage}</Box>
      ) : (
        safeItems.map((item, index) => {
          const status = inviteStatus[item.userId] || "idle";
          const idKey = getIdKey(item);
          const fetchedMembers = memberProfiles[idKey] || [];

          let buttonText = type === "friends" ? "Invite" : "Join";
          let disabled = false;

          if (type === "friends") {
            if (status === "loading") buttonText = "Inviting...";
            else if (status === "invited") buttonText = "Invited";
            else if (status === "error") buttonText = "Retry Invite";
            disabled = status === "loading" || status === "invited";
          }

          return (
            <Box
              key={idKey}
              sx={{
                p: 2,
                backgroundColor: "#444",
                mb: 1,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                "&:hover": { backgroundColor: "#555" },
              }}
            >
              {/* Top row: Avatar + name + button */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {type === "friends" && (
                  <Avatar
                    src={item.profileImage || "/default-avatar.jpg"}
                    sx={{ width: 56, height: 56 }}
                  >
                    {item.name ? item.name[0]?.toUpperCase() : "U"}
                  </Avatar>
                )}

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {item.name || item.title || "Unnamed"}
                  </Typography>

                  {type === "friends" && item.description && (
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      {item.description}
                    </Typography>
                  )}

                  {(type === "groups" || type === "communities") && Array.isArray(item.members) && (
                    <>
                      <Typography variant="body2" sx={{ color: "#ccc" }}>
                        Members: {fetchedMembers.length || item.members.length}
                      </Typography>
                      {fetchedMembers.length > 0 && (
                        <Typography variant="body2" sx={{ color: "#ccc" }}>
                          {formatMemberNames(fetchedMembers)}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  disabled={disabled}
                  onClick={() => {
                    if (type === "groups" || type === "communities") {
                      navigate("/group", { state: { group: item } });
                    } else {
                      onItemClick(item);
                    }
                  }}
                  sx={{
                    backgroundColor: status === "invited" ? "gray" : "#2196f3",
                    "&:hover": {
                      backgroundColor: status === "invited" ? "gray" : "#1976d2",
                    },
                    color: "#fff",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                  }}
                >
                  {buttonText}
                </Button>
              </Box>

              {/* Accordion for groups/communities */}
              {(type === "groups" || type === "communities") && Array.isArray(item.members) && (
                <Accordion sx={{ backgroundColor: "#333", color: "#fff", borderRadius: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                    <Typography>Members ({fetchedMembers.length || 0})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {loadingMembers ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : fetchedMembers.length > 0 ? (
                      fetchedMembers.map((m) => (
                        <Box
                          key={m.userId}
                          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                        >
                          <Avatar
                            src={m.profileImage || "/default-avatar.jpg"}
                            sx={{ width: 32, height: 32 }}
                          >
                            {m.name ? m.name[0]?.toUpperCase() : "U"}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: "#ccc" }}>
                            {m.name || "Anonymous User"}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#888" }}>
                        No members yet.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}

              {status === "error" && (
                <Typography variant="caption" sx={{ color: "red", ml: 2 }}>
                  Failed to send invite.
                </Typography>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default SharedOverlayContent;
