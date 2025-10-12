import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import {
  getDocuments,
  getDocumentsByField,
  addDocument,
  updateDocument,
} from "../../../utils/firestoreUtils";
import "./DoctorAppointments.css";

export default function DoctorAppointments() {
  const { user } = useAuth(); // current doctor user

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    date: "",
    time: "",
  });

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editData, setEditData] = useState({ date: "", time: "" });

  // ✅ Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getDocuments("patients");
      setPatients(data);
    };
    fetchPatients();
  }, []);

  // ✅ Fetch existing appointments for this doctor
  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      const data = await getDocumentsByField("appointments", "doctorId", user.uid);
      setAppointments(data);
    };
    fetchAppointments();
  }, [user]);

  // ✅ Add new appointment
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time) {
      alert("Please fill out all fields.");
      return;
    }

    const patient = patients.find((p) => p.id === newAppointment.patientId);
    const datetime = `${newAppointment.date} ${newAppointment.time}`;

    await addDocument("appointments", {
      doctorId: user.uid,
      doctorName: user.displayName || "Dr. Unknown",
      patientId: patient.id,
      patientName: patient.name,
      patientContact: patient.contactNumber || "N/A",
      datetime,
    });

    alert("Appointment added successfully!");
    setNewAppointment({ patientId: "", date: "", time: "" });

    // Refresh list
    const updated = await getDocumentsByField("appointments", "doctorId", user.uid);
    setAppointments(updated);
  };

  // ✅ Save edited appointment
  const handleEditSave = async (e) => {
    e.preventDefault();
    const datetime = `${editData.date} ${editData.time}`;
    await updateDocument("appointments", editingAppointment.id, { datetime });
    alert("Appointment updated!");

    setEditingAppointment(null);
    const updated = await getDocumentsByField("appointments", "doctorId", user.uid);
    setAppointments(updated);
  };

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>

      {/* Appointments List */}
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.datetime}</td>
                  <td>{appt.patientName}</td>
                  <td>{appt.patientContact}</td>
                  <td>
                    <button>View</button>
                    <button
                      onClick={() => {
                        const [date, time] = appt.datetime.split(" ");
                        setEditingAppointment(appt);
                        setEditData({ date, time });
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add New Appointment */}
      <div className="add-appointment">
        <h3>Add Appointment</h3>
        <form onSubmit={handleAddAppointment}>
          <select
            value={newAppointment.patientId}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, patientId: e.target.value })
            }
          >
            <option value="">Select Name</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          />

          <input
            type="time"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
          />

          <button type="submit">SUBMIT</button>
        </form>
      </div>

      {/* ✅ Edit Modal (Step 4 you mentioned) */}
      {editingAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Appointment</h3>
            <form onSubmit={handleEditSave}>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              />
              <input
                type="time"
                value={editData.time}
                onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              />

              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingAppointment(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}