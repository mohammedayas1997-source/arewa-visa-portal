import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY",
  authDomain: "arewa-visa-portal.firebaseapp.com",
  databaseURL: "https://arewa-visa-portal-default-rtdb.firebaseio.com",
  projectId: "arewa-visa-portal",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69",
};

const app = initializeApp(firebaseConfig);

// WADANNAN SUNE MASU MUHIMMANCI GA LOGIN
export const db = getFirestore(app);
export const auth = getAuth(app);
