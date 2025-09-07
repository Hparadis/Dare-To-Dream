// src/hooks/useSyncUserProfile.js

import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

export default function useSyncUserProfile() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        await setDoc(
          userDocRef,
          {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Anonymous",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    return () => unsubscribe();
  }, []);
}
