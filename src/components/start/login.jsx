import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase"; // 👈 make sure db is exported in firebase.js
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // ✅ Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get Firestore profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const profile = userSnap.data();
        console.log("Profile:", profile);

        // optional: save profile in localStorage or context
        localStorage.setItem("userProfile", JSON.stringify(profile));

        // ✅ Redirect based on role
        switch (profile.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "patient":
            navigate("/patient/dashboard");
            break;
          default:
            navigate("/dashboard"); // fallback if role is missing/unknown
        }
      }
    } catch (err) {
    console.error("Login failed:", err.message);
    setError("Invalid email or password");
      }
    };

  return (
    <div
      style={{
        backgroundImage: "url('../login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <div className="card p-4 shadow-lg" style={{ width: "22rem" }}>
            <h2 className="text-center mb-4">Login</h2>
            <form className="mx-auto" onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" required />
              </div>

              <div className="mb-3 text-center">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" required />
              </div>

              {error && <p className="text-danger text-center">{error}</p>}

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-50">Login</button>
              </div>

              <div className="text-center mt-3">
                <a href="#" className="text-decoration-none">Forgot password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}