import React, { useEffect, useState } from "react";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../AuthContext";
import "./PatientAppointments.css";

export default function PatientAppointments() {
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Find appointment for the logged-in patient
        const patientRef = doc(db, "patients", user.uid);
        const q = query(collection(db, "appointments"), where("patient", "==", patientRef));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const apptData = snapshot.docs[0].data();
          setAppointment(apptData);

          // Fetch the assigned doctor info
          const doctorSnap = await getDoc(apptData.doctor);
          if (doctorSnap.exists()) setDoctor(doctorSnap.data());
        }
      } catch (err) {
        console.error("Error loading appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) fetchAppointment();
  }, [user]);

  if (loading) return <div className="appointment-loading">Loading...</div>;

  if (!appointment || !doctor) {
    return (
      <div className="appointment-container">
        <h2>No upcoming appointments found.</h2>
      </div>
    );
  }

  const date = appointment.date_time.toDate().toLocaleDateString();
  const time = appointment.date_time.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="appointment-container">
      <h1>Appointments</h1>

      <div className="appointment-card">
        <h2>Assigned Doctor</h2>
        <p>
          <strong>Dr. {doctor.user_fullname}</strong>
        </p>
        <p>
          <strong>Field:</strong> {doctor.medical_field}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Contact Number:</strong> {doctor.office_contact_no}
        </p>
        <p>
          <strong>Hospital Address & Office:</strong> {doctor.place_employment}, Room {doctor.office_room_no}, {doctor.address}
        </p>

        <hr className="appointment-divider" />

        <h2>Upcoming Appointment Details</h2>
        <p>
          <strong>Time:</strong> {time}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Location:</strong> {appointment.location}
        </p>

        <p className="appointment-note">
          To reschedule, please contact your assigned doctor.
        </p>
      </div>
    </div>
  );
}