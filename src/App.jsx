import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./components/start/login";
import Navbar from "./components/start/navbar";
import AboutUs from "./components/start/aboutus";
import Dashboard from "./components/dashboard";
import Home from "./components/start/home";
import Contact from "./components/start/contact";
import Sidebar from "./components/sidebar";

// 🔹 Import AuthProvider
import { AuthProvider } from "./components/AuthContext";

function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const showSidebar = location.pathname.startsWith("/dashboard");

  // ❌ Remove hardcoded role later
  const userRole = "admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          role={userRole}
        />
      )}

      {/* Main content */}
      <div
        style={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        {!showSidebar && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={<Dashboard userRole={userRole} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}