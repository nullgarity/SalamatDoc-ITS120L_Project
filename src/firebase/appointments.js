import { 
  collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, 
  serverTimestamp, Timestamp, query, where 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * @typedef {import("../types/firestoreType").Appointment} Appointment
 */

/**
 * Validates and converts the dateTime field to a Firestore Timestamp.
 * @param {any} dateValue
 * @returns {Timestamp}
 */
const validateAndConvertDate = (dateValue) => {
  if (!dateValue) throw new Error("Missing required field: dateTime");

  let parsedDate;
  if (dateValue instanceof Timestamp) return dateValue;
  if (typeof dateValue === "string" || dateValue instanceof Date) {
    parsedDate = new Date(dateValue);
  } else {
    throw new Error("Invalid dateTime format: must be a Date, string, or Firestore Timestamp");
  }

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid dateTime value: could not parse into a valid Date");
  }

  return Timestamp.fromDate(parsedDate);
};

/**
 * Create a new appointment.
 * @param {Omit<Appointment, "appointment_ID">} appointmentData 
 * @returns {Promise<string>} appointment document ID
 */
export const createAppointment = async (appointmentData) => {
  const ref = collection(db, "appointments");

  const validData = {
    ...appointmentData,
    dateTime: validateAndConvertDate(appointmentData.dateTime),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(ref, validData);
  return docRef.id;
};

/**
 * Get all appointments.
 * @returns {Promise<Appointment[]>}
 */
export const getAllAppointments = async () => {
  const ref = collection(db, "appointments");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(d => ({
    appointment_ID: d.id,
    ...d.data(),
  }));
};

/**
 * Get appointments for a specific doctor.
 * @param {string} doctorID
 * @returns {Promise<Appointment[]>}
 */
export const getAppointmentsByDoctor = async (doctorID) => {
  const ref = collection(db, "appointments");
  const q = query(ref, where("doctorID", "==", doctorID));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    appointment_ID: d.id,
    ...d.data(),
  }));
};

/**
 * Get appointments for a specific patient.
 * @param {string} patientID
 * @returns {Promise<Appointment[]>}
 */
export const getAppointmentsByPatient = async (patientID) => {
  const ref = collection(db, "appointments");
  const q = query(ref, where("patientID", "==", patientID));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    appointment_ID: d.id,
    ...d.data(),
  }));
};

/**
 * Update an appointment by ID.
 * @param {string} appointment_ID
 * @param {Partial<Appointment>} updatedData
 */
export const updateAppointment = async (appointment_ID, updatedData) => {
  const ref = doc(db, "appointments", appointment_ID);

  const validData = { ...updatedData };
  if (updatedData.dateTime) {
    validData.dateTime = validateAndConvertDate(updatedData.dateTime);
  }

  await updateDoc(ref, { ...validData, updatedAt: serverTimestamp() });
};

/**
 * Delete an appointment by ID.
 * @param {string} appointment_ID
 */
export const deleteAppointment = async (appointment_ID) => {
  const ref = doc(db, "appointments", appointment_ID);
  await deleteDoc(ref);
};
