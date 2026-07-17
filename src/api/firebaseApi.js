// src/api/firebaseApi.js
import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

async function authHeader() {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not logged in");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Join a community.
// Fixed: was writing to lowercase "communities"/"users", which silently
// orphaned the write since the rest of the app reads "Communities"/"Users".
export const joinCommunity = async (userId, communityId) => {
  const communityRef = doc(db, "Communities", communityId);
  const userRef = doc(db, "Users", userId);

  await updateDoc(communityRef, {
    members: arrayUnion(userId),
  });

  await updateDoc(userRef, {
    communities: arrayUnion(communityId),
  });
};

// Create a community
export const createCommunity = async (communityId, communityData) => {
  const communityRef = doc(db, "Communities", communityId);
  await setDoc(communityRef, communityData);
};

export const createGroup = async (groupName, description, userId) => {
  try {
    const groupRef = await addDoc(collection(db, "Groups"), {
      name: groupName,
      description,
      members: [userId],
      createdAt: serverTimestamp(),
    });
    return groupRef.id;
  } catch (error) {
    console.error("Firestore error creating group:", error);
    throw new Error("Group creation failed");
  }
};

// Join a group.
// Fixed: was calling a relative "/api/groups/join" URL (which doesn't
// resolve against the Flask backend) with no Authorization header, so it
// always failed against the @require_auth-protected route.
export const joinGroup = async (userId, groupId) => {
  const headers = await authHeader();
  const res = await fetch(`${BASE_URL}/api/groups/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ userId, groupId }),
  });
  if (!res.ok) throw new Error("Joining group failed");
  return res.json();
};
