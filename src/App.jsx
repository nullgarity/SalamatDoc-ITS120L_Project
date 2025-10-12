import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Start Pages ─────────────────────
import Home from "./components/start/home";
import Login from "./components/start/login";
import AboutUs from "./components/start/aboutus";
import Contact from "./components/start/contact";

// ─── Dashboard Pages ─────────────────
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import Management from "./components/dashboard/admin/Management";
import ManagementProfile from "./components/dashboard/admin/ManagementProfile";

import DoctorDashboard from "./components/dashboard/doctor/DoctorDashboard";
import DoctorAppointments from "./components/dashboard/doctor/DoctorAppointments";
import DoctorProfile from "./components/dashboard/doctor/DoctorProfile";

import PatientDashboard from "./components/dashboard/patient/PatientDashboard";
import PatientAppointments from "./components/dashboard/patient/PatientAppointments";
import PatientProfile from "./components/dashboard/patient/PatientProfile";
import DailiesFood from "./components/dashboard/patient/DailiesFood";
import DailiesMedicine from "./components/dashboard/patient/DailiesMedicine";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Shared Layout (HeaderBar for start pages, Sidebar for dashboards) */}
          <Route path="/" element={<Layout />}>
            {/* ─── Public / Start Pages ─── */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />

            {/* ─── Admin Routes ─── */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/management"
              element={
                <ProtectedRoute>
                  <Management />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/profile"
              element={
                <ProtectedRoute>
                  <ManagementProfile />
                </ProtectedRoute>
              }
            />

            {/* ─── Doctor Routes ─── */}
            <Route
              path="doctor/dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="doctor/appointments"
              element={
                <ProtectedRoute>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="doctor/profile"
              element={
                <ProtectedRoute>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />

            {/* ─── Patient Routes ─── */}
            <Route
              path="patient/dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="patient/appointments"
              element={
                <ProtectedRoute>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="patient/dailies/food"
              element={
                <ProtectedRoute>
                  <DailiesFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="patient/dailies/medicine"
              element={
                <ProtectedRoute>
                  <DailiesMedicine />
                </ProtectedRoute>
              }
            />
            <Route
              path="patient/profile"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}