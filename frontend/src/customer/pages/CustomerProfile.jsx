import { useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function CustomerProfile({ token, mobileNumber, onComplete, onBackToHome }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const createProfile = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobileNumber,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create customer profile"
        );
      }

      localStorage.setItem(
        "customerId",
        data.id
      );

      onComplete(data);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card auth-card">
        <div className="logo">LP</div>

        <h1>Complete Your Profile</h1>

        <p className="subtitle">
          Enter your details to create your customer account
        </p>

        <div className="profile-mobile">
          <span>Mobile Number</span>
          <strong>{mobileNumber}</strong>
        </div>

        <form onSubmit={createProfile}>
          <label htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            maxLength={100}
            disabled={loading}
          />

          <label htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            maxLength={100}
            disabled={loading}
          />

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            maxLength={255}
            disabled={loading}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            className={`message ${
              messageType === "success"
                ? "message-success"
                : "message-error"
            }`}
          >
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

export default CustomerProfile;
