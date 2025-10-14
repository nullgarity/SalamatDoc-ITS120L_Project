import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile once user is authenticated
  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        console.warn("User document not found.");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="patient-dashboard">
      <br />
      <br />
      <br />
      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-card">
          <h2>Good Morning, {profile?.name || "User"}!</h2>
          <p>You are on a {profile?.streak || 0}-day streak!</p>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <h2>Notifications</h2>
          <ul>
            <li>Your morning medication is almost due</li>
            <li>You missed your medicine yesterday</li>
          </ul>
        </div>

        {/* Calendar */}
        <div className="dashboard-card">
          <h2>Calendar</h2>
          <p>[Calendar Component will go here]</p>
        </div>

        {/* Checklist */}
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
