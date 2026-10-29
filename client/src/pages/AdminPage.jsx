import React, { useState, useEffect } from "react";
import AdminOrders from "../components/AdminOrders";
import SellerDocumentViewer from "../components/SellerDocumentViewer";
import { fetchAdminStats } from "../api";
import ImageUploadButton from "../components/ImageUploadButton";
import {
  ShieldCheck,
  Package,
  BarChart2,
  Users,
  ShoppingBag,
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  Search,
  ArrowLeft,
  Store,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Bell,
  X,
  Eye,
  FileText,
  IndianRupee,
  ShoppingCart,
  Zap,
  Star,
  ArrowRight,
  XCircle
} from "lucide-react";
import "./AdminPage.css";

// Small icon + text layout used by the status badges
const pillStyle = { display: "inline-flex", alignItems: "center", gap: "4px" };

function AdminPage({
  user,
  onLogout,
  onBackToHome,
  onNavigateToVendorPortal,
  initialProducts = [],
  onUpdateProductsList,
  vendorsList = [],
  onApproveVendorAccount,
  onRevokeVendorAccount,
  onCreateProduct,
  onDeleteProduct
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "products" | "vendor-approvals" | "orders"
  const [productsList, setProductsList] = useState(initialProducts);
  const [searchFilter, setSearchFilter] = useState("");
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [viewingDocVendor, setViewingDocVendor] = useState(null);

  // Real numbers from the database for the Overview tab
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  useEffect(() => {
    if (activeTab !== "overview") return;
    fetchAdminStats()
      .then((s) => { setStats(s); setStatsError(false); })
      .catch(() => setStatsError(true));
  }, [activeTab]);
  const statValue = (pick) => (statsError ? "—" : stats ? pick(stats) : "...");
  const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  const updateProductsListAndNotify = (newList) => {
    setProductsList(newList);
    if (onUpdateProductsList) {
      onUpdateProductsList(newList);
    }
  };

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Footwear",
    subcategory: "Men's Running",
    price: "",
    originalPrice: "",
    discount: "20% OFF",
    stock: 50,
    image: "",
    description: "",
    tag: "Trending",
  });

  // Dynamic Statistics & Notifications
  const totalProductsCount = productsList.length;
  const pendingApprovalsCount = productsList.filter((p) => p.approvalStatus === "pending").length;
  const pendingVendors = vendorsList.filter((v) => v.approvalStatus === "pending");

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    let productToAdd = {
      ...newProduct,
      id: Date.now(),
      price: Number(newProduct.price),
      originalPrice: Math.round(Number(newProduct.originalPrice || newProduct.price * 1.5)),
      stock: Number(newProduct.stock) || 50,
      rating: 4.5,
      reviewsCount: 0,
      approvalStatus: "approved"
    };
    if (onCreateProduct) {
      try {
        const { id, approvalStatus, ...fields } = productToAdd;
        productToAdd = await onCreateProduct(fields); // saved in the database
      } catch (err) {
        alert(err.message);
        return;
      }
    }
    const updated = [productToAdd, ...productsList];
    updateProductsListAndNotify(updated);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      category: "Footwear",
      subcategory: "Men's Running",
      price: "",
      originalPrice: "",
      discount: "20% OFF",
      stock: 50,
      image: "",
      description: "",
      tag: "Trending",
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product from the platform?")) {
      if (onDeleteProduct) {
        try {
          await onDeleteProduct(id);
        } catch (err) {
          alert(err.message);
          return;
        }
      }
      const updated = productsList.filter((item) => item.id !== id);
      updateProductsListAndNotify(updated);
    }
  };

  const filteredProducts = productsList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="admin-portal-wrapper">
      {/* Standalone Admin Top Navigation Bar */}
      <header className="admin-standalone-navbar">
        <div className="admin-nav-brand">
          <div className="admin-brand-logo">
            <ShieldCheck size={26} color="#0284c7" />
          </div>
          <div>
            <h1 className="admin-brand-title">
              Shop<span style={{ color: "#0284c7" }}>Mate</span> Admin Panel
            </h1>
            <div className="admin-system-status">
              <span className="status-dot"></span>
              <span>System Online • v2.4 Enterprise</span>
            </div>
          </div>
        </div>

        {/* Portal Quick Switch & User Actions */}
        <div className="admin-nav-actions">
          {/* Notification Bell with Badge */}
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setActiveTab("vendor-approvals")}
            title="Pending Approvals Notifications"
          >
            <div style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
              <Bell size={18} color="#0284c7" />
            </div>
            {pendingVendors.length > 0 && (
              <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px", border: "2px solid #ffffff" }}>
                {pendingVendors.length}
              </span>
            )}
          </div>

          <button className="admin-action-btn btn-store-exit" onClick={onBackToHome}>
            <ArrowLeft size={16} />
            <span>Storefront</span>
          </button>

          <div className="admin-user-pill" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={16} color="#0284c7" />
            <div style={{ textAlign: "left" }}>
              <span style={{ fontWeight: "bold", display: "block", fontSize: "12px", color: "#0284c7" }}>{user ? user.name : "ShopMate Admin"}</span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>{user ? user.email : "admin@shopmate.com"}</span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "0.55rem 0.95rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold"
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Page Container */}
      <div className="admin-page-container">
        {/* Real-Time Admin Pending Vendor Notification Popup Banner */}
        {pendingVendors.length > 0 && showNotificationBanner && (
          <div style={{ background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "1px solid #c7d2fe", borderRadius: "14px", padding: "1.1rem 1.5rem", marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px rgba(99, 102, 241, 0.12)", color: "#1e1b4b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #a5b4fc", width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={22} color="#4f46e5" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1e1b4b", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Bell size={16} /> New Vendor Account Approval Request Received!
                  </h4>
                  <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                    Action Required
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#3730a3" }}>
                  You have <strong>{pendingVendors.length} vendor store account(s)</strong> waiting for Admin authorization: {" "}
                  <strong style={{ color: "#0284c7" }}>{pendingVendors.map((v) => v.storeName).join(", ")}</strong>.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setActiveTab("vendor-approvals")}
                style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", transition: "background 0.2s" }}
              >
                <CheckCircle size={16} /> Review & Approve Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setShowNotificationBanner(false)}
                style={{ background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", padding: "4px" }}
                title="Dismiss Notification"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
        {/* Navigation Tabs Bar */}
        <nav className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 size={18} />
            <span>Analytics Overview</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} />
            <span>Products Catalog ({totalProductsCount})</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "vendor-approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("vendor-approvals")}
          >
            <Store size={18} />
            <span>Vendor Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="pending-badge">{pendingApprovalsCount}</span>
            )}
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={18} />
            <span>Customer Orders</span>
          </button>
        </nav>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="admin-overview-section">
            <div className="admin-overview-grid">
              <div className="admin-stat-card stat-purple">
                <div className="stat-icon" style={{ display: "flex", alignItems: "center" }}><IndianRupee size={34} color="#7c3aed" /></div>
                <div className="stat-info">
                  <span className="stat-label">Revenue (Delivered Orders)</span>
                  <h3 className="stat-value">{statValue((s) => money(s.totalRevenue))}</h3>
                </div>
              </div>

              <div className="admin-stat-card stat-blue">
                <div className="stat-icon" style={{ display: "flex", alignItems: "center" }}><Package size={34} color="#2563eb" /></div>
                <div className="stat-info">
                  <span className="stat-label">Active Catalog Products</span>
                  <h3 className="stat-value">{statValue((s) => s.totalProducts.toLocaleString("en-IN"))}</h3>
                </div>
              </div>

              <div className="admin-stat-card stat-green">
                <div className="stat-icon" style={{ display: "flex", alignItems: "center" }}><ShoppingCart size={34} color="#16a34a" /></div>
                <div className="stat-info">
                  <span className="stat-label">Total Customer Orders</span>
                  <h3 className="stat-value">{statValue((s) => s.totalOrders.toLocaleString("en-IN"))}</h3>
                </div>
              </div>

              <div className="admin-stat-card stat-orange">
                <div className="stat-icon" style={{ display: "flex", alignItems: "center" }}><Users size={34} color="#ea580c" /></div>
                <div className="stat-info">
                  <span className="stat-label">Registered Shoppers</span>
                  <h3 className="stat-value">{statValue((s) => s.totalCustomers.toLocaleString("en-IN"))}</h3>
                </div>
              </div>
            </div>

            {/* Quick System Health Box */}
            <div className="admin-health-box">
              <div className="health-header">
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Zap size={18} color="#f59e0b" /> Platform Health & Activity Summary</h3>
                <span className="health-tag">All Systems Normal</span>
              </div>
              <div className="health-metrics">
                <div className="metric-item">
                  <span className="metric-label">Vendor Verification Backlog</span>
                  <span className="metric-value" style={{ color: pendingVendors.length > 0 ? "#f59e0b" : "#10b981" }}>
                    {pendingVendors.length} Sellers Pending
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Orders Waiting To Ship</span>
                  <span className="metric-value">{statValue((s) => s.pendingOrders)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Database Status</span>
                  <span className="metric-value" style={{ color: statsError ? "#ef4444" : "#10b981" }}>
                    {statsError ? "Unreachable" : stats ? "Connected" : "Checking..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="admin-products-section">
            <div className="admin-controls-bar">
              <div className="admin-search-wrapper">
                <Search size={18} className="search-icon-inside" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search products by name, category or vendor..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              <button className="admin-add-btn" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        <img src={product.image} alt={product.name} className="admin-thumb" />
                        <div>
                          <strong>{product.name}</strong>
                          <div className="sub-text">{product.subcategory || product.category}</div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{product.price.toLocaleString("en-IN")}</td>
                      <td><span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Star size={14} fill="#f59e0b" color="#f59e0b" /> {product.rating}</span></td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VENDOR APPROVALS TAB */}
        {activeTab === "vendor-approvals" && (
          <div className="admin-orders-section">
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Store size={22} color="#0284c7" /> Vendor Store Account Verification & Authorizations
              </h3>
              <p className="sub-text">Admin authorization required before vendor stores can log into Seller Central and manage inventory.</p>

              <div className="admin-table-container" style={{ marginTop: "1rem" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Seller Name</th>
                      <th>Email & Phone</th>
                      <th>Business Name</th>
                      <th>Category & Address</th>
                      <th>Doc ID & Uploaded Proof</th>
                      <th>Application Status</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorsList.map((v) => {
                      const status = v.approvalStatus || v.vendorStatus || "pending";
                      const docUrl = v.documentFileUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&q=80";
                      return (
                        <tr key={v.id || v._id}>
                          <td>
                            <strong style={{ color: "#0f172a", fontSize: "14px" }}>{v.ownerName || v.name || "Merchant"}</strong>
                            <div className="sub-text">ID: #{v.id || (v._id ? v._id.slice(-6) : "101")}</div>
                          </td>
                          <td>
                            <strong>{v.email}</strong>
                            <div className="sub-text">{v.phone || "Phone: +91 9876543210"}</div>
                          </td>
                          <td>
                            <strong style={{ color: "#0284c7" }}>{v.businessName || v.storeName}</strong>
                          </td>
                          <td>
                            <div>{v.category || v.businessCategory || "General Store"}</div>
                            <div className="sub-text">{v.businessAddress || "Mumbai Commerce Hub"}</div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                              <code style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", color: "#4338ca" }}>
                                {v.sampleDocumentId || "DOC-89421"}
                              </code>
                              <button
                                onClick={() => setViewingDocVendor(v)}
                                style={{
                                  background: "#f0f9ff",
                                  border: "1px solid #0284c7",
                                  color: "#0284c7",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  fontWeight: "bold",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                <Eye size={12} /> View File Proof
                              </button>
                            </div>
                          </td>
                          <td>
                            {status === "pending" && (
                              <span className="status-pill status-processing" style={pillStyle}><Clock size={13} /> Pending Approval</span>
                            )}
                            {status === "approved" && (
                              <span className="status-pill status-delivered" style={pillStyle}><CheckCircle size={13} /> Approved</span>
                            )}
                            {status === "rejected" && (
                              <span className="status-pill" style={{ ...pillStyle, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                                <XCircle size={13} /> Rejected
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {status !== "approved" && (
                                <button
                                  style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                  onClick={() => {
                                    if (onApproveVendorAccount) onApproveVendorAccount(v.id || v._id);
                                  }}
                                >
                                  <CheckCircle size={14} /> Approve
                                </button>
                              )}

                              {status !== "rejected" && (
                                <button
                                  style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                  onClick={() => {
                                    if (onRevokeVendorAccount) onRevokeVendorAccount(v.id || v._id);
                                  }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Admin Document Inspector Lightbox Modal */}
              {viewingDocVendor && (
                <div 
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.5)",
                    backdropFilter: "blur(6px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                  }}
                  onClick={() => setViewingDocVendor(null)}
                >
                  <div 
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      maxWidth: "700px",
                      width: "100%",
                      padding: "1.5rem",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                      position: "relative",
                      maxHeight: "calc(100vh - 2rem)",
                      overflowY: "auto"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setViewingDocVendor(null)}
                      style={{
                        position: "sticky",
                        top: "8px",
                        float: "right",
                        zIndex: 5,
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        background: "#f1f5f9",
                        border: "none",
                        color: "#64748b",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={18} />
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                      <FileText size={24} color="#0284c7" />
                      <div>
                        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.2rem" }}>
                          Merchant Document Verification Inspector
                        </h3>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>
                          Uploaded document proof for <strong>{viewingDocVendor.storeName || viewingDocVendor.businessName}</strong>
                        </p>
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1rem", textAlign: "center", marginBottom: "1.2rem" }}>
                      <SellerDocumentViewer key={viewingDocVendor.id || viewingDocVendor._id} vendor={viewingDocVendor} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f1f5f9", padding: "1rem", borderRadius: "10px", fontSize: "13px", color: "#334155" }}>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Merchant Name:</span>
                        <strong style={{ color: "#0f172a" }}>{viewingDocVendor.ownerName || viewingDocVendor.name || "Vendor Applicant"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Business / Store:</span>
                        <strong style={{ color: "#0284c7" }}>{viewingDocVendor.storeName || viewingDocVendor.businessName}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Document Reference ID:</span>
                        <code style={{ color: "#4338ca", fontWeight: "bold" }}>{viewingDocVendor.sampleDocumentId || "DOC-VERIFIED"}</code>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Category & Contact:</span>
                        <span>{viewingDocVendor.category || viewingDocVendor.businessCategory} • {viewingDocVendor.phone || "Verified"}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button
                        onClick={() => setViewingDocVendor(null)}
                        style={{ background: "#e2e8f0", color: "#334155", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Close Inspector
                      </button>

                      {viewingDocVendor.approvalStatus !== "approved" && (
                        <button
                          onClick={() => {
                            if (onApproveVendorAccount) onApproveVendorAccount(viewingDocVendor.id || viewingDocVendor._id);
                            setViewingDocVendor(null);
                          }}
                          style={{ background: "#16a34a", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <CheckCircle size={16} /> Approve Merchant Document & Activate Store
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Package size={22} color="#0284c7" /> Vendor Product Listing Approvals
              </h3>
              <p className="sub-text">Review and publish individual product listings submitted by verified vendors.</p>

              <div className="admin-table-container" style={{ marginTop: "1rem" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vendor / Store</th>
                      <th>Product Listing</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <strong>{prod.sellerName || "Independent Vendor"}</strong>
                          <div className="sub-text" style={{ display: "flex", alignItems: "center", gap: "3px" }}>Rating: {prod.sellerRating || 4.8} <Star size={11} fill="#f59e0b" color="#f59e0b" /></div>
                        </td>
                        <td className="product-cell">
                          <img src={prod.image} alt={prod.name} className="admin-thumb" />
                          <div>
                            <strong>{prod.name}</strong>
                            <div className="sub-text">ID: #{prod.id}</div>
                          </div>
                        </td>
                        <td>{prod.category}</td>
                        <td>₹{prod.price.toLocaleString("en-IN")}</td>
                        <td>
                          {prod.approvalStatus === "pending" ? (
                            <span className="status-pill status-processing" style={pillStyle}><Clock size={13} /> Pending Approval</span>
                          ) : (
                            <span className="status-pill status-delivered" style={pillStyle}><CheckCircle size={13} /> Approved & Live</span>
                          )}
                        </td>
                        <td>
                          {prod.approvalStatus === "pending" ? (
                            <button
                              style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
                              onClick={() => {
                                const updated = productsList.map((p) =>
                                  p.id === prod.id ? { ...p, approvalStatus: "approved" } : p
                                );
                                updateProductsListAndNotify(updated);
                                alert(`Product "${prod.name}" approved by Admin!`);
                              }}
                            >
                              <CheckCircle size={16} /> Approve & Publish
                            </button>
                          ) : (
                            <button
                              style={{ background: "#e11d48", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                              onClick={() => {
                                const updated = productsList.map((p) =>
                                  p.id === prod.id ? { ...p, approvalStatus: "pending" } : p
                                );
                                updateProductsListAndNotify(updated);
                              }}
                            >
                              Revoke Approval
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="admin-orders-section">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={22} color="#0284c7" /> Recent Customer Orders
              </h3>
              <p className="sub-text">Manage order fulfillments and delivery status across all vendor stores.</p>
            </div>

            <AdminOrders />
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <h3>Add New Product to Marketplace</h3>
              <form onSubmit={handleCreateProduct}>
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter product title..."
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />

                <div className="form-row">
                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Subcategory</label>
                    <input
                      type="text"
                      required
                      value={newProduct.subcategory}
                      onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Original Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <label>Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <ImageUploadButton onUploaded={(url) => setNewProduct((prev) => ({ ...prev, image: url }))} />

                <label>Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter key details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Create & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Standalone Admin Footer */}
      <footer className="admin-standalone-footer">
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Zap size={14} color="#f59e0b" /> <strong>ShopMate Enterprise Admin Operations</strong></span>
          <span style={{ margin: "0 10px", color: "#cbd5e1" }}>|</span>
          <span>Security & Compliance Verified</span>
        </div>
        <button className="admin-footer-btn" onClick={onBackToHome}>
          Return to Customer Storefront <ArrowRight size={14} style={{ verticalAlign: "-2px" }} />
        </button>
      </footer>
    </div>
  );
}

export default AdminPage;