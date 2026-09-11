import { useEffect, useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function AdminDashboard({ token, onLogout, onCustomers, onKyc }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="app">
        <div className="card">
          <h1>Admin Portal</h1>
          <p className="subtitle">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">

      <header className="admin-header">
        <div>
          <div className="admin-logo">LP</div>
          <span>Loan Platform</span>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">

        <div className="admin-title">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage your loan platform
            </p>
          </div>
        </div>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {dashboard && (
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <span className="dashboard-label">
                Logged In As
              </span>

              <strong>
                {dashboard.username}
              </strong>
            </div>

            <div className="dashboard-card">
              <span className="dashboard-label">
                Role
              </span>

              <strong>
                {dashboard.role}
              </strong>
            </div>

            <div className="dashboard-card">
              <span className="dashboard-label">
                Customers
              </span>

              <strong>
                1
              </strong>
            </div>

            <div className="dashboard-card">
              <span className="dashboard-label">
                Active Loans
              </span>

              <strong>
                0
              </strong>
            </div>

          </div>
        )}

        <section className="admin-section">

          <h2>Management</h2>

          <div className="management-grid">

            <div className="management-card">
              <h3>Customers</h3>
              <p>
                View and manage customers
              </p>
              <button onClick={onCustomers}>
                Customers
              </button>
            </div>

            <div className="management-card">
              <h3>KYC</h3>
              <p>
                Review customer KYC
              </p>
              <button onClick={onKyc}>
                KYC Management
              </button>
            </div>

            <div className="management-card">
              <h3>Loan Applications</h3>
              <p>
                Review loan applications
              </p>
              <button>
                Applications
              </button>
            </div>

            <div className="management-card">
              <h3>Loan Offers</h3>
              <p>
                Manage loan offers
              </p>
              <button>
                Loan Offers
              </button>
            </div>

            <div className="management-card">
              <h3>Disbursements</h3>
              <p>
                Manage loan disbursements
              </p>
              <button>
                Disbursements
              </button>
            </div>

            <div className="management-card">
              <h3>Repayments</h3>
              <p>
                View repayment transactions
              </p>
              <button>
                Repayments
              </button>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;
