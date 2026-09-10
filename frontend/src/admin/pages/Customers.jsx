import { useEffect, useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function Customers({ token, onBack }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/admin/customers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load customers"
          );
        }

        setCustomers(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [token]);

  return (
    <div className="admin-app">

      <header className="admin-header">
        <div>
          <div className="admin-logo">LP</div>
          <span>Loan Platform</span>
        </div>

        <button
          className="logout-button"
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="admin-content">

        <div className="admin-title">
          <div>
            <h1>Customers</h1>
            <p>
              View and manage registered customers
            </p>
          </div>
        </div>

        {loading && (
          <div className="dashboard-card">
            Loading customers...
          </div>
        )}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {!loading && !message && (
          <div className="customer-table-container">

            <table className="customer-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>

                {customers.map((customer) => (
                  <tr key={customer.id}>

                    <td>
                      <strong>
                        {customer.firstName}{" "}
                        {customer.lastName}
                      </strong>
                    </td>

                    <td>
                      {customer.mobileNumber}
                    </td>

                    <td>
                      {customer.email || "-"}
                    </td>

                    <td>
                      <span className="customer-status">
                        {customer.status}
                      </span>
                    </td>

                    <td>
                      {customer.createdAt
                        ? new Date(
                            customer.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {customers.length === 0 && (
              <div className="empty-state">
                No customers found.
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default Customers;
