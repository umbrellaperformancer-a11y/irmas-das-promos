import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4bYBJQOVAO7MTh6fkmw8sFY_mHA61OMc",
  authDomain: "irmaspromo-dcf67.firebaseapp.com",
  projectId: "irmaspromo-dcf67",
  storageBucket: "irmaspromo-dcf67.firebasestorage.app",
  messagingSenderId: "1010377024045",
  appId: "1:1010377024045:web:ce2404068a7079a4c58ea4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

