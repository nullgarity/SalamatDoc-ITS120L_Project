// src/services/firestoreService.js
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();
const usersCollection = collection(db, "users");

/**
 * Register a new user (creates Firebase Auth account + Firestore profile)
 */
export const registerUser = async (email, password, extraData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Store profile in Firestore (with UID as doc ID)
    const userDoc = {
      ...extraData,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "active",
    };

    await setDoc(doc(db, "users", uid), userDoc);

    return { success: true, uid, user: userCredential.user };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(); // Firebase ID Token (JWT)
    return { success: true, token, user: userCredential.user };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("authToken");
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Get current logged in user from Firebase Auth
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get user profile from Firestore by UID
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};