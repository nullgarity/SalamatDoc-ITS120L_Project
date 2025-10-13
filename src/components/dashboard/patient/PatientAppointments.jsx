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
        // Reference to patient document
        const patientRef = doc(db, "users", user.uid);

        // Query appointments where this patient is referenced
        const q = query(collection(db, "appointments"), where("patientId", "==", patientRef)); // ✅ updated key
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Get first appointment found (or you can map all of them later)
          const apptDoc = snapshot.docs[0];
          const apptData = { id: apptDoc.id, ...apptDoc.data() };
          setAppointment(apptData);

          // Fetch doctor info from Firestore reference
          if (apptData.doctorId) { // ✅ updated key
            const doctorSnap = await getDoc(apptData.doctorId); // ✅ handle as reference
            if (doctorSnap.exists()) {
              setDoctor({ id: doctorSnap.id, ...doctorSnap.data() });
            }
          }
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

  // Safely handle Firestore Timestamp
  const date = appointment.dateTime?.toDate?.().toLocaleDateString?.() || "N/A";
  const time =
    appointment.dateTime?.toDate?.().toLocaleTimeString?.([], {
      hour: "2-digit",
      minute: "2-digit",
    }) || "N/A";

  return (
    <div className="appointment-container">
      <h1>Appointments</h1>

      <div className="appointment-card">
        <h2>Assigned Doctor</h2>
        <p>
          <strong>Dr. {doctor.fullName || `${doctor.firstName || ""} ${doctor.lastName || ""}`}</strong>
        </p>
        <p>
          <strong>Field:</strong> {doctor.medicalField || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email || "N/A"}
        </p>
        <p>
          <strong>Contact Number:</strong> {doctor.officeContactNo || "N/A"}
        </p>
        <p>
          <strong>Hospital Address & Office:</strong>{" "}
          {doctor.placeOfEmployment || "N/A"}, Room {doctor.officeRoomNo || "N/A"},{" "}
          {doctor.officeAddress || "N/A"}
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
          <strong>Location:</strong> {appointment.location || "N/A"}
        </p>
        <p>
          <strong>Type:</strong> {appointment.type || "N/A"}
        </p>
        <p>
          <strong>Reason:</strong> {appointment.reason || "N/A"}
        </p>

        <p className="appointment-note">
          To reschedule, please contact your assigned doctor.
        </p>
      </div>
    </div>
  );
}
