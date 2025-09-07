import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";

export default function Notifications() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Current user
  const db = getFirestore();
  const auth = getAuth();

  // Fetch invites in real-time
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);

        const q = query(
          collection(db, "Invitations"),
          where("toUserId", "==", authUser.uid)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInvites(results);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
        setInvites([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const respondToInvite = async (invite, accepted) => {
    try {
      if (!user) return;

      // 1️⃣ Update the invitation status
      const notifRef = doc(db, "Invitations", invite.id);
      await updateDoc(notifRef, {
        status: accepted ? "accepted" : "rejected",
      });

      // 2️⃣ If accepted, add friend entries
      if (accepted) {
        await Promise.all([
          setDoc(doc(db, "friends", `${invite.fromUserId}_${user.uid}`), {
            userId: invite.fromUserId,
            friendId: user.uid,
            createdAt: new Date().toISOString(),
          }),
          setDoc(doc(db, "friends", `${user.uid}_${invite.fromUserId}`), {
            userId: user.uid,
            friendId: invite.fromUserId,
            createdAt: new Date().toISOString(),
          }),
        ]);

        // 3️⃣ Notify inviter about acceptance
        await addDoc(collection(db, "Invitations"), {
          fromUserId: user.uid,
          fromUserName: user.displayName || "Unknown",
          fromUserEmail: user.email || "",
          toUserId: invite.fromUserId,
          status: "accepted_notification",
          timestamp: new Date().toISOString(),
          message: `${user.displayName || "Someone"} accepted your friend request`,
        });
      }

      // 4️⃣ Update local state to display accepted/rejected status
      setInvites((prev) =>
        prev.map((i) =>
          i.id === invite.id
            ? { ...i, status: accepted ? "accepted" : "rejected" }
            : i
        )
      );
    } catch (err) {
      console.error("Error responding to invite:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="600px" mx="auto">
      <Typography variant="h5" gutterBottom>
        Friend Invites
      </Typography>

      {invites.length === 0 ? (
        <Typography>No invites yet.</Typography>
      ) : (
        invites.map((invite) => (
          <Card
            key={invite.id}
            sx={{
              mb: 2,
              p: 1,
              borderLeft:
                invite.status === "accepted"
                  ? "4px solid green"
                  : invite.status === "rejected"
                  ? "4px solid red"
                  : "4px solid transparent",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography variant="body1" gutterBottom>
                  You were invited by{" "}
                  <strong>
                    {invite.fromUserName || invite.fromUserEmail || "Unknown user"}
                  </strong>
                </Typography>

                {invite.status === "pending" ? (
                  <Box display="flex" gap={1} mt={{ xs: 1, sm: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => respondToInvite(invite, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => respondToInvite(invite, false)}
                    >
                      Reject
                    </Button>
                  </Box>
                ) : (
                  <Chip
                    label={
                      invite.status === "accepted"
                        ? "Accepted ✅"
                        : invite.status === "rejected"
                        ? "Rejected ❌"
                        : invite.status === "accepted_notification"
                        ? invite.message
                        : invite.status
                    }
                    color={
                      invite.status === "accepted"
                        ? "success"
                        : invite.status === "rejected"
                        ? "error"
                        : "default"
                    }
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
