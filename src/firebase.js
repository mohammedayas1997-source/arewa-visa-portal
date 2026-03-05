import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBouYyVd9xanc9BNvgMhUBj745ufh_h6FQ",
  authDomain: "arewa-visa-new1.firebaseapp.com",
  projectId: "arewa-visa-new1",
  storageBucket: "arewa-visa-new1.firebasestorage.app",
  messagingSenderId: "609831868003",
  appId: "1:609831868003:web:90eaecaa973a147e7d8a56",
  databaseURL: "https://arewa-visa-new1-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);

// GYARA NA KWARAI:
// Muna amfani da 'db' don Firestore domin shi ne dukkan sauran files din suke nema
export const db = getFirestore(app); 

// Muna amfani da 'rtdb' don Realtime Database (domin kada su rikice)
export const rtdb = getDatabase(app); 

export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;