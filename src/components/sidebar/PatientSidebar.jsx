import { NavLink } from "react-router-dom";
import "../sidebar.css";

export default function PatientSidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">SalamatDoc</h2>
      <ul>
        <li>
          <NavLink to="/patient/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/patient/medicine" className={({ isActive }) => isActive ? "active" : ""}>Dailies – Medicine</NavLink>
        </li>
        <li>
          <NavLink to="/patient/food" className={({ isActive }) => isActive ? "active" : ""}>Dailies – Food</NavLink>
        </li>
        <li>
          <NavLink to="/patient/appointments" className={({ isActive }) => isActive ? "active" : ""}>Appointments</NavLink>
        </li>
        <li>
          <NavLink to="/patient/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
        </li>
        <li>
          <NavLink to="/logout" className={({ isActive }) => isActive ? "active" : ""}>Log out</NavLink>
        </li>
      </ul>
    </aside>
  );
}