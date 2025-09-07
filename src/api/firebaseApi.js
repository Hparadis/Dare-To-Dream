// src/api/firebaseApi.js

import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";



// Join a community
export const joinCommunity = async (userId, communityId) => {
  const communityRef = doc(db, "communities", communityId);
  const userRef = doc(db, "users", userId);

  await updateDoc(communityRef, {
    members: arrayUnion(userId),
  });

  await updateDoc(userRef, {
    communities: arrayUnion(communityId),
  });
};


// Create a community
export const createCommunity = async (communityId, communityData) => {
  const communityRef = doc(db, "communities", communityId);
  await setDoc(communityRef, communityData);
};
export const createGroup = async (groupName, description, userId) => {
  try {
    const groupRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      description,
      members: [userId],
      createdAt: serverTimestamp(),
    });
    console.log("Group created in Firestore:", groupRef.id);
    return groupRef.id;
  } catch (error) {
    console.error("Firestore error creating group:", error);
    throw new Error("Group creation failed");
  }
};


export const joinGroup = async (userId, groupId) => {
  const res = await fetch('/api/groups/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, groupId })
  });
  if (!res.ok) throw new Error('Joining group failed');
  return res.json();
};

