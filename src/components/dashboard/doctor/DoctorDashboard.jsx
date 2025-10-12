import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import "./DoctorDashboard.css";

/**
 * Validate and convert Firestore date fields
 * @param {any} dateField
 * @returns {Date | null}
 */
function validateAndConvertDate(dateField) {
  if (!dateField) return null;
  if (dateField instanceof Timestamp) return dateField.toDate();
  const parsed = new Date(dateField);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No logged-in doctor found.");
      return;
    }

    const doctorID = user.uid;

    // Fetch patients
    const userSnapshot = await getDocs(collection(db, "users"));
    const patientsData = userSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.role === "patient");

    // Fetch appointments
    const appointmentSnapshot = await getDocs(collection(db, "appointments"));
    const appointmentsData = appointmentSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          doctorID: data.doctorID?.trim() || "",
          patientID: data.patientID?.trim() || "",
          type: data.type || "",
          location: data.location || "",
          reason: data.reason || "",
          notes: data.notes || "N/A",
          dateTime: validateAndConvertDate(data.dateTime),
        };
      })
      .filter((appt) => appt.doctorID === doctorID); // ✅ Filter by current doctor

    setPatients(patientsData);
    setAppointments(appointmentsData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
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
          {appointments.length > 0 ? (
            <ul>
              {appointments.slice(0, 5).map((appt) => (
                <li key={appt.id}>
                  <strong>{appt.type}</strong> —{" "}
                  {appt.dateTime
                    ? appt.dateTime.toLocaleString()
                    : "Invalid Date"}
                  <br />
                  <span>
                    Reason: {appt.reason} <br />
                    Location: {appt.location}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments</p>
          )}
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

      {/* All Patients */}
      <div className="dashboard-card">
        <h2>All Patients</h2>
        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              {p.first_name} {p.last_name} — {p.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
