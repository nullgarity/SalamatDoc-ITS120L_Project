import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./dashboard.css";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setProfile(userDoc.data());
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1>Patient Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h2>Good Morning, {profile?.name || "User"}!</h2>
          <p>You are on a {profile?.streak || 0}-day streak!</p>
        </div>

        <div className="dashboard-card">
          <h2>Notifications</h2>
          <ul>
            <li>Your morning medication is almost due</li>
            <li>You missed your medicine yesterday</li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h2>Calendar</h2>
          <p>[Insert Calendar Component Here]</p>
        </div>

        <div className="dashboard-card">
          <h2>Checklist</h2>
          <ul>
            <li>Medicine</li>
            <li>Food</li>
          </ul>
        </div>
      </div>
    </div>
  );
}