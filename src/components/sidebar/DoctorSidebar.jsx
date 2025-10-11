import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function DoctorSidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">SalamatDoc</h2>
      <ul>
        <li>
          <NavLink to="/doctor/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/doctor/patients" className={({ isActive }) => isActive ? "active" : ""}>Patients</NavLink>
        </li>
        <li>
          <NavLink to="/doctor/appointments" className={({ isActive }) => isActive ? "active" : ""}>Appointments</NavLink>
        </li>
        <li>
          <NavLink to="/doctor/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
        </li>
        <li>
          <NavLink to="/logout" className={({ isActive }) => isActive ? "active" : ""}>Log out</NavLink>
        </li>
      </ul>
    </aside>
  );
}