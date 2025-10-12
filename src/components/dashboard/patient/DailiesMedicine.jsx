import React, { useEffect, useState } from "react";

export default function DailiesMedicine() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    // placeholder — will connect to Firestore later if needed
    setMeds([
      { name: "Paracetamol", dosage: "500mg", time: "8:00 AM" },
      { name: "Vitamin C", dosage: "1000mg", time: "12:00 PM" },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Daily Medicine Log</h1>
      {meds.length === 0 ? (
        <p>No medicines logged yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m, index) => (
              <tr key={index}>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
