import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // place login code here
    navigate("/dashboard");
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
        backgroundColor: "rgba(255, 255, 255, 0.5)", // 👈 50% white overlay
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh",}}>
          <div className="card p-4 shadow-lg" style={{ width: "22rem" }}>
            <h2 className="text-center mb-4">Login</h2>
            <form className= "mx-auto" onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" required />
              </div>

              <div className="mb-3 text-center">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" required />
              </div>
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
