import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBouYyVd9xanc9BNvgMhUBj745ufh_h6FQ",
  authDomain: "arewa-visa-new1.firebaseapp.com",
  projectId: "arewa-visa-new1",
  storageBucket: "arewa-visa-new1.firebasestorage.app",
  messagingSenderId: "609831868003",
  appId: "1:609831868003:web:90eaecaa973a147e7d8a56",
  databaseURL: "https://arewa-visa-new1-default-rtdb.firebaseio.com",
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app); // Wannan na Firestore ne
export const rtdb = getDatabase(app); // Wannan na Realtime Database ne
export const storage = getStorage(app);

// 3. Default Export (Optional but safer)
export default app;
