import { useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function AdminLogin({ onLogin, onBackToHome }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid username or password"
        );
      }

      localStorage.setItem(
        "adminAccessToken",
        data.accessToken
      );

      onLogin(data.accessToken);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="logo">LP</div>

        <h1>Admin Portal</h1>

        <p className="subtitle">
          Sign in to manage the Loan Platform
        </p>

        <form onSubmit={login}>
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            disabled={loading}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !username ||
              !password
            }
          >
            {loading ? "Signing in..." : "Admin Login"}
          </button>
        </form>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <button
          type="button"
          className="text-button"
          onClick={onBackToHome}
          disabled={loading}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
