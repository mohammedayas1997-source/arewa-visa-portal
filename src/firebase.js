import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Ka tabbatar wannan API Key din shine yake a Firebase Console dinka yanzu
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY", 
  authDomain: "arewa-visa-portal.firebaseapp.com",
  projectId: "arewa-visa-portal",
  // Tabbatar databaseURL dinka babu kuskure ko space
  databaseURL: "https://arewa-visa-portal-default-rtdb.firebaseio.com",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // Wannan yana da muhimmanci ga Login