// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnLBqHFVNntu-4rGpdVj2jEMGPjQvbUJA",
  authDomain: "raquimic-2025.firebaseapp.com",
  databaseURL: "https://raquimic-2025-default-rtdb.firebaseio.com",
  projectId: "raquimic-2025",
  storageBucket: "raquimic-2025.firebasestorage.app",
  messagingSenderId: "662737127165",
  appId: "1:662737127165:web:9f92306e4d778b44d12094",
  measurementId: "G-27R4NYN4QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {
  db,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
};
