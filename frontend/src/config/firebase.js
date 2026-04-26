import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Use environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCV2JI-S1oA7JwmlzcFX39nLCjbt_X3mDo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "voteredgeai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "voteredgeai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "voteredgeai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "53160276245",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:53160276245:web:020a530fcdc9c1bda2f91c",
};

const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();