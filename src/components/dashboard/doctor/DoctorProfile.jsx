import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const { user, logout } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDoctor = async () => {
      try {
        const ref = doc(db, "doctors", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setDoctorData(snap.data());
        } else {
          console.warn("No doctor profile found for this account.");
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [user]);

  if (loading) {
    return (
      <div className="profile-container">
        <h1 className="profile-title">Loading profile...</h1>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="profile-container">
        <h1 className="profile-title">No profile data available.</h1>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h3 className="profile-title">Doctor Profile</h3>
        <hr className="divider" />

        <div className="profile-section">
          <p><strong>Name:</strong> {doctorData.fullName}</p>
          <p><strong>E-mail Address:</strong> {doctorData.email}</p>
          <p><strong>Contact Number:</strong> {doctorData.contactNumber || "N/A"}</p>
          <p>
            <strong>Password:</strong> ********
            <span className="change-password">(Change Password)</span>
          </p>
          <p>
            <strong>Account Creation Date:</strong>{" "}
            {doctorData.createdAt
              ? new Date(doctorData.createdAt.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <hr className="divider" />

        <div className="profile-section">
          <p><strong>Field:</strong> {doctorData.field || "N/A"}</p>
          <p><strong>Hospital Address & Office:</strong> {doctorData.hospitalAddress || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}