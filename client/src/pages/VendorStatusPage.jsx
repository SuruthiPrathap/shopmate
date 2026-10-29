import React from "react";
import { Clock, XCircle, ArrowLeft, LogOut, Store, ShieldCheck, Mail, Phone, FileText, Lock } from "lucide-react";
import "./VendorStatusPage.css";

function VendorStatusPage({ user, onLogout, onBackToHome }) {
  const isPending = user?.vendorStatus === "pending" || !user?.vendorStatus;
  const isRejected = user?.vendorStatus === "rejected";

  return (
    <div className="vendor-status-container">
      <header className="vendor-status-header">
        <div className="status-brand">
          <Store size={24} color="#2563eb" />
          <span>ShopMate Seller Portal</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="status-btn btn-secondary" onClick={onBackToHome}>
            <ArrowLeft size={16} />
            <span>Customer Marketplace</span>
          </button>
          <button className="status-btn btn-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="vendor-status-card">
        {isPending && (
          <>
            <div className="status-icon-wrapper pending-icon">
              <Clock size={48} color="#d97706" />
            </div>
            <span className="status-badge badge-pending" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} /> PENDING ADMIN APPROVAL
            </span>
            <h2>Your Seller Application is Under Review</h2>
            <p className="status-description">
              Thank you for applying to sell on ShopMate! Your merchant account for{" "}
              <strong>{user?.businessName || user?.name || "Your Store"}</strong> has been received and is currently being verified by our Admin team.
            </p>

            <div className="application-details-box">
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={16} /> Application Summary
              </h4>
              <div className="details-grid">
                <div>
                  <span className="detail-label">Business Name:</span>
                  <strong>{user?.businessName || "Registered Merchant"}</strong>
                </div>
                <div>
                  <span className="detail-label">Category:</span>
                  <strong>{user?.businessCategory || "General Merchandise"}</strong>
                </div>
                <div>
                  <span className="detail-label">Contact Email:</span>
                  <strong>{user?.email}</strong>
                </div>
                <div>
                  <span className="detail-label">Doc Reference:</span>
                  <strong>{user?.sampleDocumentId || "DOC-89421"}</strong>
                </div>
              </div>
            </div>

            <div className="status-notice-alert">
              <span style={{ display: "inline-flex", alignItems: "flex-start", gap: "6px" }}>
                <Lock size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Access Restriction:</strong> Product management and Seller Central features are disabled until Admin approves your application. Once approved, signing in will automatically open your Vendor Dashboard.</span>
              </span>
            </div>
          </>
        )}

        {isRejected && (
          <>
            <div className="status-icon-wrapper rejected-icon">
              <XCircle size={48} color="#dc2626" />
            </div>
            <span className="status-badge badge-rejected" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <XCircle size={14} /> APPLICATION NOT APPROVED
            </span>
            <h2>Seller Application Status: Rejected</h2>
            <p className="status-description">
              We regret to inform you that your seller application for{" "}
              <strong>{user?.businessName || "Your Store"}</strong> was not approved by ShopMate Admin at this time.
            </p>

            {user?.rejectionReason && (
              <div className="rejection-reason-box">
                <h4>Reason provided by Admin:</h4>
                <p>"{user.rejectionReason}"</p>
              </div>
            )}

            <div className="status-notice-alert" style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#991b1b" }}>
              <span>You cannot access vendor product management. If you believe this is an error or wish to re-apply with updated business details, please contact ShopMate Admin support.</span>
            </div>
          </>
        )}

        <div className="status-footer-actions">
          <button className="status-primary-action-btn" onClick={onBackToHome}>
            Browse ShopMate Marketplace →
          </button>
        </div>
      </main>
    </div>
  );
}

export default VendorStatusPage;