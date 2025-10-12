import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../../components/AuthContext";
import "./DoctorAppointments.css";

/**
 * Safely parse Firestore timestamps or strings.
 */
function parseDateTime(dateValue) {
  if (!dateValue) return null;
  if (dateValue instanceof Timestamp) return dateValue.toDate();
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amPm, setAmPm] = useState("AM");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchAppointments(user.uid.trim());
      fetchPatients();
    } else {
      console.warn("User UID not available yet.");
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async (doctorID) => {
    try {
      const snapshot = await getDocs(collection(db, "appointments"));

      const data = await Promise.all(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((appt) => appt.doctorID?.trim() === doctorID)
          .map(async (appt) => {
            let patientName = "Unknown";
            if (appt.patientID) {
              try {
                const patientDoc = await getDoc(doc(db, "users", appt.patientID));
                if (patientDoc.exists()) {
                  const { firstName, lastName } = patientDoc.data();
                  patientName = `${firstName || ""} ${lastName || ""}`.trim();
                }
              } catch (err) {
                console.error("Error fetching patient:", err);
              }
            }
            return { ...appt, patientName };
          })
      );

      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.role === "patient");
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !date || !time) return alert("Fill all fields");

    setSubmitting(true);
    try {
      // Convert date + time to JS Date
      const [year, month, day] = date.split("-"); // yyyy-mm-dd
      let [hours, minutes] = time.split(":").map(Number);
      if (amPm === "PM" && hours < 12) hours += 12;
      if (amPm === "AM" && hours === 12) hours = 0;
      const dateTime = new Date(year, month - 1, day, hours, minutes);

      await addDoc(collection(db, "appointments"), {
        doctorID: user.uid,
        patientID: selectedPatient,
        dateTime: Timestamp.fromDate(dateTime),
        type: "",
        reason: "",
        location: "",
        notes: "",
      });

      // Refresh appointments
      fetchAppointments(user.uid);
      setSelectedPatient("");
      setDate("");
      setTime("");
      setAmPm("AM");
    } catch (err) {
      console.error("Error adding appointment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading">Loading appointments...</p>;

  return (
    <div className="dashboard-container">
      {/* Appointments Table */}
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
                const dateObj = parseDateTime(appt.dateTime);
                return (
                  <tr key={appt.id}>
                    <td>{dateObj ? dateObj.toLocaleString() : "Invalid Date"}</td>
                    <td>{appt.type || "—"}</td>
                    <td>{appt.reason || "—"}</td>
                    <td>{appt.location || "—"}</td>
                    <td>{appt.patientName}</td>
                    <td>{appt.notes || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Appointment Form */}
      <div className="dashboard-card add-appointment" style={{ marginTop: "20px" }}>
        <h3>Add Appointment</h3>
        <form className="add-appointment-form" onSubmit={handleAddAppointment}>
          {/* Row 1: Select Patient */}
          <div>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Date */}
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Row 3: Time + AM/PM + Submit */}
          <div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <select value={amPm} onChange={(e) => setAmPm(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
