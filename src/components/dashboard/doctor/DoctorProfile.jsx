import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
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

  if (loading) return <div>Loading profile...</div>;
  if (!doctorData) return <div>No profile data available.</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          Salamat<span>Doc</span>
        </h2>
        <nav>
          <a href="/dashboard" className="active">Dashboard</a>
          <a href="/patients">Patients</a>
          <a href="/appointments">Appointments</a>
          <a href="/profile">Profile</a>
        </nav>
        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        <div className="profile-card">
          <h3>Profile</h3>
          <hr />
          <p><strong>Name:</strong> {doctorData.fullName}</p>
          <p><strong>E-mail Address:</strong> {doctorData.email}</p>
          <p><strong>Contact Number:</strong> {doctorData.contactNumber || "N/A"}</p>
          <p>
            <strong>Password:</strong> ****** <a href="/change-password">(Change Password)</a>
          </p>
          <p>
            <strong>Account Creation Date:</strong>{" "}
            {doctorData.createdAt ? new Date(doctorData.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
          </p>

          <br />
          <p><strong>Field:</strong> {doctorData.field || "N/A"}</p>
          <p><strong>Hospital Address & Office:</strong> {doctorData.hospitalAddress || "N/A"}</p>
        </div>
      </main>
    </div>
  );
}