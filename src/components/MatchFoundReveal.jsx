// src/components/MatchFoundReveal.jsx
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { BRAND_WHITE, BRAND_PINK } from "../theme/brand";

export default function MatchFoundReveal({ onComplete, durationMs = 1300, label = "Found someone" }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [onComplete, durationMs]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 6 }}>
      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
        <ArrowDownwardRoundedIcon sx={{ fontSize: 40, color: BRAND_PINK }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
      <Typography sx={{ color: BRAND_WHITE, fontWeight: 700, mt: 1 }}>{label}</Typography>
      </motion.div>
    </Box>
  );
}