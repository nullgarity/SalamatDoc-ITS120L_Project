import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./dashboard.css";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const patientsData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "patient");
      setPatients(patientsData);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1>Doctor Dashboard</h1>

      <div className="dashboard-grid">
        {/* Patient Overview */}
        <div className="dashboard-card">
          <h2>Patient Overview</h2>
          <p>Active Patients: {patients.length}</p>
          <p>Pending Checkups: {Math.floor(patients.length / 4)}</p>
        </div>

        {/* Appointments */}
        <div className="dashboard-card">
          <h2>Appointments</h2>
          <ul>
            <li>10:00 AM - John Doe</li>
            <li>11:30 AM - Jane Smith</li>
            <li>2:00 PM - Mark Johnson</li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <ul>
            <li>Prescription sent to Mary</li>
            <li>Updated records for Alex</li>
          </ul>
        </div>
      </div>

      <div className="dashboard-divider" />

      {/* Additional dynamic section */}
      <div className="dashboard-card">
        <h2>All Patients</h2>
        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              {p.name || p.email} — {p.status || "Active"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}