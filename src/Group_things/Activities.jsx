import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "./../config/firebase"; // adjust if needed
import { getAuth } from "firebase/auth";

export default function Activities({ groupId }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [activities, setActivities] = useState([]);
  const [inputs, setInputs] = useState([""]);
  const [showOverlay, setShowOverlay] = useState(false);

  // 🔹 Fetch group activities in real-time
  useEffect(() => {
    if (!groupId) return;

    const unsub = onSnapshot(
      collection(db, "Groups", groupId, "activities"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActivities(list);
      }
    );

    return () => unsub();
  }, [groupId]);

  // 🔹 Fetch group members (assuming stored in `Groups/{groupId}.members`)
  const fetchGroupMembers = async () => {
    const groupRef = doc(db, "Groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) return [];
    return groupSnap.data().members || [];
  };

  // 🔹 Add activity + notifications
  const handlePublish = async () => {
    const newActivities = inputs.filter((i) => i.trim() !== "");

    if (!newActivities.length) return;

    try {
      const memberIds = await fetchGroupMembers();

      for (const text of newActivities) {
        const activityRef = await addDoc(
          collection(db, "Groups", groupId, "activities"),
          {
            text,
            createdBy: currentUser?.uid || "Anonymous",
            createdAt: serverTimestamp(),
            participants: [],
          }
        );

        // Create notifications for all members
        for (const uid of memberIds) {
          await addDoc(collection(db, "Groups", groupId, "notifications"), {
            type: "activity",
            text: `New group activity: "${text}"`,
            createdAt: serverTimestamp(),
            recipientId: uid,
            activityId: activityRef.id,
          });
        }
      }

      setInputs([""]);
      setShowOverlay(false);
    } catch (err) {
      console.error("Failed to publish activities:", err);
    }
  };

  // 🔹 Toggle participation
  const toggleParticipation = async (activityId, hasJoined) => {
    try {
      const ref = doc(db, "Groups", groupId, "activities", activityId);
      await updateDoc(ref, {
        participants: hasJoined
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.error("Failed to update participation:", err);
    }
  };

  return (
    <Box>
      {/* Overlay for adding activities */}
      {showOverlay ? (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            border: "2px solid #4cafef",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New Activities</Typography>
            <IconButton onClick={() => setShowOverlay(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {inputs.map((val, idx) => (
            <TextField
              key={idx}
              fullWidth
              variant="standard"
              value={val}
              onChange={(e) => {
                const updated = [...inputs];
                updated[idx] = e.target.value;
                setInputs(updated);
              }}
              placeholder={`Activity ${idx + 1}`}
              sx={{ my: 1 }}
            />
          ))}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Tooltip title="Add another activity">
              <IconButton onClick={() => setInputs([...inputs, ""])}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" color="primary" onClick={handlePublish}>
              Publish
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box textAlign="right" mb={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowOverlay(true)}
          >
            Add Activity
          </Button>
        </Box>
      )}

      {/* Activity list */}
      {activities.map((activity) => {
        const hasJoined = activity.participants?.includes(currentUser?.uid);
        return (
          <Paper
            key={activity.id}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{activity.text}</Typography>
            <Button
              size="small"
              variant={hasJoined ? "outlined" : "contained"}
              onClick={() => toggleParticipation(activity.id, hasJoined)}
            >
              {hasJoined ? "Joined" : "Join"}
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
}
