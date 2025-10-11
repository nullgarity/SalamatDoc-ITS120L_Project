import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">SalamatDoc</h2>
      <ul>
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>Manage Users</NavLink>
        </li>
        <li>
          <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "active" : ""}>Reports</NavLink>
        </li>
        <li>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "active" : ""}>Settings</NavLink>
        </li>
        <li>
          <NavLink to="/logout" className={({ isActive }) => isActive ? "active" : ""}>Log out</NavLink>
        </li>
      </ul>
    </aside>
  );
}