import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseConfig";
import { getDocumentById } from "../../../utils/firestoreCRUD";
import "./PatientProfile.css";

export default function PatientProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const user = auth.currentUser;
      if (user) {
        const data = await getDocumentById("users", user.uid);
        setUserData(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

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
        <h3 className="profile-title">Profile</h3>
        <hr className="divider" />
        <div className="profile-section">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email Address:</strong> {userData.email}</p>
          <p><strong>Contact Number:</strong> {userData.contactNumber}</p>
          <p>
            <strong>Password:</strong> ********
            <span className="change-password">(Change Password)</span>
          </p>
          <p><strong>Account Creation Date:</strong> {userData.accountCreated}</p>
        </div>

        <hr className="divider" />

        <div className="profile-section">
          <p><strong>Age:</strong> {userData.age}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>Date of Birth:</strong> {userData.birthDate}</p>
          <p><strong>Chronic Condition/s:</strong> {userData.chronicConditions}</p>
          <p><strong>Allergies:</strong> {userData.allergies}</p>
        </div>

        <hr className="divider" />

        <div className="profile-section">
          <p><strong>Insurance Provider:</strong> {userData.insuranceProvider}</p>
          <p><strong>Senior Citizen:</strong> {userData.isSenior ? "Yes" : "No"}</p>
          <p><strong>PWD:</strong> {userData.isPWD ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}