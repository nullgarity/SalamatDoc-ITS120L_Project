import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('../Home.png')",
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
        minHeight: "100vh",
        }}
      >
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <div className="card p-4 shadow-lg" style={{ maxWidth: "700px" }}>
            <h1 className="fw-bold mb-4">Accessible Online Health</h1> 
            <p className="lead">
              We’re dedicated to connecting patients to qualified doctors in a way that is safe, efficient, and effective for all.
            </p>
            <p>
                With a future-oriented mindset, we don’t shy away from technology. This has 
                allowed us to remotely connect you to our partnered doctors , ensuring you stay fit and 
                healthy even in the comfort of your own home.
            </p>
            <hr />
            <p className="mb-0">
              <strong>THINK OF CATCHPHRASE</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
