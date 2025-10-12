import React from "react";
import "./PatientProfile.css";

export default function PatientProfile() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Welcome back, Juan!</h3>
          <p>Here’s a quick overview of your daily health updates and appointments.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Upcoming Appointments</h4>
            <p>2 scheduled this week</p>
          </div>

          <div className="stat-card">
            <h4>Medicine Reminders</h4>
            <p>3 medicines for today</p>
          </div>

          <div className="stat-card">
            <h4>Food Log</h4>
            <p>2 meals recorded</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>Checked blood sugar level at 8:00 AM</li>
            <li>Took Metformin (500mg) at 8:15 AM</li>
            <li>Logged breakfast: Oatmeal with fruit</li>
            <li>Confirmed appointment with Dr. Santos for Oct 14</li>
          </ul>
        </div>
      </div>
    </div>
  );
}