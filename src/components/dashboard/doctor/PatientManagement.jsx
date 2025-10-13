import React, { useEffect, useState } from "react";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import "./PatientManagement.css";

export default function PatientManagement() {
	const { id } = useParams(); // UID from /doctor/patient-management/:id
	const [patient, setPatient] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [prescriptions, setPrescriptions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) fetchPatientData(id);
	}, [id]);

	const fetchPatientData = async (uid) => {
		try {
			console.log("Fetching data for UID:", uid);

			// Fetch user document (basic info)
			const userRef = doc(db, "users", uid);
			const userSnap = await getDoc(userRef);

			console.log("User snapshot exists?", userSnap.exists());

			if (!userSnap.exists()) {
				console.warn("No user found with that ID");
				setPatient(null);
				setLoading(false);
				return;
			}

			const userData = { id: userSnap.id, ...userSnap.data() };
			console.log("User data fetched:", userData);

			// Fetch patient document (medical info) - same ID as user
			const patientRef = doc(db, "patients", uid);
			const patientSnap = await getDoc(patientRef);

			console.log("Patient snapshot exists?", patientSnap.exists());

			let combinedData = { ...userData };
			if (patientSnap.exists()) {
				const patientData = patientSnap.data();
				console.log("Raw patient data from Firestore:", patientData);
				console.log(
					"Type of chronicIllness:",
					typeof patientData.chronicIllness
				);
				console.log("Is array?", Array.isArray(patientData.chronicIllness));

				// Merge patient data, handling the chronicIllness array
				combinedData = {
					...userData,
					...patientData,
					// Convert chronicIllness array to string
					chronicIllness: Array.isArray(patientData.chronicIllness)
						? patientData.chronicIllness.join(", ")
						: patientData.chronicIllness || "None",
				};
			} else {
				console.warn("No patient document found in 'patients' collection");
			}

			console.log("Final combined patient data:", combinedData);
			setPatient(combinedData);

			// Fetch appointments and prescriptions
			const apptSnap = await getDocs(collection(db, "appointments"));
			const presSnap = await getDocs(collection(db, "prescriptions"));

			setAppointments(
				apptSnap.docs
					.map((d) => ({ id: d.id, ...d.data() }))
					.filter((a) => a.patientID === uid)
			);

			setPrescriptions(
				presSnap.docs
					.map((d) => ({ id: d.id, ...d.data() }))
					.filter((p) => p.patientID === uid)
			);
		} catch (err) {
			console.error("Error fetching patient data:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <p>Loading patient data...</p>;
	if (!patient) return <p>No patient found.</p>;

	return (
		<div className="patient-management-page">
			<h2 className="page-header">Patient Management</h2>

			<div className="info-grid">
				{/* Prescriptions */}
				<div className="card">
					<h4>Prescriptions</h4>
					{prescriptions.length > 0 ? (
						prescriptions.map((p, i) => (
							<div key={i} className="data-item">
								<p>
									<b>{p.medicationName || "Unnamed Medicine"}</b>
								</p>
								<p>Dosage: {p.dosage || "N/A"}</p>
								<p>Duration: {p.duration || "N/A"}</p>
							</div>
						))
					) : (
						<p>No prescriptions</p>
					)}
				</div>

				{/* Meals */}
				<div className="card">
					<h4>Meals</h4>
					<p>No meal data available.</p>
				</div>

				{/* Appointments */}
				<div className="card">
					<h4>Appointments</h4>
					{appointments.length > 0 ? (
						appointments.map((a, i) => (
							<p key={i}>
								{new Date(a.dateTime).toLocaleString()} — {a.concern || "N/A"}
							</p>
						))
					) : (
						<p>No upcoming appointments</p>
					)}
				</div>

				{/* Patient Info */}
				<div className="card">
					<h4>Patient Information</h4>
					<p>
						<b>Name:</b>{" "}
						{`${
							patient.firstName || patient.first_name || patient.name || ""
						} ${patient.lastName || patient.last_name || ""}`}
					</p>
					<p>
						<b>Email:</b> {patient.email || "N/A"}
					</p>
					<p>
						<b>Contact:</b> {patient.contactNumber || "N/A"}
					</p>
					<p>
						<b>Gender:</b> {patient.gender || patient.sex || "N/A"}
					</p>
					<p>
						<b>Birth Date:</b> {patient.birthDate || "N/A"}
					</p>
					<p>
						<b>Age:</b> {getAge(patient.birthDate)}
					</p>
					<p>
						<b>Allergies:</b> {patient.allergies || "None"}
					</p>
					<p>
						<b>Chronic Illness:</b> {patient.chronicIllness || "None"}
					</p>
					<p>
						<b>Insurance:</b> {patient.insuranceProvider || "N/A"}
					</p>
				</div>

				{/* Medical History */}
				<div className="card">
					<h4>Medical History</h4>
					<ul>
						<li>10 years ago: Diagnosed with Diabetes Type 2</li>
					</ul>
					<h4>Surgical History</h4>
					<ul>
						<li>N/A</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

function getAge(dob) {
	if (!dob) return "N/A";
	const birth = new Date(dob);
	const diff = Date.now() - birth.getTime();
	const age = new Date(diff);
	return Math.abs(age.getUTCFullYear() - 1970);
}
