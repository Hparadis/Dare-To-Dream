// src/components/LocationHangoutDialog.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress, Box } from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON } from "../theme/brand";

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function LocationHangoutDialog({ open, onClose, userId, otherUserId, otherLabel = "They" }) {
  const [status, setStatus] = useState("ask"); // ask | locating | result | denied | unsupported | error
  const [distanceKm, setDistanceKm] = useState(null);
  const [waitingOnOther, setWaitingOnOther] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus("ask");
      setDistanceKm(null);
      setWaitingOnOther(false);
    }
  }, [open]);

  const handleAllow = () => {
    setStatus("locating");
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const mine = { lat: pos.coords.latitude, lng: pos.coords.longitude, updatedAt: new Date().toISOString() };
        try {
          await setDoc(doc(db, "Users", userId), { location: mine }, { merge: true });

          const otherSnap = await getDoc(doc(db, "Users", otherUserId));
          const otherLocation = otherSnap.exists() ? otherSnap.data().location : null;

          if (otherLocation) {
            setDistanceKm(haversineKm(mine, otherLocation));
          } else {
            setWaitingOnOther(true);
          }
          setStatus("result");
        } catch (err) {
          console.error("Location save/read failed:", err);
          setStatus("error");
        }
      },
      (err) => {
        console.error("Geolocation denied:", err);
        setStatus("denied");
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { background: "#242424", color: "#fff", borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Hang out?</DialogTitle>
      <DialogContent sx={{ minWidth: 280 }}>
        {status === "ask" && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            {otherLabel} would like to hang out. Allow location so we can check if you're nearby?
          </Typography>
        )}
        {status === "locating" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            <CircularProgress size={20} sx={{ color: BRAND_COLOR }} />
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              Getting your location...
            </Typography>
          </Box>
        )}
        {status === "result" && waitingOnOther && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Got your location. Waiting on {otherLabel.toLowerCase()} to share theirs too.
          </Typography>
        )}
        {status === "result" && !waitingOnOther && distanceKm != null && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            You're about <strong style={{ color: BRAND_COLOR }}>{distanceKm.toFixed(1)} km</strong> apart
            {distanceKm <= 15 ? " — close enough to meet up!" : " — that's a bit of a trip."}
          </Typography>
        )}
        {status === "denied" && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            No worries — location access was declined. You can still chat instead.
          </Typography>
        )}
        {status === "unsupported" && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Location isn't available on this device/browser.
          </Typography>
        )}
        {status === "error" && (
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Something went wrong checking location — try again in a moment.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {status === "ask" ? (
          <>
            <Button onClick={onClose} sx={{ color: "#aaa" }}>
              Not now
            </Button>
            <Button
              variant="contained"
              onClick={handleAllow}
              sx={{ background: BRAND_COLOR, color: BRAND_COLOR_TEXT_ON, fontWeight: 600, "&:hover": { background: BRAND_COLOR, opacity: 0.9 } }}
            >
              Allow location
            </Button>
          </>
        ) : (
          <Button onClick={onClose} sx={{ color: BRAND_COLOR }}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
