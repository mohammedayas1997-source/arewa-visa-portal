import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";           
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBouYyVd9xanc9BNvgMhUBj745ufh_h6FQ",
  authDomain: "arewa-visa-new1.firebaseapp.com",
  projectId: "arewa-visa-new1",
  storageBucket: "arewa-visa-new1.firebasestorage.app",
  messagingSenderId: "609831868003",
  appId: "1:609831868003:web:90eaecaa973a147e7d8a56",
  measurementId: "G-MD8K7541V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Muna fitar da su (Export) domin login ya yi aiki
export const db = getFirestore(app); 
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;