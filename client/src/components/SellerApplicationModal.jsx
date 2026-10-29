import React, { useState } from "react";
import { X, Store, Mail, Lock, User, Phone, MapPin, FileText, Briefcase, ArrowRight, CheckCircle, Upload, Camera, Eye, AlertTriangle, Check, Pin } from "lucide-react";
import { prepareDocument } from "../utils/documentFile";
import { checkRegistration } from "../utils/registration";

function SellerApplicationModal({ isOpen, onClose, onSubmitApplication, onOpenLogin, vendorsList = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessCategory: "Electronics",
    businessAddress: "",
    sampleDocumentId: "",
    documentFileUrl: null,
    documentFileName: ""
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleFileUpload = async (e) => {
    setErrorMessage("");
    const input = e.target;
    const file = input.files[0];
    if (!file) return;

    try {
      const doc = await prepareDocument(file); // shrinks photos, checks PDF size
      setFilePreview(doc.preview);
      setFormData((prev) => ({ ...prev, documentFileUrl: doc.dataUrl, documentFileName: doc.name }));
    } catch (err) {
      setFilePreview(null);
      setFormData((prev) => ({ ...prev, documentFileUrl: null, documentFileName: "" }));
      setErrorMessage(`${err.message}`);
    }
    input.value = ""; // lets the same file be chosen again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimEmail = formData.email.trim().toLowerCase();
    const trimPhone = formData.phone.trim();
    const trimDocId = formData.sampleDocumentId.trim();

    // 1. SECURITY MANDATORY DOCUMENT UPLOAD VALIDATION
    if (!formData.documentFileUrl) {
      setErrorMessage("Security Requirement: Business Document or Photo Upload is MANDATORY! Please attach a document file or take a photo before submitting.");
      return;
    }

    if (!trimDocId) {
      setErrorMessage("Document Ref ID Required: Please enter your GSTIN / Tax ID or Document Reference number.");
      return;
    }
        // The number must be a correctly formed GSTIN or Udyam number (the server checks again)
    const registration = checkRegistration(trimDocId);
    if (!registration.valid) {
      setErrorMessage(`${registration.message}`);
      return;
    }

    // 2. UNIQUENESS VALIDATIONS
    // Check Email Uniqueness
    const emailExists = vendorsList.some(
      (v) => v.email && v.email.toLowerCase() === trimEmail
    );
    if (emailExists) {
      setErrorMessage(`Email Already Exists: A vendor account with "${formData.email}" has already been registered! Please use a different email address or sign in.`);
      return;
    }

    // Check Phone Uniqueness
    const phoneExists = vendorsList.some(
      (v) => v.phone && v.phone.trim() === trimPhone
    );
    if (phoneExists) {
      setErrorMessage(`Phone Number Already Exists: A vendor account with phone "${formData.phone}" is already registered on ShopMate.`);
      return;
    }

    // Check Document Reference ID Uniqueness
    const docIdExists = vendorsList.some(
      (v) => v.sampleDocumentId && v.sampleDocumentId.trim().toLowerCase() === trimDocId.toLowerCase()
    );
    if (docIdExists) {
      setErrorMessage(`Document Reference ID Already Exists: The Document ID / GSTIN "${formData.sampleDocumentId}" has already been submitted by another vendor!`);
      return;
    }

    // All validations passed -> send to backend (throws with a message if email already exists etc.)
    try {
      if (onSubmitApplication) {
        await onSubmitApplication(formData);
      }
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(`${err.message}`);
    }
  };

  const handleClose = () => {
    setSubmittedSuccess(false);
    setFilePreview(null);
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      businessName: "",
      businessCategory: "Electronics",
      businessAddress: "",
      sampleDocumentId: "",
      documentFileUrl: null,
      documentFileName: ""
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="login-modal" style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {!submittedSuccess ? (
          <>
            <div className="login-modal-header" style={{ textAlign: "center" }}>
              <Store size={42} color="#2563eb" style={{ marginBottom: "8px" }} />
              <h2 style={{ fontSize: "1.6rem" }}>Become a Verified Seller on ShopMate</h2>
              <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Submit business info & mandatory document upload for Admin security verification.
              </p>
            </div>

            {/* Error Message Notification Box */}
            {errorMessage && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.85rem", borderRadius: "10px", fontSize: "13px", marginBottom: "1rem", display: "flex", alignItems: "flex-start", gap: "10px", lineHeight: "1.4" }}>
                <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontWeight: "600" }}>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Owner / Contact Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Business Email Address (Unique) *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Account Password *"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Contact Phone Number (Unique) *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="input-group">
                  <Store size={18} className="input-icon" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business / Store Name *"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Briefcase size={18} className="input-icon" />
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", background: "#fff", color: "#334155" }}
                  >
                    <option value="Electronics">Electronics & Gadgets</option>
                    <option value="Footwear">Footwear & Sports</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Mobiles">Mobiles & Accessories</option>
                    <option value="Appliances">Home & Appliances</option>
                    <option value="Beauty">Beauty & Personal Care</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  name="businessAddress"
                  placeholder="Business / Store Address *"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FileText size={18} className="input-icon" />
                <input
                  type="text"
                  name="sampleDocumentId"
                 placeholder="GSTIN (15 characters) or Udyam number *"
                  value={formData.sampleDocumentId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* MANDATORY Document File / Photo Upload Box */}
              <div 
                style={{ 
                  background: filePreview ? "#ecfdf5" : "#eff6ff", 
                  border: filePreview ? "2px dashed #059669" : "2px dashed #2563eb", 
                  borderRadius: "12px", 
                  padding: "1.1rem", 
                  marginTop: "6px", 
                  textAlign: "center" 
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: filePreview ? "#047857" : "#1e40af", marginBottom: "6px" }}>
                  <Upload size={20} />
                  <strong style={{ fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {filePreview ? (
                      <>
                        <Check size={14} /> Business Document Uploaded
                      </>
                    ) : (
                      <>
                        <Pin size={14} /> MANDATORY Business Document / Photo Upload *
                      </>
                    )}
                  </strong>
                </div>
                <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 12px" }}>
                  You MUST attach a photo or document file of your GST Certificate, Business Registration, or ID proof before submitting.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                  <label
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      padding: "0.55rem 1.2rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "bold",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Upload size={16} /> Choose File from Computer
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>

                  <label
                    style={{
                      background: "#0284c7",
                      color: "#fff",
                      padding: "0.55rem 1.2rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "bold",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Camera size={16} /> Take Photo (Camera)
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Uploaded File Live Preview */}
                {filePreview ? (
                  <div style={{ marginTop: "12px", background: "#ffffff", border: "1px solid #a7f3d0", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={filePreview} alt="Document Proof" style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                    <div style={{ textAlign: "left", flexGrow: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: "#065f46", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} /> Verified File Attached: {formData.documentFileName || "Document_Proof.jpg"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#047857" }}>Ready for Admin inspection</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: "10px", fontSize: "11px", color: "#dc2626", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <AlertTriangle size={13} /> Application submission will be blocked until a file or photo is attached.
                  </div>
                )}
              </div>

              <button type="submit" className="login-submit-btn" style={{ background: "#2563eb", marginTop: "14px" }}>
                <span>Submit Seller Application & Document</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="login-modal-footer" style={{ marginTop: "1rem" }}>
              <p>
                Already submitted an application?{" "}
                <span
                  className="toggle-auth-mode"
                  onClick={() => {
                    handleClose();
                    if (onOpenLogin) onOpenLogin();
                  }}
                >
                  Sign In to Check Application Status
                </span>
              </p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <CheckCircle size={56} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.5rem" }}>
              Application & Mandatory Document Uploaded!
            </h3>
            <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
              Your seller account for <strong>{formData.businessName}</strong> and document ID (<strong>{formData.sampleDocumentId}</strong>) have been submitted to ShopMate Admin for verification.
            </p>
            {filePreview && (
              <div style={{ marginBottom: "1.5rem", display: "inline-block", background: "#f8fafc", padding: "8px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <img src={filePreview} alt="Doc Preview" style={{ maxHeight: "120px", borderRadius: "6px" }} />
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Attached Security Proof</div>
              </div>
            )}
            <div>
              <button
                className="login-submit-btn"
                onClick={() => {
                  handleClose();
                  if (onOpenLogin) onOpenLogin();
                }}
                style={{ background: "#2563eb" }}
              >
                Sign In Now →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerApplicationModal;