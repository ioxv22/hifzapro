import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaFfrVBCUG3JoBnD9vut9s7mHneJ32kOc",
  authDomain: "hifzapro-656de.firebaseapp.com",
  projectId: "hifzapro-656de",
  storageBucket: "hifzapro-656de.firebasestorage.app",
  messagingSenderId: "593662679197",
  appId: "1:593662679197:web:a02d10c4c59f58dc0cdc74",
  measurementId: "G-G5R06V1TKM"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
