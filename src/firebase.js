import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // MUHIMMI: Mun canza zuwa Firestore
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY",
  authDomain: "arewa-visa-portal.firebaseapp.com",
  projectId: "arewa-visa-portal",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORTS
export const db = getFirestore(app); // Wannan shine zai ba ka damar kiran 'doc()' ba tare da error ba
export const storage = getStorage(app);
export const auth = getAuth(app);
