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
        const patientRef = doc(db, "users", user.uid);
        const q = query(collection(db, "appointments"), where("patientId", "==", patientRef));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const apptDoc = snapshot.docs[0];
          const apptData = { id: apptDoc.id, ...apptDoc.data() };
          setAppointment(apptData);

          if (apptData.doctorId) {
            const doctorSnap = await getDoc(apptData.doctorId);
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

  if (loading)
    return <div className="dashboard-container"><h2 className="dashboard-title">Loading...</h2></div>;

  if (!appointment || !doctor) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-title">No upcoming appointments found.</h2>
        </div>
      </div>
    );
  }

  const date = appointment.dateTime?.toDate?.().toLocaleDateString?.() || "N/A";
  const time =
    appointment.dateTime?.toDate?.().toLocaleTimeString?.([], {
      hour: "2-digit",
      minute: "2-digit",
    }) || "N/A";

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Appointments</h1>

          <div className="appointment-section">
            <h3 className="section-title">Assigned Doctor</h3>
            <p className="dashboard-text">
              <strong>Dr. {doctor.fullName || `${doctor.firstName || ""} ${doctor.lastName || ""}`}</strong>
            </p>
            <p className="dashboard-text">
              <strong>Field:</strong> {doctor.medicalField || "N/A"}
            </p>
            <p className="dashboard-text">
              <strong>Email:</strong> {doctor.email || "N/A"}
            </p>
            <p className="dashboard-text">
              <strong>Contact Number:</strong> {doctor.officeContactNo || "N/A"}
            </p>
            <p className="dashboard-text">
              <strong>Hospital Address & Office:</strong>{" "}
              {doctor.placeOfEmployment || "N/A"}, Room {doctor.officeRoomNo || "N/A"},{" "}
              {doctor.officeAddress || "N/A"}
            </p>
          </div>

          <hr className="divider" />

          <div className="appointment-section">
            <h3 className="section-title">Upcoming Appointment Details</h3>
            <p className="dashboard-text">
              <strong>Time:</strong> {time}
            </p>
            <p className="dashboard-text">
              <strong>Date:</strong> {date}
            </p>
            <p className="dashboard-text">
              <strong>Location:</strong> {appointment.location || "N/A"}
            </p>
            <p className="dashboard-text">
              <strong>Type:</strong> {appointment.type || "N/A"}
            </p>
            <p className="dashboard-text">
              <strong>Reason:</strong> {appointment.reason || "N/A"}
            </p>
            <p className="dashboard-text appointment-note">
              To reschedule, please contact your assigned doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}