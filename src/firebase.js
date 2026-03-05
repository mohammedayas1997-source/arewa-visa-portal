import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getDatabase } from "firebase/database";   // Realtime Database (Muka kara)
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBouYyVd9xanc9BNvgMhUBj745ufh_h6FQ",
  authDomain: "arewa-visa-new1.firebaseapp.com",
  projectId: "arewa-visa-new1",
  storageBucket: "arewa-visa-new1.firebasestorage.app",
  messagingSenderId: "609831868003",
  appId: "1:609831868003:web:90eaecaa973a147e7d8a56",
  databaseURL: "https://arewa-visa-new1-default-rtdb.firebaseio.com" // Tabbatar wannan ya dace da Console dinka
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);       // Don amfanin users, roles, etc.
export const rtdb = getDatabase(app);     // Don amfanin Chat ko Realtime features
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;