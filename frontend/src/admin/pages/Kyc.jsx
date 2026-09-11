import { useEffect, useState } from "react";

const API_BASE_URL = "http://172.16.5.227:8081";

function Kyc({ token, onBack }) {
  const [kycRecords, setKycRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [rejectingKycId, setRejectingKycId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadKyc = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/kyc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load KYC records"
        );
      }

      setKycRecords(data);
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

  const approveKyc = async (kycId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this KYC?"
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(kycId);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/kyc/${kycId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to approve KYC"
        );
      }

      setKycRecords((currentRecords) =>
        currentRecords.map((kyc) =>
          kyc.id === kycId ? data : kyc
        )
      );

      setMessage("KYC approved successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (kycId) => {
    setRejectingKycId(kycId);
    setRejectionReason("");
    setMessage("");
  };

  const closeRejectDialog = () => {
    if (processingId) {
      return;
    }

    setRejectingKycId(null);
    setRejectionReason("");
  };

  const rejectKyc = async () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      setMessage("Rejection reason is required.");
      setMessageType("error");
      return;
    }

    if (reason.length > 500) {
      setMessage(
        "Rejection reason cannot exceed 500 characters."
      );
      setMessageType("error");
      return;
    }

    setProcessingId(rejectingKycId);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/kyc/${rejectingKycId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rejectionReason: reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reject KYC"
        );
      }

      setKycRecords((currentRecords) =>
        currentRecords.map((kyc) =>
          kyc.id === rejectingKycId ? data : kyc
        )
      );

      setMessage("KYC rejected successfully.");
      setMessageType("success");
      setRejectingKycId(null);
      setRejectionReason("");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="card">
          <h1>KYC Management</h1>
          <p className="subtitle">Loading KYC records...</p>
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
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="admin-content">
        <div className="admin-title">
          <div>
            <h1>KYC Management</h1>
            <p>Review customer KYC submissions</p>
          </div>

          <button
            className="secondary-button"
            onClick={loadKyc}
            disabled={processingId !== null}
          >
            Refresh
          </button>
        </div>

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

        <section className="admin-section">
          <h2>KYC Records</h2>

          {kycRecords.length === 0 ? (
            <div className="card">
              <p>No KYC records found.</p>
            </div>
          ) : (
            <div className="kyc-table-container">
              <table className="kyc-table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>KYC Type</th>
                    <th>ID Number</th>
                    <th>Status</th>
                    <th>Document</th>
                    <th>Selfie</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {kycRecords.map((kyc) => (
                    <tr key={kyc.id}>
                      <td>
                        <span className="kyc-customer-id">
                          {kyc.customerId}
                        </span>
                      </td>

                      <td>{kyc.kycType}</td>

                      <td>
                        {kyc.idNumber || "-"}
                      </td>

                      <td>
                        <span
                          className={`kyc-status kyc-status-${kyc.status?.toLowerCase()}`}
                        >
                          {kyc.status}
                        </span>

                        {kyc.rejectionReason && (
                          <div className="kyc-rejection-reason">
                            {kyc.rejectionReason}
                          </div>
                        )}
                      </td>

                      <td>
                        {kyc.idDocumentUrl ? (
                          <a
                            className="kyc-link"
                            href={kyc.idDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Document
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {kyc.selfieUrl ? (
                          <a
                            className="kyc-link"
                            href={kyc.selfieUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Selfie
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        <span className="kyc-date">
                          {kyc.createdAt
                            ? new Date(
                                kyc.createdAt
                              ).toLocaleString()
                            : "-"}
                        </span>
                      </td>

                      <td>
                        {kyc.status === "PENDING" ? (
                          <div className="kyc-actions">
                            <button
                              className="kyc-approve-button"
                              onClick={() =>
                                approveKyc(kyc.id)
                              }
                              disabled={
                                processingId === kyc.id
                              }
                            >
                              {processingId === kyc.id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              className="kyc-reject-button"
                              onClick={() =>
                                openRejectDialog(kyc.id)
                              }
                              disabled={
                                processingId === kyc.id
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="kyc-no-action">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {rejectingKycId && (
        <div className="kyc-modal-overlay">
          <div className="kyc-modal">
            <h2>Reject KYC</h2>

            <p>
              Please provide a reason for rejecting this
              KYC submission.
            </p>

            <textarea
              className="kyc-rejection-input"
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="Enter rejection reason"
              maxLength={500}
              rows={5}
              disabled={processingId !== null}
            />

            <div className="kyc-character-count">
              {rejectionReason.length}/500
            </div>

            <div className="kyc-modal-actions">
              <button
                className="secondary-button"
                onClick={closeRejectDialog}
                disabled={processingId !== null}
              >
                Cancel
              </button>

              <button
                className="kyc-reject-button"
                onClick={rejectKyc}
                disabled={processingId !== null}
              >
                {processingId !== null
                  ? "Rejecting..."
                  : "Reject KYC"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kyc;