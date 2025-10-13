import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseConfig";
import { getDocumentById } from "../../../utils/firestoreCRUD";
import { updateDocument } from "../../../utils/firestoreCRUD";
import "./PatientProfile.css";

export default function PatientProfile() {
	const [userData, setUserData] = useState(null);
	const [editData, setEditData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchProfile() {
			const user = auth.currentUser;
			if (user) {
				const data = await getDocumentById("users", user.uid);
				setUserData(data);
				setEditData(data);
			}
			setLoading(false);
		}

		fetchProfile();
	}, []);

	const handleEdit = () => {
		setIsEditing(true);
		setError("");
	};

	const handleCancel = () => {
		setEditData({ ...userData });
		setIsEditing(false);
		setError("");
	};

	const handleChange = (field, value) => {
		setEditData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		setError("");

		// Validation
		if (!editData.name || editData.name.trim() === "") {
			setError("Name is required");
			return;
		}
		if (!editData.contactNumber || editData.contactNumber.trim() === "") {
			setError("Contact number is required");
			return;
		}
		if (!editData.age || editData.age < 0) {
			setError("Valid age is required");
			return;
		}

		setIsSaving(true);

		try {
			const user = auth.currentUser;
			if (user) {
				// Update Firestore
				await updateDocument("users", user.uid, editData);
				setUserData({ ...editData });
				setIsEditing(false);
			}
		} catch (err) {
			setError("Failed to save changes. Please try again.");
			console.error("Error updating profile:", err);
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="profile-container">
				<h1 className="profile-title">Loading profile...</h1>
			</div>
		);
	}

	if (!userData) {
		return (
			<div className="profile-container">
				<h1 className="profile-title">No profile data found.</h1>
			</div>
		);
	}

	return (
		<div className="profile-container">
			<div className="profile-card">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<h3 className="profile-title">Profile</h3>
					{!isEditing ? (
						<button onClick={handleEdit} className="edit-button">
							Edit Profile
						</button>
					) : (
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="save-button">
								{isSaving ? "Saving..." : "Save"}
							</button>
							<button
								onClick={handleCancel}
								disabled={isSaving}
								className="cancel-button">
								Cancel
							</button>
						</div>
					)}
				</div>

				{error && <div className="error-message">{error}</div>}

				<hr className="divider" />

				<div className="profile-section">
					<p>
						<strong>Name:</strong>{" "}
						{isEditing ? (
							<input
								type="text"
								value={editData.name || ""}
								onChange={(e) => handleChange("name", e.target.value)}
								className="edit-input"
							/>
						) : (
							userData.name
						)}
					</p>
					<p>
						<strong>Email Address:</strong> {userData.email}
					</p>
					<p>
						<strong>Contact Number:</strong>{" "}
						{isEditing ? (
							<input
								type="tel"
								value={editData.contactNumber || ""}
								onChange={(e) => handleChange("contactNumber", e.target.value)}
								className="edit-input"
							/>
						) : (
							userData.contactNumber
						)}
					</p>
					<p>
						<strong>Password:</strong> ********
						<span className="change-password">(Change Password)</span>
					</p>
					<p>
						<strong>Account Creation Date:</strong> {userData.accountCreated}
					</p>
				</div>

				<hr className="divider" />

				<div className="profile-section">
					<p>
						<strong>Age:</strong>{" "}
						{isEditing ? (
							<input
								type="number"
								value={editData.age || ""}
								onChange={(e) =>
									handleChange("age", parseInt(e.target.value) || 0)
								}
								className="edit-input"
								min="0"
							/>
						) : (
							userData.age
						)}
					</p>
					<p>
						<strong>Gender:</strong>{" "}
						{isEditing ? (
							<select
								value={editData.gender || ""}
								onChange={(e) => handleChange("gender", e.target.value)}
								className="edit-input">
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						) : (
							userData.gender
						)}
					</p>
					<p>
						<strong>Date of Birth:</strong>{" "}
						{isEditing ? (
							<input
								type="date"
								value={editData.birthDate || ""}
								onChange={(e) => handleChange("birthDate", e.target.value)}
								className="edit-input"
							/>
						) : (
							userData.birthDate
						)}
					</p>
					<p>
						<strong>Chronic Condition/s:</strong>{" "}
						{isEditing ? (
							<input
								type="text"
								value={editData.chronicConditions || ""}
								onChange={(e) =>
									handleChange("chronicConditions", e.target.value)
								}
								className="edit-input"
								placeholder="None or list conditions"
							/>
						) : (
							userData.chronicConditions
						)}
					</p>
					<p>
						<strong>Allergies:</strong>{" "}
						{isEditing ? (
							<input
								type="text"
								value={editData.allergies || ""}
								onChange={(e) => handleChange("allergies", e.target.value)}
								className="edit-input"
								placeholder="None or list allergies"
							/>
						) : (
							userData.allergies
						)}
					</p>
				</div>

				<hr className="divider" />

				<div className="profile-section">
					<p>
						<strong>Insurance Provider:</strong>{" "}
						{isEditing ? (
							<input
								type="text"
								value={editData.insuranceProvider || ""}
								onChange={(e) =>
									handleChange("insuranceProvider", e.target.value)
								}
								className="edit-input"
								placeholder="None or provider name"
							/>
						) : (
							userData.insuranceProvider
						)}
					</p>
					<p>
						<strong>Senior Citizen:</strong>{" "}
						{isEditing ? (
							<select
								value={editData.isSenior ? "Yes" : "No"}
								onChange={(e) =>
									handleChange("isSenior", e.target.value === "Yes")
								}
								className="edit-input">
								<option value="No">No</option>
								<option value="Yes">Yes</option>
							</select>
						) : userData.isSenior ? (
							"Yes"
						) : (
							"No"
						)}
					</p>
					<p>
						<strong>PWD:</strong>{" "}
						{isEditing ? (
							<select
								value={editData.isPWD ? "Yes" : "No"}
								onChange={(e) =>
									handleChange("isPWD", e.target.value === "Yes")
								}
								className="edit-input">
								<option value="No">No</option>
								<option value="Yes">Yes</option>
							</select>
						) : userData.isPWD ? (
							"Yes"
						) : (
							"No"
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
