import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  getFirestore,
} from "firebase/firestore";

// 🔑 Make sure these are spelled EXACTLY the same in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,   // ✅ fixed spelling
};

// Init app
const app = initializeApp(firebaseConfig);

// 🔄  Force long‑polling to avoid 400 Listen errors during development
initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Services
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Re‑export helpers you use elsewhere
export {
  app, 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
};
