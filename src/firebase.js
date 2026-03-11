import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY",
  authDomain: "arewa-visa-portal.firebaseapp.com",
  databaseURL: "https://arewa-visa-portal-default-rtdb.firebaseio.com",
  projectId: "arewa-visa-portal",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69",
  measurementId: "G-SM420F35JW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORTS - Wadannan sune "Engine" din da zasu sa code dinka yayi aiki
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Na Roles/Login (Firestore)
export const db = getDatabase(app);        // Na Form/Portal (Realtime DB)
export const storage = getStorage(app);

export default app;