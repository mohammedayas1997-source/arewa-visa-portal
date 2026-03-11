import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // DOLE ka saka wannan
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY", 
  authDomain: "arewa-visa-portal.firebaseapp.com",
  projectId: "arewa-visa-portal",
  databaseURL: "https://arewa-visa-portal-default-rtdb.firebaseio.com",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69"
};

const app = initializeApp(firebaseConfig);

// EXPORTS
export const firestore = getFirestore(app); // Wannan zai gyara TraceVariable error
export const db = getDatabase(app);        // Na Realtime Database
export const storage = getStorage(app);
export const auth = getAuth(app);