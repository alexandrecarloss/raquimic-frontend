// Importações básicas
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firestore
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

// Realtime Database
import { getDatabase } from "firebase/database";

// Auth (para login anônimo)
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";

// Config padrão Firebase
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

// Inicialização
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Firestore
const db = getFirestore(app);

// Realtime DB
const rtdb = getDatabase(app);

// Auth
const auth = getAuth(app);

// 🔥 LOGIN ANÔNIMO AUTOMÁTICO
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch((err) => {
      console.error("Erro no login anônimo:", err);
    });
  }
});

// Exportações
export {
  db,              // Firestore
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,

  rtdb,            // Realtime Database
  auth             // auth opcional para uso futuro
};
