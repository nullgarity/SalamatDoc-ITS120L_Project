import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      setPatients(patientsData);

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
      setAppointments(appointmentsData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  // Collect appointment dates for highlighting
  const appointmentDates = appointments
    .filter(a => a.dateTime)
    .map((a) => a.dateTime.toDateString());

  // Filter appointments for selected day
  const appointmentsForSelectedDay = appointments.filter(
    (a) => a.dateTime && a.dateTime.toDateString() === selectedDate.toDateString()
  );

  // Helper to get patient full name
  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return "Unknown";
    return `${patient.first_name || patient.firstName || ""} ${patient.last_name || patient.lastName || ""}`.trim();
  };

  return (
    <div className="dashboard-container">
      {/* Row 1: Patient Overview */}
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
                    <td>{getPatientName(p.id)}</td>
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
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={({ date, view }) =>
              view === "month" && appointmentDates.includes(date.toDateString())
                ? "highlight-appointment"
                : null
            }
          />

          {/* Appointments for selected day */}
          {appointmentsForSelectedDay.length > 0 ? (
            <div className="appointments-list">
              <h3>Appointments on {selectedDate.toDateString()}:</h3>
              <ul>
                {appointmentsForSelectedDay.map((a) => (
                  <li key={a.id}>
                    {a.type || "Checkup"} with {getPatientName(a.patientID)} {" "}
                    ({a.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No appointments on this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
