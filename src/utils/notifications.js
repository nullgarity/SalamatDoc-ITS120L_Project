import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/**
 * Send a new notification to a specific user (using Firestore reference).
 * @param {string} userId - The UID of the target user.
 * @param {string} message - The notification message.
 * @param {string} [type="info"] - Type/category of notification.
 */
export const sendNotification = async (userId, message, type = "info") => {
  try {
    const userRef = doc(db, "users", userId);
    await addDoc(collection(db, "notifications"), {
      user: userRef,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

/**
 * Mark a specific notification as read.
 * @param {string} notificationId - Firestore document ID.
 */
export const markAsRead = async (notificationId) => {
  try {
    const notifRef = doc(db, "notifications", notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (error) {
    console.error("Error marking as read:", error);
  }
};

/**
 * Mark all notifications for a user as read.
 * @param {string} userId - Target user UID.
 */
export const markAllAsRead = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const q = query(collection(db, "notifications"), where("user", "==", userRef));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      await updateDoc(docSnap.ref, { read: true });
    }
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

/**
 * Fetch all notifications for a user.
 * @param {string} userId - Target user UID.
 * @returns {Array} notifications
 */
export const getNotifications = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const q = query(collection(db, "notifications"), where("user", "==", userRef));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};