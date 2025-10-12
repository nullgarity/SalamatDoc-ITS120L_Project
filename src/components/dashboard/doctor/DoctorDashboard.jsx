import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import "./DoctorDashboard.css";

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
      if (!user) return;
      const doctorID = user.uid;

      // Fetch patients
      const userSnapshot = await getDocs(collection(db, "users"));
      const patientsData = userSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.role === "patient");

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
            prescribedMeds: data.prescribedMeds || [],
          };
        })
        .filter((appt) => appt.doctorID === doctorID);

      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      {/* Row 1: Patient count */}
      <div className="dashboard-row">
        <div className="dashboard-card overview-card">
          <h2>Patient Overview</h2>
          <p>Active Patients: {patients.length}</p>
          <p>Pending Checkups: {Math.floor(patients.length / 4)}</p>
        </div>
      </div>

      {/* Row 2: Patient Table */}
      <div className="dashboard-row">
        <div className="dashboard-card patient-table-card">
          <h2>Patients</h2>
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointments</th>
                <th>Prescribed Meds</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const patientAppointments = appointments
                  .filter((a) => a.patientID === p.id)
                  .map((a) =>
                    a.dateTime ? a.dateTime.toLocaleDateString() : "N/A"
                  )
                  .join(", ");

                const meds = appointments
                  .filter((a) => a.patientID === p.id)
                  .flatMap((a) => a.prescribedMeds)
                  .join(", ") || "None";

                return (
                  <tr key={p.id}>
                    <td>{p.first_name} {p.last_name}</td>
                    <td>{patientAppointments || "No appointments"}</td>
                    <td>{meds}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Appointment Calendar */}
      <div className="dashboard-row">
        <div className="dashboard-card calendar-card">
          <h2>Appointment Calendar</h2>
          {/* Placeholder for calendar */}
          <p>Calendar component can go here.</p>
        </div>
      </div>
    </div>
  );
}