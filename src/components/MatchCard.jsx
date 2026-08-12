// src/components/MatchCard.jsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { fetchUserProfilesByIds } from "../api";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON, BRAND_WHITE, BRAND_GRAY_300, BRAND_PINK } from "../theme/brand";

export default function MatchCard({ match, onStartChat }) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let active = true;
    fetchUserProfilesByIds([match.matchedUserId])
      .then((profiles) => {
        if (!active) return;
        const list = Array.isArray(profiles) ? profiles : Object.values(profiles || {});
        const found = list.find((p) => (p.id || p.uid || p.userId) === match.matchedUserId);
        setProfile(found || null);
      })
      .catch((err) => console.error("Failed to load matched profile:", err))
      .finally(() => { if (active) setLoadingProfile(false); });
    return () => { active = false; };
  }, [match.matchedUserId]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
      <Paper sx={{ p: 3, borderRadius: 4, width: "100%", maxWidth: 420, background: "rgba(20,20,20,0.9)", border: `1.5px solid ${BRAND_PINK}`, animation: "dtd-match-pulse 2.4s ease-in-out infinite", textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mt: 1, color: BRAND_WHITE }}>It's a match</Typography>

        {loadingProfile ? (
          <CircularProgress size={18} sx={{ color: BRAND_PINK, my: 2 }} />
        ) : (
          <Box sx={{ my: 2 }}>
            <Typography sx={{ color: BRAND_WHITE, fontWeight: 700, fontSize: "1.1rem" }}>
              {profile?.name || "Someone new"}{profile?.age ? `, ${profile.age}` : ""}
            </Typography>
            {profile?.hobbies && (
              <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mt: 0.5 }}>
                Into {profile.hobbies}
              </Typography>
            )}
          </Box>
        )}

        <Button
          fullWidth variant="contained" onClick={() => onStartChat?.(match.matchedUserId)}
          startIcon={<ChatBubbleOutlineRoundedIcon />}
          sx={{ background: BRAND_COLOR, color: BRAND_COLOR_TEXT_ON, fontWeight: 600, mt: 1, "&:hover": { background: BRAND_COLOR, opacity: 0.9 } }}
        >
          Start chatting
        </Button>
      </Paper>
    </motion.div>
  );
}