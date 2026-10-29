import React, { useEffect, useState } from "react";
import { Check, XCircle } from "lucide-react";
import { fetchMyOrders, cancelOrderRequest } from "../api";

const CANCEL_WINDOW_HOURS = 24;
const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];
const STEP_INDEX = { Processing: 1, Shipped: 2, Delivered: 3 }; // "Order Placed" is always done
const statusColor = { Processing: "#d97706", Shipped: "#2563eb", Delivered: "#16a34a", Cancelled: "#dc2626" };

const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// Can this order still be cancelled? (only while Processing, and within 24 hours)
function cancelInfo(order) {
  if (order.orderStatus !== "Processing") return { canCancel: false, hoursLeft: 0 };
  const hoursLeft = CANCEL_WINDOW_HOURS - (Date.now() - new Date(order.createdAt).getTime()) / 36e5;
  return { canCancel: hoursLeft > 0, hoursLeft };
}

// Date of each step, taken from the order history (the first step uses the order date)
function stepTime(order, step) {
  if (step === "Order Placed") return order.createdAt;
  const hit = (order.statusHistory || []).find((h) => h.status === step);
  return hit ? hit.at : step === "Processing" ? order.createdAt : null;
}

function Tracker({ order }) {
  if (order.orderStatus === "Cancelled") {
    return (
      <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
        <XCircle size={16} /> This order was cancelled{order.cancelledAt ? ` on ${fmt(order.cancelledAt)}` : ""}.
      </div>
    );
  }
  const current = STEP_INDEX[order.orderStatus] ?? 1;
  return (
    <div style={{ display: "flex", gap: "4px", padding: "6px 0" }}>
      {STEPS.map((step, i) => {
        const done = i <= current;
        const time = done ? stepTime(order, step) : null;
        return (
          <div key={step} style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, height: "3px", background: i === 0 ? "transparent" : done ? "#16a34a" : "#e2e8f0" }} />
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: done ? "#16a34a" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done ? <Check size={14} strokeWidth={3} /> : null}
              </div>
              <div style={{ flex: 1, height: "3px", background: i === STEPS.length - 1 ? "transparent" : i < current ? "#16a34a" : "#e2e8f0" }} />
            </div>
            <div style={{ fontSize: "12px", fontWeight: done ? 700 : 500, color: done ? "#0f172a" : "#94a3b8", marginTop: "4px" }}>{step}</div>
            {time && <div style={{ fontSize: "10px", color: "#64748b" }}>{fmt(time)}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Real order history from the database, with tracking and a Cancel button
function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState({}); // which orders show the tracker
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState({});

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  const handleCancel = async (order) => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    setBusyId(order._id);
    setRowError((r) => ({ ...r, [order._id]: "" }));
    try {
      const updated = await cancelOrderRequest(order._id);
      setOrders((list) => list.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setRowError((r) => ({ ...r, [order._id]: err.message }));
    } finally {
      setBusyId(null);
    }
  };

  if (error) return <p style={{ color: "#b91c1c" }}>{error}</p>;
  if (!orders) return <p>Loading your orders...</p>;
  if (orders.length === 0) return <p style={{ color: "#64748b" }}>You have not placed any orders yet.</p>;

  return (
    <div className="orders-mock-list">
      {orders.map((o) => {
        const { canCancel, hoursLeft } = cancelInfo(o);
        const btn = { border: "1px solid", borderRadius: "6px", padding: "6px 12px", fontWeight: 600, fontSize: "13px", cursor: "pointer", background: "#fff" };
        return (
          <div className="mock-order-card" key={o._id}>
            <div className="order-card-header">
              <span className="order-id">Order #{o._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">
                Placed on {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            {o.orderItems.map((it, idx) => (
              <div className="order-card-body" key={idx}>
                <img src={it.image} alt={it.name} className="order-prod-img" />
                <div className="order-prod-info">
                  <h4>{it.name}</h4>
                  <p className="order-price">₹{it.price.toLocaleString("en-IN")} × {it.quantity}{it.size ? ` · Size ${it.size}` : ""}</p>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", fontWeight: 700 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: statusColor[o.orderStatus] || "#475569" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: statusColor[o.orderStatus] || "#475569" }} />
                {o.orderStatus}
              </span>
              <span>Total ₹{o.totalAmount.toLocaleString("en-IN")} ({o.paymentMethod === "UPI" ? `UPI · ${o.paymentStatus}` : "Cash on Delivery"})</span>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", padding: "0 14px 10px" }}>
              <button
                type="button"
                style={{ ...btn, borderColor: "#2563eb", color: "#2563eb" }}
                onClick={() => setOpen((s) => ({ ...s, [o._id]: !s[o._id] }))}
              >
                {open[o._id] ? "Hide tracking" : "Track order"}
              </button>

              {canCancel && (
                <>
                  <button
                    type="button"
                    disabled={busyId === o._id}
                    style={{ ...btn, borderColor: "#dc2626", color: "#dc2626", opacity: busyId === o._id ? 0.6 : 1 }}
                    onClick={() => handleCancel(o)}
                  >
                    {busyId === o._id ? "Cancelling..." : "Cancel order"}
                  </button>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    You can cancel for {Math.max(1, Math.ceil(hoursLeft))} more hour{Math.ceil(hoursLeft) > 1 ? "s" : ""}
                  </span>
                </>
              )}
              {o.orderStatus === "Processing" && !canCancel && (
                <span style={{ fontSize: "12px", color: "#64748b" }}>Cancellation window (24 hours) is over</span>
              )}
              {o.orderStatus === "Shipped" && (
                <span style={{ fontSize: "12px", color: "#64748b" }}>Shipped orders can no longer be cancelled</span>
              )}
            </div>

            {rowError[o._id] && <p style={{ color: "#b91c1c", fontSize: "13px", padding: "0 14px 10px", margin: 0 }}>{rowError[o._id]}</p>}
            {open[o._id] && <div style={{ padding: "0 14px 14px" }}><Tracker order={o} /></div>}
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;