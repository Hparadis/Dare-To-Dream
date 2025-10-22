// src/authHelpers.js
import { auth } from "./config/firebase";

export async function getToken() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch (err) {
          reject(err);
        } finally {
          unsubscribe();
        }
      } else {
        reject(new Error("User not logged in"));
        unsubscribe();
      }
    });
  });
}
