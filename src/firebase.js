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
  databaseURL: "https://arewa-visa-new1-default-rtdb.firebaseio.com" // Tabbatar wannan ya dace da sabon project ɗinka
};

const app = initializeApp(firebaseConfig);

// MUN BAMBANTA SUNAYEN DOMIN KOWANE SHAFIN YA SAMU ABINDA YAKE BUQATA
export const firestore = getFirestore(app); // StaffLogin zai yi amfani da wannan
export const db = getDatabase(app); // Sauran shafukan za su ci gaba da amfani da 'db'
export const storage = getStorage(app);
export const auth = getAuth(app);
