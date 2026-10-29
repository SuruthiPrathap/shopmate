import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Store, AlertTriangle, CheckCircle } from "lucide-react";
import { loginRequest, registerCustomer, registerSellerRequest } from "../api";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isRegisteringVendor, setIsRegisteringVendor] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setStoreName("");
    setIsRegisteringVendor(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      let user;
      if (!isSignUp) {
        // Sign in (same endpoint for customer, vendor and admin - role decides the page)
        user = await loginRequest(cleanEmail, password);
      } else if (isRegisteringVendor) {
        user = await registerSellerRequest({
          name: name.trim(),
          email: cleanEmail,
          password,
          businessName: storeName.trim(),
        });
      } else {
        user = await registerCustomer({ name: name.trim(), email: cleanEmail, password });
      }

      onLoginSuccess(user);
      resetForm();
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="login-modal" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleCloseModal}>
          <X size={20} />
        </button>

        <div className="login-modal-header" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
            {isSignUp ? "Create ShopMate Account" : "Sign In to ShopMate"}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {isSignUp
              ? "Sign up to start buying or selling on ShopMate"
              : "Enter your email address and password to continue"}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.75rem", borderRadius: "8px", fontSize: "13px", marginTop: "1rem", marginBottom: "1rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successMessage && (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem", borderRadius: "8px", fontSize: "13px", marginTop: "1rem", marginBottom: "1rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <CheckCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: "1.2rem" }}>
          {isSignUp && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password *"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Sign Up Option: Register as Vendor Checkbox & Store Name */}
          {isSignUp && (
            <div style={{ margin: "6px 0 12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155", cursor: "pointer", fontWeight: "600" }}>
                <input
                  type="checkbox"
                  checked={isRegisteringVendor}
                  onChange={(e) => setIsRegisteringVendor(e.target.checked)}
                />
                <span>🏬 Register as Vendor / Store Owner</span>
              </label>

              {isRegisteringVendor && (
                <div className="input-group" style={{ marginTop: "10px" }}>
                  <Store size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Store / Business Name (e.g. Apex Store)"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required={isRegisteringVendor}
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
            style={{ background: "#2563eb", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
          >
            <span>
              {loading
                ? "Please wait..."
                : isSignUp
                ? (isRegisteringVendor ? "Register Vendor Account" : "Create Account")
                : "Sign In"}
            </span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-modal-footer">
          <p>
            {isSignUp ? "Already have an account?" : "New to ShopMate?"}{" "}
            <span 
              className="toggle-auth-mode" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
