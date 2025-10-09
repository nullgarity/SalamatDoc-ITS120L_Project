import React from "react";
import PatientDashboard from "./patient/PatientDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import AdminDashboard from "./admin/AdminDashboard";

// Switch function once user type is determined
export default function Dashboard({ userRole }) {
  if (userRole === "patient") return <PatientDashboard userRole={userRole} />;
  if (userRole === "doctor") return <DoctorDashboard userRole={userRole} />;
  if (userRole === "admin") return <AdminDashboard userRole={userRole} />;
  
  // Error handler just in case but will probably never be triggered
  return <p>No dashboard available for this role.</p>;
}