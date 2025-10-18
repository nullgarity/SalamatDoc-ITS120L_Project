// src/utils/notifications.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// ✅ Ask permission for desktop notifications
export async function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
}

// ✅ Show desktop notification
export function showDesktopNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
}

// ✅ Subscribe to Firestore notifications
export function subscribeToNotifications(userId, callback) {
  const q = query(collection(db, "notifications"), where("recipientId", "==", userId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const newNotifications = [];
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        newNotifications.push({ id: change.doc.id, ...data });
        showDesktopNotification(data.title || "New Notification", data.message || "");
      }
    });
    if (newNotifications.length > 0) callback(newNotifications);
  });
  return unsubscribe;
}