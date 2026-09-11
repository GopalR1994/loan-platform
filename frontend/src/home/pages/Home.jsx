function Home({ onAdminLogin, onCustomerLogin, onCustomerRegister }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <div className="logo">LP</div>
          <div>
            <strong>Loan Platform</strong>
            <span>Digital Lending</span>
          </div>
        </div>
      </header>

      <main className="home-content">
        <section className="home-hero">
          <div className="home-badge">
            Secure Digital Lending
          </div>

          <h1>
            Simple, Fast &amp; Secure
            <br />
            Loan Services
          </h1>

          <p>
            Manage your loans, complete KYC, and track
            your application securely from one platform.
          </p>
        </section>

        <section className="home-options">
          <div className="home-option-card">
            <div className="home-option-icon">👤</div>

            <h2>Customer</h2>

            <p>
              Apply for loans, complete your KYC, and
              manage your account.
            </p>

            <button
              className="primary-button"
              onClick={onCustomerLogin}
            >
              Customer Login
            </button>

            <button
              className="secondary-button full-width"
              onClick={onCustomerRegister}
            >
              Create Account
            </button>
          </div>

          <div className="home-option-card">
            <div className="home-option-icon">🔐</div>

            <h2>Administrator</h2>

            <p>
              Manage customers, review KYC submissions,
              and administer the platform.
            </p>

            <button
              className="primary-button"
              onClick={onAdminLogin}
            >
              Admin Login
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        Loan Platform © 2026
      </footer>
    </div>
  );
}

export default Home;
