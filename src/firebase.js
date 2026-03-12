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

// EXPORTS - Gyaran da muka yi a nan zai sa Application Form ya shiga Firestore kai tsaye
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Wannan shi zai karbi komai na Firestore (Login + Applications)
export const db = getDatabase(app);        // Wannan na Settings ne kawai
export const storage = getStorage(app);

export default app;