import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseConfig";
import { getDocumentById, updateDocument } from "../../../utils/firestoreCRUD";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const user = auth.currentUser;
      if (user) {
        const data = await getDocumentById("doctors", user.uid);
        setDoctorData(data);
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
    setEditData({ ...doctorData });
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

    if (!editData.fullName || editData.fullName.trim() === "") {
      setError("Name is required");
      return;
    }
    if (!editData.officeContactNo || editData.officeContactNo.trim() === "") {
      setError("Contact number is required");
      return;
    }
    if (!editData.medicalField || editData.medicalField.trim() === "") {
      setError("Medical field is required");
      return;
    }

    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDocument("doctors", user.uid, editData);
        setDoctorData({ ...editData });
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Error updating doctor profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-content">
        <h1>Loading profile...</h1>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="profile-content">
        <h1>No profile data available.</h1>
      </div>
    );
  }

  return (
    <div className="profile-content">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <h2>Doctor Profile</h2>
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button">
              Edit Profile
            </button>
          ) : (
            <div className="button-group">
              <button onClick={handleSave} disabled={isSaving} className="save-button">
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancel} disabled={isSaving} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <hr />

        {/* Personal Information */}
        <h3>Personal Information</h3>
        <div className="profile-info">
          <p>
            <strong>Name:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.fullName
            )}
          </p>
          <p>
            <strong>Email Address:</strong> {doctorData.email}
          </p>
          <p>
            <strong>Contact Number:</strong>{" "}
            {isEditing ? (
              <input
                type="tel"
                value={editData.officeContactNo || ""}
                onChange={(e) => handleChange("officeContactNo", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.officeContactNo
            )}
          </p>
          <p>
            <strong>Password:</strong> ********{" "}
            <span className="change-password">(Change Password)</span>
          </p>
          <p>
            <strong>Account Creation Date:</strong>{" "}
            {doctorData.createdAt
              ? new Date(doctorData.createdAt.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <hr />

        {/* Professional Information */}
        <h3>Professional Information</h3>
        <div className="profile-info">
          <p>
            <strong>Medical Field:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editData.medicalField || ""}
                onChange={(e) => handleChange("medicalField", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.medicalField
            )}
          </p>
          <p>
            <strong>Years of Experience:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                value={editData.yearsExperience || ""}
                onChange={(e) => handleChange("yearsExperience", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.yearsExperience
            )}
          </p>
          <p>
            <strong>Place of Employment:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editData.placeOfEmployment || ""}
                onChange={(e) => handleChange("placeOfEmployment", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.placeOfEmployment
            )}
          </p>
          <p>
            <strong>Office Address:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editData.officeAddress || ""}
                onChange={(e) => handleChange("officeAddress", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.officeAddress
            )}
          </p>
          <p>
            <strong>Office Room No.:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editData.officeRoomNo || ""}
                onChange={(e) => handleChange("officeRoomNo", e.target.value)}
                className="edit-input"
              />
            ) : (
              doctorData.officeRoomNo
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
