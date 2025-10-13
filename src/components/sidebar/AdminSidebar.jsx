import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../AuthContext";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
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
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </li>
      </ul>
    </aside>
  );
}