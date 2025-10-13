import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../AuthContext";
import "./PatientSidebar.css";

export default function PatientSidebar() {
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
          <NavLink
            to="/patient/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/dailies/medicine"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dailies – Medicine
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patient/dailies/food"
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
        <li>
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </li>
      </ul>
    </aside>
  );
}