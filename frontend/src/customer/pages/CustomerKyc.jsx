import { useEffect, useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function CustomerKyc({ token, onBack }) {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [kycType, setKycType] = useState("NATIONAL_ID");
  const [idNumber, setIdNumber] = useState("");
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [selfieUrl, setSelfieUrl] = useState("");

  const loadKyc = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/kyc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        setKyc(null);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load KYC"
        );
      }

      setKyc(data);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, [token]);

  const submitKyc = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/kyc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kycType,
            idNumber: idNumber.trim(),
            idDocumentUrl: idDocumentUrl.trim(),
            selfieUrl: selfieUrl.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit KYC"
        );
      }

      setKyc(data);
      setMessage("KYC submitted successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="card">
          <div className="logo">LP</div>
          <h1>KYC Verification</h1>
          <p className="subtitle">
            Loading your KYC information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card customer-kyc-card">
        <div className="logo">LP</div>

        <h1>KYC Verification</h1>

        <p className="subtitle">
          Verify your identity to continue using loan services
        </p>

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

        {!kyc ? (
          <form onSubmit={submitKyc}>
            <div className="kyc-info-box">
              <strong>Identity Verification</strong>
              <span>
                Please provide your identification details.
              </span>
            </div>

            <label htmlFor="kycType">
              KYC Type
            </label>

            <select
              id="kycType"
              value={kycType}
              onChange={(event) =>
                setKycType(event.target.value)
              }
              disabled={submitting}
            >
              <option value="NATIONAL_ID">
                National ID
              </option>
              <option value="PASSPORT">
                Passport
              </option>
              <option value="DRIVERS_LICENSE">
                Driver's License
              </option>
            </select>

            <label htmlFor="idNumber">
              ID Number
            </label>

            <input
              id="idNumber"
              type="text"
              placeholder="Enter ID number"
              value={idNumber}
              onChange={(event) =>
                setIdNumber(event.target.value)
              }
              maxLength={100}
              required
              disabled={submitting}
            />

            <label htmlFor="idDocumentUrl">
              ID Document
            </label>

            <input
              id="idDocumentUrl"
              type="url"
              placeholder="https://example.com/id-document.pdf"
              value={idDocumentUrl}
              onChange={(event) =>
                setIdDocumentUrl(event.target.value)
              }
              required
              disabled={submitting}
            />

            <small className="field-help">
              Sandbox: enter the document URL.
            </small>

            <label htmlFor="selfieUrl">
              Selfie
            </label>

            <input
              id="selfieUrl"
              type="url"
              placeholder="https://example.com/selfie.jpg"
              value={selfieUrl}
              onChange={(event) =>
                setSelfieUrl(event.target.value)
              }
              required
              disabled={submitting}
            />

            <small className="field-help">
              Sandbox: enter the selfie URL.
            </small>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit KYC"}
            </button>
          </form>
        ) : (
          <div className="customer-kyc-result">
            <div className="customer-kyc-status">
              <span>KYC Status</span>

              <strong
                className={`kyc-status kyc-status-${kyc.status?.toLowerCase()}`}
              >
                {kyc.status}
              </strong>
            </div>

            <div className="kyc-detail">
              <span>KYC Type</span>
              <strong>{kyc.kycType || "-"}</strong>
            </div>

            <div className="kyc-detail">
              <span>ID Number</span>
              <strong>{kyc.idNumber || "-"}</strong>
            </div>

            {kyc.idDocumentUrl && (
              <div className="kyc-detail">
                <span>ID Document</span>
                <a
                  href={kyc.idDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="kyc-link"
                >
                  View Document
                </a>
              </div>
            )}

            {kyc.selfieUrl && (
              <div className="kyc-detail">
                <span>Selfie</span>
                <a
                  href={kyc.selfieUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="kyc-link"
                >
                  View Selfie
                </a>
              </div>
            )}

            {kyc.rejectionReason && (
              <div className="kyc-rejection">
                <span>Rejection Reason</span>
                <strong>{kyc.rejectionReason}</strong>
              </div>
            )}

            {kyc.status === "PENDING" && (
              <div className="kyc-pending-message">
                Your KYC is under review. You will be able to
                continue once it has been reviewed.
              </div>
            )}

            {kyc.status === "VERIFIED" && (
              <div className="kyc-verified-message">
                Your identity has been verified successfully.
              </div>
            )}

            {kyc.status === "REJECTED" && (
              <div className="kyc-rejected-message">
                Your KYC was rejected. Please review the
                rejection reason and contact support.
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="text-button"
          onClick={onBack}
          disabled={submitting}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CustomerKyc;
