import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "../../firebase/firestoreService";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../AuthContext";
import { NavLink } from "react-router-dom";

export default function NotificationBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const q = query(collection(db, "notifications"), where("user", "==", userRef));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadCount = snapshot.docs.filter((doc) => !doc.data().read).length;
      setCount(unreadCount);
    });

    return () => unsubscribe();
  }, [user]);

  const rolePath = user?.role ? user.role.toLowerCase() : "";

  return (
    <NavLink
      to={`/${rolePath}/notifications`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 15px",
        color: "#004080",
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <FaBell size={20} />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {count}
          </span>
        )}
      </div>
      <span>Notifications</span>
    </NavLink>
  );
}