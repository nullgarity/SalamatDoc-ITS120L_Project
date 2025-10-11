// src/components/layout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Sidebars
import AdminSidebar from "./sidebar/AdminSidebar";
import DoctorSidebar from "./sidebar/DoctorSidebar";
import PatientSidebar from "./sidebar/PatientSidebar";
import HeaderBar from "./sidebar/HeaderBar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Extract role from Firestore profile (fetched by AuthContext)
  const role = profile?.role || null;

  // Determine which sidebar or header to show
  let sidebar = null;

  if (role === "admin" && location.pathname.startsWith("/admin")) {
    sidebar = <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
  } else if (role === "doctor" && location.pathname.startsWith("/doctor")) {
    sidebar = <DoctorSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
  } else if (role === "patient" && location.pathname.startsWith("/patient")) {
    sidebar = <PatientSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
  }

  const showHeader = !sidebar; // Show HeaderBar only when no sidebar

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar (for dashboards only) */}
      {sidebar && (
        <div
          style={{
            width: collapsed ? "80px" : "250px",
            transition: "width 0.3s ease",
          }}
        >
          {sidebar}
        </div>
      )}

      {/* Main content area */}
      <div style={{ flexGrow: 1 }}>
        {/* HeaderBar (for start pages like home, about, contact) */}
        {showHeader && <HeaderBar />}

        {/* Render active page */}
        <Outlet />
      </div>
    </div>
  );
}