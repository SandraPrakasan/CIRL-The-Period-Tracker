import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAY1Syl6GXpT9kkV77GDsd9C_wKJtLJiYA",
  authDomain: "period-tracker-96375.firebaseapp.com",
  databaseURL: "https://period-tracker-96375-default-rtdb.firebaseio.com",
  projectId: "period-tracker-96375",
  storageBucket: "period-tracker-96375.firebasestorage.app",
  messagingSenderId: "1068190988034",
  appId: "1:1068190988034:web:b9963cbaa86fdd3d63b41b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth, getAuth};
