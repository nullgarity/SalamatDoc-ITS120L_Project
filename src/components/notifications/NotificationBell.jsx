import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../AuthContext";
import { NavLink } from "react-router-dom";
import "../sidebar.css"; // make sure this is imported for consistent styling

export default function NotificationBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [rolePath, setRolePath] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRolePath(userData.role?.toLowerCase() || "patient");
        } else {
          setRolePath("patient");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRolePath("patient");
      }
    };

    fetchUserRole();

    const userRef = doc(db, "users", user.uid);
    const q = query(collection(db, "notifications"), where("user", "==", userRef));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadCount = snapshot.docs.filter((d) => !d.data().read).length;
      setCount(unreadCount);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NavLink
      to={`/${rolePath}/notifications`}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
        <FaBell size={20} />
        <span>Notifications</span>
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
    </NavLink>
  );
}
