import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "../api";

// "Upload photo" button: sends the file to the backend (Cloudinary) and returns the image link.
function ImageUploadButton({ onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ margin: "6px 0 10px" }}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "6px", border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
      >
        <Upload size={14} />
        {busy ? "Uploading..." : "Upload photo from device"}
      </button>
      {error && <p style={{ color: "#b91c1c", fontSize: "12px", margin: "6px 0 0" }}>{error}</p>}
    </div>
  );
}

export default ImageUploadButton;
