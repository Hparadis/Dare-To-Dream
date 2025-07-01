import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";

// Join a group
export const joinGroup = async (userId, groupId) => {
  const groupRef = doc(db, "groups", groupId);
  const userRef = doc(db, "users", userId);

  await updateDoc(groupRef, {
    members: arrayUnion(userId),
  });

  await updateDoc(userRef, {
    groups: arrayUnion(groupId),
  });
};

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

// Create a group
export const createGroup = async (groupId, groupData) => {
  const groupRef = doc(db, "groups", groupId);
  await setDoc(groupRef, groupData);
};

// Create a community
export const createCommunity = async (communityId, communityData) => {
  const communityRef = doc(db, "communities", communityId);
  await setDoc(communityRef, communityData);
};
