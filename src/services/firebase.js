import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        "lojaanna-a1913.firebaseapp.com",
  databaseURL:       "https://lojaanna-a1913-default-rtdb.firebaseio.com",
  projectId:         "lojaanna-a1913",
  storageBucket:     "lojaanna-a1913.firebasestorage.app",
  messagingSenderId: "1092396476522",
  appId:             "1:1092396476522:web:352b8570b4050ef9c08213",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
