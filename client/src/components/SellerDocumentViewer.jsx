import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { fetchSellerDocument, verifySellerRegistrationRequest, isMongoId } from "../api";

const DEMO_DOC = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&q=80";

// Official government pages where anyone can look up a registration number
const PORTALS = {
  GST: { name: "GST portal - Search Taxpayer", url: "https://services.gst.gov.in/services/searchtp" },
  Udyam: { name: "Udyam portal - Verify", url: "https://udyamregistration.gov.in/Udyam_Verify.aspx" },
};

// Turns the saved data URL into a temporary link the browser can show (works for images and PDFs)
const toBlobUrl = (dataUrl) => {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { url: URL.createObjectURL(new Blob([bytes], { type: mime })), isPdf: mime === "application/pdf" };
};

const row = { display: "flex", justifyContent: "space-between", gap: "12px", padding: "4px 0", fontSize: "13px" };

// What the admin must do before approving: check the number on the official portal, then confirm here
function RegistrationPanel({ vendor }) {
  const id = vendor.id || vendor._id;
  const info = vendor.registrationInfo;
  const portal = PORTALS[vendor.registrationType];
  const [verified, setVerified] = useState(Boolean(vendor.registrationVerified));
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!vendor.registrationNumber) {
    return (
      <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "12px", borderRadius: "8px", fontSize: "13px", textAlign: "left", marginTop: "12px" }}>
        This application has no registration number (it was sent before this check existed). It cannot be verified or approved. Ask the seller to apply again.
      </div>
    );
  }

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(vendor.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* copy is only a convenience */
    }
  };

  const markVerified = async () => {
    setBusy(true);
    setError("");
    try {
      await verifySellerRegistrationRequest(id);
      setVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", textAlign: "left", marginTop: "12px" }}>
      <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#0f172a" }}>Business registration check</h4>

      <div style={row}><span style={{ color: "#64748b" }}>Number</span><code style={{ fontWeight: 700, color: "#4338ca" }}>{vendor.registrationNumber}</code></div>
      <div style={row}><span style={{ color: "#64748b" }}>Type</span><span>{vendor.registrationType === "GST" ? "GSTIN" : "Udyam registration"}</span></div>
      {info?.state && <div style={row}><span style={{ color: "#64748b" }}>State</span><span>{info.state}</span></div>}
      {info?.pan && <div style={row}><span style={{ color: "#64748b" }}>PAN inside GSTIN</span><code>{info.pan}</code></div>}
      {info?.entity && <div style={row}><span style={{ color: "#64748b" }}>Business type</span><span>{info.entity}</span></div>}
      <div style={row}>
        <span style={{ color: "#64748b" }}>Format and check character</span>
        <span style={{ fontWeight: 700, color: info?.valid ? "#16a34a" : "#dc2626", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          {info?.valid ? <CheckCircle size={15} /> : <XCircle size={15} />} {info?.valid ? "Valid" : "Not valid"}
        </span>
      </div>

      <p style={{ background: "#f1f5f9", borderRadius: "6px", padding: "8px 10px", fontSize: "12px", color: "#475569", margin: "8px 0" }}>
        A valid format only proves the number is written correctly. It does <strong>not</strong> prove the shop is real. Look the number up on the official portal and check that it is <strong>Active</strong> and the name matches <strong>{vendor.businessName || vendor.storeName}</strong>.
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
        <button type="button" onClick={copyNumber} style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
          {copied ? "Copied!" : "Copy number"}
        </button>
        {portal && (
          <a href={portal.url} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid #0284c7", background: "#f0f9ff", color: "#0284c7", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            Open {portal.name} <ExternalLink size={13} />
          </a>
        )}
      </div>

      {verified ? (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle size={16} /> Checked on the official portal. You can approve this seller now.
        </div>
      ) : (
        <>
          <label style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: "3px" }} />
            <span>I checked this number on the official portal: it exists, it is active, and the name matches.</span>
          </label>
          <button
            type="button"
            disabled={!confirmed || busy}
            onClick={markVerified}
            style={{ marginTop: "8px", background: confirmed ? "#16a34a" : "#cbd5e1", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontWeight: 700, fontSize: "13px", cursor: confirmed ? "pointer" : "not-allowed" }}
          >
            {busy ? "Saving..." : "Mark as verified"}
          </button>
          {error && <p style={{ color: "#b91c1c", fontSize: "12px", margin: "6px 0 0" }}>{error}</p>}
        </>
      )}
    </div>
  );
}

// Shows the document a seller uploaded, plus the registration check. Real sellers load from the database.
function SellerDocumentViewer({ vendor }) {
  const id = vendor.id || vendor._id;
  const real = isMongoId(id);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(real);
  const blobRef = useRef(null);

  useEffect(() => {
    if (!real) return;
    let cancelled = false;
    fetchSellerDocument(id)
      .then((d) => {
        if (cancelled) return;
        const { url, isPdf } = toBlobUrl(d.dataUrl);
        blobRef.current = url;
        setDoc({ url, isPdf, fileName: d.fileName });
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [id, real]);

  if (!real) {
    return (
      <>
        <img src={DEMO_DOC} alt="Sample document" style={{ maxWidth: "100%", maxHeight: "380px", borderRadius: "8px", objectFit: "contain" }} />
        <p style={{ fontSize: "12px", color: "#64748b", margin: "8px 0 0" }}>Sample document (demo seller)</p>
      </>
    );
  }

  return (
    <>
      {loading && <p style={{ color: "#64748b" }}>Loading document...</p>}
      {error && (
        <p style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px", borderRadius: "8px", fontSize: "13px", margin: 0 }}>
          {error}
        </p>
      )}
      {doc && (
        <>
          {doc.isPdf ? (
            <iframe src={doc.url} title="Seller document" style={{ width: "100%", height: "380px", border: 0, borderRadius: "8px" }} />
          ) : (
            <img src={doc.url} alt="Seller document" style={{ maxWidth: "100%", maxHeight: "380px", borderRadius: "8px", objectFit: "contain" }} />
          )}
          <p style={{ fontSize: "12px", color: "#475569", margin: "8px 0 0" }}>
            {doc.fileName || "document"} ·{" "}
            <a href={doc.url} download={doc.fileName || "document"} style={{ color: "#0284c7", fontWeight: 700 }}>
              Download
            </a>
          </p>
        </>
      )}
      <RegistrationPanel vendor={vendor} />
    </>
  );
}

export default SellerDocumentViewer;