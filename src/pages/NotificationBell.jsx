// src/pages/NotificationBell.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton } from "@mui/material";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  // Track current logged-in user
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        console.log("Current UID:", currentUser.uid);
      } else {
        setUserId(null);
        setUnreadCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen for pending invitations
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "Invitations"),          // Collection must match backend ("Invitations")
      where("toUserId", "==", userId),
      where("status", "==", "pending")        // Only pending invites count
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      console.log("Pending invites:", snapshot.docs.map(d => d.data()));
      setUnreadCount(snapshot.size);          // Badge shows only pending invites
    });

    return () => unsubscribeSnapshot();
  }, [userId]);

  return (
    <IconButton onClick={() => navigate("/notifications")}>
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon sx={{ color: "#fff" }} />
      </Badge>
    </IconButton>
  );
}
