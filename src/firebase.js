import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1miiQVdgce8GFDhvD5v03kf9Pbz_rqlY",
  authDomain: "arewa-visa-portal.firebaseapp.com",
  projectId: "arewa-visa-portal",
  databaseURL: "https://arewa-visa-portal-default-rtdb.firebaseio.com",
  storageBucket: "arewa-visa-portal.firebasestorage.app",
  messagingSenderId: "230984227020",
  appId: "1:230984227020:web:4778678a0f6252fae98a69",
};

const app = initializeApp(firebaseConfig);

// 2. Export Services (Standard & Clean Method)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Line 25 was deleted because it was a duplicate export
export default app;
