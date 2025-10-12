import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/layout";

import Home from "./components/start/home";
import Login from "./components/start/login";
import AboutUs from "./components/start/aboutus";
import Contact from "./components/start/contact";

import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import DoctorDashboard from "./components/dashboard/doctor/DoctorDashboard";
import PatientDashboard from "./components/dashboard/patient/PatientDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* All routes share Layout */}
          <Route path="/" element={<Layout />}>
            {/* Start pages with HeaderBar */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />

            {/* Dashboard pages with Sidebars */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="patient/dashboard" element={<PatientDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}