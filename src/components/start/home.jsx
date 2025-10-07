import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-center text-white"
      style={{
        backgroundImage: "url('../Home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="container bg-white text-dark rounded-4 shadow-lg p-5" style={{ maxWidth: "700px" }}>
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
  );
}
