function CustomerDashboard({
  mobileNumber,
  customerId,
  onKyc,
  onLogout,
}) {
  return (
    <div className="customer-dashboard">
      <header className="customer-header">
        <div className="customer-brand">
          <div className="customer-logo">LP</div>

          <div>
            <strong>Loan Platform</strong>
            <span>Customer Portal</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="customer-content">
        <section className="customer-welcome">
          <div>
            <span className="customer-welcome-label">
              CUSTOMER PORTAL
            </span>

            <h1>Welcome back!</h1>

            <p>
              Manage your profile, KYC verification and
              loan applications from one place.
            </p>
          </div>
        </section>

        <section className="customer-profile-summary">
          <div>
            <span>Mobile Number</span>
            <strong>{mobileNumber || "-"}</strong>
          </div>

          <div>
            <span>Customer ID</span>
            <strong>{customerId || "-"}</strong>
          </div>
        </section>

        <section className="customer-section">
          <h2>Account Management</h2>

          <div className="customer-grid">
            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                👤
              </div>

              <h3>My Profile</h3>

              <p>
                View and manage your customer information.
              </p>

              <button
                className="secondary-button full-width"
                disabled
              >
                Coming Soon
              </button>
            </div>

            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                🪪
              </div>

              <h3>KYC Verification</h3>

              <p>
                Submit your identity documents and track
                verification status.
              </p>

              <button
                className="primary-button"
                onClick={onKyc}
              >
                Manage KYC
              </button>
            </div>

            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                💰
              </div>

              <h3>Loan Application</h3>

              <p>
                Apply for a loan after completing your KYC.
              </p>

              <button
                className="secondary-button full-width"
                disabled
              >
                Coming Soon
              </button>
            </div>

            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                📋
              </div>

              <h3>My Loans</h3>

              <p>
                View your active and previous loan
                applications.
              </p>

              <button
                className="secondary-button full-width"
                disabled
              >
                Coming Soon
              </button>
            </div>

            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                💳
              </div>

              <h3>Repayments</h3>

              <p>
                View repayment schedules and make payments.
              </p>

              <button
                className="secondary-button full-width"
                disabled
              >
                Coming Soon
              </button>
            </div>

            <div className="customer-feature-card">
              <div className="customer-feature-icon">
                🔔
              </div>

              <h3>Notifications</h3>

              <p>
                Stay updated about your applications and
                account.
              </p>

              <button
                className="secondary-button full-width"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;
