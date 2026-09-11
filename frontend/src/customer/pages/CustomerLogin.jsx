import { useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function CustomerLogin({ onLogin, onBackToHome }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [sandboxOtp, setSandboxOtp] = useState("");

  const requestOtp = async (event) => {
    event.preventDefault();

    if (!/^[0-9]{10,15}$/.test(mobileNumber)) {
      setMessage("Please enter a valid mobile number.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setSandboxOtp("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/otp/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send OTP"
        );
      }

      setOtpSent(true);
      setSandboxOtp(data.message || "");
      setMessage("OTP generated successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();

    if (!/^[0-9]{6}$/.test(otp)) {
      setMessage("OTP must contain exactly 6 digits.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid OTP"
        );
      }

      localStorage.setItem(
        "customerAccessToken",
        data.accessToken
      );

      localStorage.setItem(
        "customerMobileNumber",
        mobileNumber
      );

      onLogin(data.accessToken, mobileNumber);
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
        <div className="admin-logo">LP</div>

        <h1>Customer Login</h1>

        <p className="subtitle">
          Access your loan platform account
        </p>

        {!otpSent ? (
          <form onSubmit={requestOtp}>
            <label htmlFor="mobileNumber">
              Mobile Number
            </label>

            <input
              id="mobileNumber"
              type="tel"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(event) =>
                setMobileNumber(event.target.value)
              }
              maxLength={15}
              disabled={loading}
            />

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label htmlFor="otp">
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value.replace(/\D/g, "")
                )
              }
              maxLength={6}
              disabled={loading}
            />

            {sandboxOtp && (
              <div className="sandbox-otp">
                {sandboxOtp}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setSandboxOtp("");
                setMessage("");
              }}
              disabled={loading}
            >
              Change Mobile Number
            </button>
          </form>
        )}

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

export default CustomerLogin;
