import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB-H4NnL2DCSByPEcG8oiCC0BDdN6nM3c",
  authDomain: "blacklisttabasco.firebaseapp.com",
  projectId: "blacklisttabasco",
  storageBucket: "blacklisttabasco.firebasestorage.app",
  messagingSenderId: "1093851271967",
  appId: "1:1093851271967:web:46becb04a4052432a5d62a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };