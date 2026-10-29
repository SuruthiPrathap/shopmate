import React, { useEffect, useState } from "react";
import { fetchAdminOrders, updateAdminOrderStatus } from "../api";

const color = { Processing: "#d97706", Shipped: "#2563eb", Delivered: "#16a34a", Cancelled: "#dc2626" };
// What the admin may change an order to (Delivered and Cancelled are final)
const NEXT = { Processing: ["Processing", "Shipped", "Delivered", "Cancelled"], Shipped: ["Shipped", "Delivered"] };

// Real orders from the database. The admin changes the status, and the customer sees it in Track order.
function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    fetchAdminOrders().then(setOrders).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const change = async (id, status) => {
    try {
      const updated = await updateAdminOrderStatus(id, status);
      setOrders((list) => list.map((o) => (o._id === id ? { ...o, orderStatus: updated.orderStatus, paymentStatus: updated.paymentStatus } : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p style={{ color: "#b91c1c" }}>{error}</p>;
  if (!orders) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p style={{ color: "#64748b" }}>No customer orders yet.</p>;

  return (
    <div className="admin-table-container">
      <div style={{ textAlign: "right", marginBottom: "8px" }}>
        <button type="button" onClick={load} style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: "6px", padding: "5px 12px", cursor: "pointer" }}>
          Refresh
        </button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const options = NEXT[o.orderStatus];
            const a = o.shippingAddress || {};
            return (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}<br /><small>{new Date(o.createdAt).toLocaleDateString("en-IN")}</small></td>
                <td>
                  {a.fullName || o.user?.name}<br />
                  <small>{a.phone} · {a.city}, {a.state} {a.zipCode}</small>
                </td>
                <td>{o.orderItems.map((i) => `${i.name} (x${i.quantity})`).join(", ")}</td>
                <td>₹{o.totalAmount.toLocaleString("en-IN")}<br /><small>{o.paymentMethod} · {o.paymentStatus}</small></td>
                <td>
                  {options ? (
                    <select value={o.orderStatus} onChange={(e) => change(o._id, e.target.value)} style={{ padding: "5px", borderRadius: "6px", border: `1px solid ${color[o.orderStatus]}`, color: color[o.orderStatus], fontWeight: 600 }}>
                      {options.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span style={{ color: color[o.orderStatus], fontWeight: 700 }}>{o.orderStatus}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;