import { useState } from "react";
import "./App.css";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Customers from "./admin/pages/Customers";

function App() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminAccessToken")
  );

  const [page, setPage] = useState("dashboard");

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    setPage("dashboard");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAccessToken");
    setAdminToken(null);
    setPage("dashboard");
  };

  if (!adminToken) {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
      />
    );
  }

  if (page === "customers") {
    return (
      <Customers
        token={adminToken}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  return (
    <AdminDashboard
      token={adminToken}
      onLogout={handleAdminLogout}
      onCustomers={() => setPage("customers")}
    />
  );
}

export default App;