import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Pwede tong palitan ng env files or something
const firebaseConfig = {
  apiKey: "AIzaSyBlI04ySruuL_zJ-n_sBF_q4WOkCp2Grzo",           // Replace this
  authDomain: "YOUR_AUTH_DOMAIN",   // Replace this
  projectId: "YOUR_PROJECT_ID",     // Replace this
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;