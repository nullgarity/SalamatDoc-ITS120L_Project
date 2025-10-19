// ───────────────────────────────────────────────
//  Firebase Cloud Functions for Notifications
// ───────────────────────────────────────────────

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ───────────────────────────────────────────────
// 1️⃣ Trigger: On appointment creation
// ───────────────────────────────────────────────
exports.sendAppointmentNotification = functions.firestore
  .document("appointments/{appointmentId}")
  .onCreate(async (snapshot, context) => {
    const appointment = snapshot.data();
    const { doctorId, patientId, date, time } = appointment;

    // Create notification content
    const title = "Appointment Set";
    const message = `An appointment has been scheduled on ${date} at ${time}. Check your Appointments page for more details.`;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const notifications = [
      {
        title,
        message,
        recipientId: db.doc(`users/${doctorId}`),
        read: false,
        timestamp,
      },
      {
        title,
        message,
        recipientId: db.doc(`users/${patientId}`),
        read: false,
        timestamp,
      },
    ];

    try {
      const batch = db.batch();
      notifications.forEach((notif) => {
        const ref = db.collection("notifications").doc();
        batch.set(ref, notif);
      });
      await batch.commit();
      console.log("Notifications sent to doctor and patient.");
    } catch (error) {
      console.error("Error sending appointment notifications:", error);
    }
  });

// ───────────────────────────────────────────────
// 2️⃣ Scheduled Cleanup: Delete old notifications
// ───────────────────────────────────────────────
exports.cleanupOldNotifications = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days
    const snapshot = await db
      .collection("notifications")
      .where("timestamp", "<", new Date(cutoff))
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`${snapshot.size} old notifications deleted.`);
    return null;
  });
