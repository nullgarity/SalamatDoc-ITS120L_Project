import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-center text-white"
      style={{
        backgroundImage: "url('../Contact.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="container bg-white text-dark rounded-4 shadow-lg p-5" style={{ maxWidth: "700px" }}>
        <h1 className="fw-bold mb-4">Contact</h1> 
        <p className="fs-4">
                Are you interested as a patient? Email us through SalamatDoc@applications.com to get the patient application process started. Through email, we’ll guide you however much you need throughout the process.
        </p>
        <p className="fs-4">
                 Are you interested in becoming a SalamatDoc doctor? Email us through SalamatDoc@applications.com to begin. You will undergo an authentication and screening process for everyone’s safety, security, and health.
        </p>
        <hr />
        <p className="">
          <strong>THINK OF CATCHPHRASE</strong>
        </p>
      </div>
    </div>
  );
}
