// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlI04ySruuL_zJ-n_sBF_q4WOkCp2Grzo",
  authDomain: "salamatdoc-its120l-project.firebaseapp.com",
  projectId: "salamatdoc-its120l-project",
  storageBucket: "salamatdoc-its120l-project.firebasestorage.app",
  messagingSenderId: "793384134765",
  appId: "1:793384134765:web:01c5d9920619818d6db764"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
