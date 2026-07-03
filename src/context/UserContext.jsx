// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app'; // <--- Added getApps, getApp
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Global variables provided by the Canvas environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userDescription, setUserDescription] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const initFirebaseAndAuth = async () => {
      console.log("UserContext: Starting Firebase initialization and auth process...");
      let app;
      try {
        // --- CRITICAL FIX: Check if Firebase app already exists ---
        if (!getApps().length) {
          app = initializeApp(firebaseConfig);
          console.log("UserContext: Firebase app initialized.");
        } else {
          app = getApp(); // Get the already initialized app
          console.log("UserContext: Firebase app already initialized, reusing existing app.");
        }
        // --- END CRITICAL FIX ---

        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          console.log("UserContext: onAuthStateChanged triggered. Current user:", user ? user.uid : "null (no user)");
          
          if (user) {
            const currentUserId = user.uid;
            setUserId(currentUserId);
            console.log("UserContext: userId state updated to:", currentUserId);

            const userDocRef = doc(firestoreDb, `Surveys`, currentUserId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserName(userData.name || `User ${currentUserId.substring(0, 4)}`);
              setUserDescription(userData.description || 'No description provided.');
              console.log("UserContext: Fetched user profile:", userData.name, userData.description);
            } else {
              const defaultName = `User-${currentUserId.substring(0, 4)}`;
              const defaultDescription = 'New user profile.';
              await setDoc(userDocRef, {
                userId: currentUserId,
                name: defaultName,
                description: defaultDescription,
                createdAt: new Date().toISOString()
              }, { merge: true });
              setUserName(defaultName);
              setUserDescription(defaultDescription);
              console.log("UserContext: Created default user profile for new user:", defaultName);
            }
          } else {
            setUserId(null);
            setUserName(null);
            setUserDescription(null);
            console.log("UserContext: No user signed in.");
          }
          setIsAuthReady(true);
          console.log("UserContext: isAuthReady set to true.");
        });

        if (initialAuthToken) {
          console.log("UserContext: Attempting sign-in with custom token...");
          await signInWithCustomToken(firebaseAuth, initialAuthToken);
          console.log("UserContext: Custom token sign-in initiated.");
        } else {
          console.log("UserContext: Attempting anonymous sign-in...");
          await signInAnonymously(firebaseAuth);
          console.log("UserContext: Anonymous sign-in initiated.");
        }
        

        return () => unsubscribe();
      } catch (error) {
        console.error("UserContext: Error during Firebase initialization or sign-in:", error);
        setIsAuthReady(true);
        console.log("UserContext: isAuthReady set to true due to initialization error.");
      }
    };

    initFirebaseAndAuth();
  }, []);

  const contextValue = {
    userId,
    userName,
    userDescription,
    isAuthReady,
    db,
    auth,
    setUserName,
    setUserDescription,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
export {UserContext };
