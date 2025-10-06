import React, { useState } from "react";
import Sidebar from "../sidebar";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>This is Doctor's Dashboard</p>
    </main>
  );
}
