import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./../config/firebase"; // adjust path if needed
import { getAuth } from "firebase/auth";

export default function Announcements({ groupId }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [announcements, setAnnouncements] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("all"); // default: whole group
  const [groupMembers, setGroupMembers] = useState([]);

  // 🔹 Real-time announcements
  useEffect(() => {
    if (!groupId) return;

    const unsub = onSnapshot(
      collection(db, "Groups", groupId, "announcements"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(list);
      }
    );

    return () => unsub();
  }, [groupId]);

  // 🔹 Fetch members for targeting
  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      const groupRef = doc(db, "Groups", groupId);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        setGroupMembers(groupSnap.data().members || []);
      }
    };
    fetchMembers();
  }, [groupId]);

  // 🔹 Handle publish
  const handlePublish = async () => {
    if (!message.trim()) return;

    try {
      const recipientsList =
        recipients === "all" ? groupMembers : [recipients];

      // Save announcement
      const annRef = await addDoc(
        collection(db, "Groups", groupId, "announcements"),
        {
          text: message,
          createdBy: currentUser?.uid || "Anonymous",
          createdAt: serverTimestamp(),
          recipients: recipientsList,
        }
      );

      // Create notifications
      for (const uid of recipientsList) {
        await addDoc(collection(db, "Groups", groupId, "notifications"), {
          type: "announcement",
          text: `New announcement: "${message}"`,
          createdAt: serverTimestamp(),
          recipientId: uid,
          announcementId: annRef.id,
        });
      }

      setMessage("");
      setRecipients("all");
      setShowOverlay(false);
    } catch (err) {
      console.error("Failed to publish announcement:", err);
    }
  };

  return (
    <Box>
      {/* Overlay for posting announcement */}
      {showOverlay ? (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            border: "2px solid #ff9800",
            borderRadius: 2,
            backgroundColor: "#fffbe6",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New Announcement</Typography>
            <IconButton onClick={() => setShowOverlay(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ my: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="recipient-select-label">Send To</InputLabel>
            <Select
              labelId="recipient-select-label"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            >
              <MenuItem value="all">Whole Group</MenuItem>
              {groupMembers.map((memberId) => (
                <MenuItem key={memberId} value={memberId}>
                  <Chip label={memberId} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box textAlign="right">
            <Button
              variant="contained"
              color="warning"
              onClick={handlePublish}
            >
              Publish
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box textAlign="right" mb={2}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setShowOverlay(true)}
          >
            Post Announcement
          </Button>
        </Box>
      )}

      {/* Announcement Feed */}
      {announcements.map((ann) => (
        <Paper
          key={ann.id}
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1">{ann.text}</Typography>
          <Typography variant="caption" color="text.secondary">
            Posted by {ann.createdBy} —{" "}
            {ann.recipients?.length === groupMembers.length
              ? "Whole Group"
              : `To ${ann.recipients?.length} member(s)`}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
