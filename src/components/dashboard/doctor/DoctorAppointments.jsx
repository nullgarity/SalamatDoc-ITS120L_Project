import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../../components/AuthContext";
import "../../dashboard.css";

/**
 * Safely parse Firestore timestamps or strings.
 */
function parseDateTime(dateValue) {
  if (!dateValue) return null;

  if (dateValue instanceof Timestamp) {
    return dateValue.toDate();
  }

  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export default function DoctorAppointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchAppointments(user.uid.trim());
    } else {
      console.warn("User UID not available yet.");
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async (doctorID) => {
    console.log("Fetching appointments for doctor:", doctorID);
    try {
      const snapshot = await getDocs(collection(db, "appointments"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((appt) => appt.doctorID?.trim() === doctorID);

      console.log("Fetched appointments:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      console.log("Finished fetching appointments — setting loading to false.");
      setLoading(false);
    }
  };


  if (loading) return <p className="loading">Loading appointments...</p>;

  return (
    <div className="dashboard-container">
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <div className="dashboard-card">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Location</th>
                <th>Patient</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const date = parseDateTime(appt.dateTime);
                return (
                  <tr key={appt.id}>
                    <td>{date ? date.toLocaleString() : "Invalid Date"}</td>
                    <td>{appt.type || "—"}</td>
                    <td>{appt.reason || "—"}</td>
                    <td>{appt.location || "—"}</td>
                    <td>
                      {appt.patientID?.replace("patients/", "") || "Unknown"}
                    </td>
                    <td>{appt.notes || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
