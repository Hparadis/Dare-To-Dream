import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCMXmbZvL11F305yiPWOzm45vOWrY3tTYk",
    authDomain: "dare-to-dream-9c136.firebaseapp.com",
    projectId: "dare-to-dream-9c136",
    storageBucket: "dare-to-dream-9c136.firebasestorage.app",
    messagingSenderId: "277549748441",
    appId: "1:277549748441:web:9da210ead397604479aec8",
    measurementId: "G-9CZZ7H3WVN"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword , storage, ref, uploadBytes, getDownloadURL,db };
