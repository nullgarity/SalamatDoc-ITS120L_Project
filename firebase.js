// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase Authentication
export const auth = getAuth(app);