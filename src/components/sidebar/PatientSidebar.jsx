import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./PatientSidebar.css";

export default function PatientSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // prevent NavLink navigation
    await logout(); // call the AuthContext logout
    navigate("/login"); // redirect to login page
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">SalamatDoc</h2>
      <ul>
        <li>
          <NavLink
            to="/patient/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/medicine"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dailies – Medicine
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/food"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dailies – Food
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/appointments"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
        </li>
        {/* ✅ Logout item that calls handleLogout */}
        <li>
          <a href="/logout" onClick={(e) => { e.preventDefault(); logout(); }}>
            Log out
          </a>
        </li>
      </ul>
    </aside>
  );
}