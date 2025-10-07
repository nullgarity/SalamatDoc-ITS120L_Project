import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Sidebar({ collapsed, setCollapsed, role = "patient" }) {
  const menuItems = {
    patient: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Daily Medicine", path: "/dashboard" },
      { label: "Daily Food", path: "/dashboard" },
      { label: "Appointments", path: "/dashboard" },
      { label: "Medical Records", path: "/dashboard" },
      { label: "Logout", path: "/dashboard" },
    ],
    doctor: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Patients", path: "/dashboard" },
      { label: "Appointments", path: "/dashboard" },
      { label: "Schedule", path: "/dashboard" },
      { label: "Logout", path: "/dashboard" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Manage Users", path: "/dashboard" },
      { label: "Reports", path: "/dashboard" },
      { label: "Settings", path: "/dashboard" },
      { label: "Logout", path: "/dashboard" },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <aside
      className="bg-primary text-white d-flex flex-column align-items-center p-2"
      style={{
        width: collapsed ? "60px" : "250px",
        transition: "width 0.3s ease",
        minHeight: "100vh",
        boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
      }}
    >
    {/* Collapse button */}
    <button
    className="btn btn-sm btn-light mb-3"
    onClick={() => setCollapsed(!collapsed)}
    style={{
        width: collapsed ? "40px" : "20%",
        transition: "width 0.5s ease",
        display: "block",
        marginLeft: collapsed ? "auto" : "1", // push to right when collapsed
    }}
    >
    {collapsed ? "»" : "«"}
    </button>


      {/* Brand */}
      {!collapsed && <h4 className="fw-bold fs-1 text-center mb-4">SalamatDoc</h4>}

      {/* Menu */}
      <ul className="nav flex-column w-100">
        {items.map((item, index) => (
          <li
            className="fs-4 nav-item mb-2 d-flex justify-content-center"
            key={index}
            title={collapsed ? item.label : ""}
          >
            <Link
              className="nav-link text-white d-flex align-items-center justify-content-center"
              to={item.path}
            >
              {/* Optional: icon placeholder */}
              <span className="me-2">{/* icon can go here */}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>  
          
        ))}
      </ul>


    </aside>
  );
}
