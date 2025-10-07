import React, { useState } from "react";
import Sidebar from "../sidebar";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>This is Patient's Dashboard</p>
    </main>
  );
}
