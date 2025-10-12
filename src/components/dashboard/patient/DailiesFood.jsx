import React, { useEffect, useState } from "react";
import "./DailiesFood.css";

export default function DailiesFood() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    // placeholder — will connect to Firestore later if needed
    setFoods([
      { name: "Breakfast - Oatmeal", calories: 250 },
      { name: "Lunch - Grilled Chicken", calories: 500 },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Daily Food Log</h1>
      {foods.length === 0 ? (
        <p>No food entries logged yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f, index) => (
              <tr key={index}>
                <td>{f.name}</td>
                <td>{f.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
