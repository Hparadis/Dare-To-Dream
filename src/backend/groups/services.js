// src/backend/groups/services.js
import { db } from "../../config/firebase"; // your firebase config
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";

export const addGroupActivity = async (groupId, text, createdBy, memberIds) => {
  try {
    // Add activity to the group
    const activityRef = await addDoc(collection(db, "Groups", groupId, "activities"), {
      text,
      createdBy,
      createdAt: serverTimestamp(),
      participants: [],
    });

    // Add notifications for all members
    const notificationsRef = collection(db, "Groups", groupId, "notifications");
    await Promise.all(
      memberIds.map(async (uid) => {
        await addDoc(notificationsRef, {
          type: "activity",
          text: `New group activity: "${text}"`,
          createdAt: serverTimestamp(),
          recipientIds: [uid],
          activityId: activityRef.id,
        });
      })
    );

    return { id: activityRef.id, text, createdBy };
  } catch (err) {
    console.error("Error adding activity:", err);
    throw err;
  }
};
