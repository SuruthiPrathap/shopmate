import React, { useState } from "react";
import { X, CheckCircle, MessageCircle, Banknote, Smartphone } from "lucide-react";
import { createOrderRequest } from "../api";
import { getSizeOptions } from "../utils/sizes";
import Confetti from "./Confetti";

const EMPTY = { fullName: "", phone: "", street: "", city: "", state: "", zipCode: "" };
const UPI_PATTERN = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// One checkout for both "Buy Now" (one product) and the cart (many products).
function CheckoutModal({ isOpen, onClose, items = [], user, onOrderPlaced }) {
  const [form, setForm] = useState({ ...EMPTY, fullName: user?.name || "", phone: user?.phone || "" });
  const [lines, setLines] = useState(() => items.map((i) => ({ qty: i.quantity || 1, size: i.size || "" })));
  const [payment, setPayment] = useState("COD");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, it, i) => s + it.price * (lines[i]?.qty || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setLine = (i, patch) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (let i = 0; i < items.length; i++) {
      if (getSizeOptions(items[i]) && !lines[i].size) {
        setError(`Please select a size for ${items[i].name}`);
        return;
      }
    }

    if (payment === "UPI" && !UPI_PATTERN.test(upiId.trim())) {
      setError("Please enter a valid UPI ID, like name@okhdfcbank");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((it, i) => ({ id: it.id, quantity: lines[i].qty, size: lines[i].size }));
      const data = await createOrderRequest(orderItems, form, payment, upiId.trim());
      setResult({
        orderNumber: data.orderNumber,
        total: data.data.totalAmount,
        payment: data.data.paymentMethod,
        upiId: data.data.upiId,
        whatsappUrl: data.whatsappUrl,
      });
      onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const input = { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" };
  const payBox = (value) => ({
    display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
    border: `2px solid ${payment === value ? "#2563eb" : "#e2e8f0"}`, background: payment === value ? "#eff6ff" : "#fff",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" style={{ maxWidth: "540px", maxHeight: "92vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>

        {result ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <Confetti />
            <CheckCircle size={56} color="#16a34a" />
            <h2 style={{ margin: "10px 0 4px" }}>Order placed! 🎉</h2>
            <p style={{ color: "#475569", margin: "0 0 4px" }}>Order number <strong>#{result.orderNumber}</strong></p>

            {result.payment === "UPI" ? (
              <>
                <p style={{ color: "#475569", margin: "0 0 4px" }}>
                  Amount: <strong>{inr(result.total)}</strong> via UPI
                </p>
                <p style={{ color: "#475569", margin: "0 0 6px", fontSize: "14px" }}>
                  UPI ID: <strong>{result.upiId}</strong> · Payment status: Pending
                </p>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 14px" }}>
                  Demo store: no real money is taken.
                </p>
              </>
            ) : (
              <p style={{ color: "#475569", margin: "0 0 16px" }}>
                Pay <strong>{inr(result.total)}</strong> in cash when your order is delivered.
              </p>
            )}

            {result.whatsappUrl && (
              <div>
                <a
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#25d366", color: "#fff", padding: "12px 20px", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}
                >
                  <MessageCircle size={18} /> Confirm order on WhatsApp
                </a>
              </div>
            )}
            <div style={{ marginTop: "14px" }}>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 12px" }}>Checkout</h2>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gap: "8px" }}>
                {items.map((it, i) => {
                  const sizeOptions = getSizeOptions(it);
                  return (
                    <div key={it.id} style={{ display: "flex", gap: "10px", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px" }}>
                      <img src={it.image} alt={it.name} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>{it.name}</div>
                        <div style={{ fontSize: "13px", color: "#475569" }}>{inr(it.price)}</div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                          {sizeOptions && (
                            <select
                              value={lines[i].size}
                              onChange={(e) => setLine(i, { size: e.target.value })}
                              style={{ padding: "4px 6px", borderRadius: "6px", border: `1px solid ${lines[i].size ? "#cbd5e1" : "#f59e0b"}`, fontSize: "13px" }}
                            >
                              <option value="">Select size *</option>
                              {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          )}
                          <select
                            value={lines[i].qty}
                            onChange={(e) => setLine(i, { qty: Number(e.target.value) })}
                            style={{ padding: "4px 6px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          >
                            {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => <option key={n} value={n}>Qty {n}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <input style={input} placeholder="Full name *" value={form.fullName} onChange={set("fullName")} required />
              <input style={input} placeholder="Phone number (10 digits) *" value={form.phone} onChange={set("phone")} required inputMode="numeric" />
              <input style={input} placeholder="Address (house no, street, area) *" value={form.street} onChange={set("street")} required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input style={input} placeholder="City *" value={form.city} onChange={set("city")} required />
                <input style={input} placeholder="State *" value={form.state} onChange={set("state")} required />
              </div>
              <input style={input} placeholder="Pincode (6 digits) *" value={form.zipCode} onChange={set("zipCode")} required inputMode="numeric" />

              <div style={{ display: "grid", gap: "8px" }}>
                <strong style={{ fontSize: "14px" }}>Payment method</strong>
                <label style={payBox("COD")}>
                  <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                  <Banknote size={18} />
                  <span style={{ fontSize: "14px" }}><strong>Cash on Delivery</strong><br /><small style={{ color: "#64748b" }}>Pay when you receive the order</small></span>
                </label>
                <label style={payBox("UPI")}>
                  <input type="radio" name="payment" checked={payment === "UPI"} onChange={() => setPayment("UPI")} />
                  <Smartphone size={18} />
                  <span style={{ fontSize: "14px" }}><strong>UPI</strong><br /><small style={{ color: "#64748b" }}>Enter your own UPI ID (GPay, PhonePe, Paytm...)</small></span>
                </label>
                {payment === "UPI" && (
                  <input
                    style={input}
                    placeholder="Your UPI ID (example: name@okhdfcbank) *"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    autoComplete="off"
                  />
                )}
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Items</span><span>{inr(subtotal)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>{shipping === 0 ? "FREE" : inr(shipping)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: "6px" }}><span>Total</span><span>{inr(total)}</span></div>
              </div>

              <button type="submit" disabled={loading} className="login-submit-btn" style={{ background: "#2563eb", opacity: loading ? 0.7 : 1 }}>
                <span>{loading ? "Placing order..." : "Place Order"}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;