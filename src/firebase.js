import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBouYyVd9xanc9BNvgMhUBj745ufh_h6FQ",
  authDomain: "arewa-visa-new1.firebaseapp.com",
  projectId: "arewa-visa-new1",
  storageBucket: "arewa-visa-new1.firebasestorage.app",
  messagingSenderId: "609831868003",
  appId: "1:609831868003:web:90eaecaa973a147e7d8a56",
  measurementId: "G-MD8K7541V3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app); // This fixes the "doc(db...)" error
export const rtdb = getDatabase(app); // This fixes the Realtime Database error
export const storage = getStorage(app); // For file uploads
