import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../dashboard.css";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(data.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    const ref = doc(db, "notifications", id);
    await updateDoc(ref, { read: true });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-muted">No notifications yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {notifications.map((n) => (
              <li
                key={n.id}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: n.read ? "#f5f5f5" : "#e8f6ee",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-bold">{n.message}</p>
                <small className="text-muted">
                  {n.timestamp?.toDate().toLocaleString()}
                </small>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="secondary-button"
                    style={{ marginTop: "0.5rem" }}
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}