import React from "react";
import PatientDashboard from "./patient/PatientDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import { useAuth } from "./AuthContext";

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!profile) {
    return <p>No profile found. Contact admin.</p>;
  }

  const role = profile.role;

  if (role === "patient") return <PatientDashboard userRole={role} />;
  if (role === "doctor") return <DoctorDashboard userRole={role} />;
  if (role === "admin") return <AdminDashboard userRole={role} />;

  return <p>No dashboard available for this role.</p>;
}