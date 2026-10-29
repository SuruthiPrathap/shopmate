import React, { useState, useMemo } from "react";
import ImageUploadButton from "../components/ImageUploadButton";
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  Trash2,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  User,
  LogOut,
  FileText,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  PieChart,
  BarChart3,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Star,
  X,
  Check,
  Lock,
  Image as ImageIcon
} from "lucide-react";
import "./VendorDashboardPage.css";

function VendorDashboardPage({
  user,
  onLogout,
  allProducts = [],
  onAddProduct,
  onDeleteProduct,
  onBackToHome
}) {
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" | "financials" | "returns" | "profile"
  const [showAddForm, setShowAddForm] = useState(false);
  const [publishedAlert, setPublishedAlert] = useState(null);
  const [deletedAlert, setDeletedAlert] = useState(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form states for adding new vendor product
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Footwear");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");

  // Sample quick image picker options
  const sampleImages = [
    { label: "Sneakers / Shoes", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
    { label: "Electronics / Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
    { label: "Mobile / Gadget", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
    { label: "Apparel / Fashion", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" }
  ];

  // Dynamically resolve vendor store profile strictly for the LOGGED-IN USER
  const vendorStore = useMemo(() => {
    const ownerName = user?.name || "Merchant Owner";
    const storeName = user?.businessName || user?.vendorStoreName || user?.storeName || `${ownerName}'s Store`;
    const email = user?.email || "vendor@shopmate.com";
    const vendorId = user?.vendorId || user?.id || Date.now();
    const docId = user?.sampleDocumentId || "DOC-VERIFIED";
    const phone = user?.phone || "+91 98765 43210";
    const address = user?.businessAddress || "Hub-4, Central Commercial Complex, Mumbai";
    const category = user?.businessCategory || user?.category || "General Merchandise";

    return {
      id: vendorId,
      storeName: storeName,
      ownerName: ownerName,
      email: email,
      phone: phone,
      address: address,
      category: category,
      sampleDocumentId: docId,
      rating: 5.0,
      isVerified: true,
      registeredDate: user?.registeredDate || "2026-10-01"
    };
  }, [user]);

  // STRICT ISOLATION FILTERING: Filter products belonging ONLY to THIS logged-in vendor
  const vendorProducts = useMemo(() => {
    if (!user) return [];
    const lowerEmail = user.email ? user.email.toLowerCase() : "";
    const storeNameLower = vendorStore.storeName ? vendorStore.storeName.toLowerCase() : "";

    return allProducts.filter((p) => {
      // 1. Direct Vendor ID Match
      if (p.vendorId && String(p.vendorId) === String(vendorStore.id)) return true;
      // 2. Direct Email Match
      if (p.sellerEmail && lowerEmail && p.sellerEmail.toLowerCase() === lowerEmail) return true;
      // 3. Direct Exact Store Name Match
      if (p.sellerName && storeNameLower && p.sellerName.toLowerCase() === storeNameLower) return true;

      return false;
    });
  }, [allProducts, vendorStore, user]);

  // Filtered Inventory List based on vendor search & category select
  const filteredVendorProducts = useMemo(() => {
    return vendorProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchCategory = categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [vendorProducts, inventorySearch, categoryFilter]);

  // Financial & Inventory Profit/Loss Metrics
  const grossSalesVolume = vendorProducts.reduce((sum, p) => sum + (p.price * (p.reviewsCount || 1)), 0);
  const platformFee = Math.round(grossSalesVolume * 0.05); // 5% platform fee
  const netEarnings = Math.round(grossSalesVolume * 0.95); // 95% net payout
  const totalReturnsCount = vendorProducts.reduce((sum, p) => sum + (p.returnsCount || 0), 0);
  const totalReturnRefundLoss = vendorProducts.reduce((sum, p) => sum + ((p.returnsCount || 0) * p.price), 0);
  const netProfitLoss = netEarnings - totalReturnRefundLoss;

  // Mock Return Logs for vendor's products
  const returnLogs = useMemo(() => {
    if (vendorProducts.length === 0) return [];
    return vendorProducts
      .filter((p) => (p.returnsCount || 0) > 0)
      .map((p, idx) => ({
        id: `RET-${p.id}-${idx + 1}`,
        productName: p.name,
        category: p.category,
        refundAmount: p.price,
        reason: idx % 2 === 0 ? "Size / Fit Mismatch" : "Customer Changed Mind",
        date: "2026-10-06",
        status: "Refund Approved & Closed"
      }));
  }, [vendorProducts]);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProd = {
      id: Date.now(),
      name: newProductName,
      category: newProductCategory,
      price: Number(newProductPrice),
      originalPrice: Number(newProductPrice) * 1.5,
      discount: "33% OFF",
      rating: 5.0,
      reviewsCount: 1,
      image: newProductImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      description: newProductDesc || `High quality ${newProductName} listed by ${vendorStore.storeName}.`,
      sellerName: vendorStore.storeName,
      sellerEmail: user ? user.email : vendorStore.email,
      sellerRating: 5.0,
      vendorId: vendorStore.id,
      approvalStatus: "approved",
      returnsCount: 0,
      tag: "New Arrival"
    };

    let savedProd = newProd;
    try {
      if (onAddProduct) {
        savedProd = (await onAddProduct(newProd)) || newProd;
      }
    } catch (err) {
      alert(err.message);
      return;
    }

    setShowAddForm(false);
    setPublishedAlert(savedProd);
    setDeletedAlert(null);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductImage("");
    setNewProductDesc("");
  };

  const handleDeleteClick = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}" from ${vendorStore.storeName}?`)) {
      if (onDeleteProduct) {
        onDeleteProduct(product.id);
      }
      setDeletedAlert(`"${product.name}" has been successfully removed from your catalog.`);
      setPublishedAlert(null);
    }
  };

  return (
    <div className="vendor-portal-wrapper">
      {/* Top Seller Central Header Navigation Bar */}
      <header className="vendor-standalone-navbar">
        <div className="vendor-nav-brand">
          <div className="vendor-brand-logo">
            <Store size={26} color="#2563eb" />
          </div>
          <div>
            <h1 className="vendor-brand-title">
              Shop<span style={{ color: "#2563eb" }}>Mate</span> Seller Central
            </h1>
            <div className="vendor-store-badge">
              <ShieldCheck size={14} color="#16a34a" />
              <span>{vendorStore.storeName}</span>
            </div>
          </div>
        </div>

        <div className="vendor-nav-actions">
          <button className="vendor-action-btn btn-marketplace-exit" onClick={onBackToHome}>
            <ArrowLeft size={16} />
            <span>Marketplace</span>
          </button>
          <button
            className="vendor-action-btn"
            style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Vendor Dashboard Grid Layout (Sidebar Profile + Right Content Area) */}
      <div className="vendor-main-layout">
        
        {/* ================= LEFT SIDE PROFILE PANEL ================= */}
        <aside className="vendor-sidebar-profile">
          {/* Vendor Avatar & Header Card */}
          <div className="profile-card-header">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {vendorStore.ownerName.charAt(0).toUpperCase()}
              </div>
              <span className="online-status-dot" title="Account Active"></span>
            </div>

            <h3 className="profile-owner-name">{vendorStore.ownerName}</h3>
            <p className="profile-store-name" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Store size={14} /> {vendorStore.storeName}
            </p>

            <div className="verification-pill-badge">
              <ShieldCheck size={14} /> Official Verified Merchant
            </div>
          </div>

          {/* Detailed Merchant Information Card */}
          <div className="profile-details-list">
            <div className="detail-item">
              <span className="detail-label">Store Email</span>
              <span className="detail-value" title={vendorStore.email}>{vendorStore.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{vendorStore.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Document Ref ID</span>
              <span className="detail-value code-highlight">{vendorStore.sampleDocumentId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Store Rating</span>
              <span className="detail-value" style={{ color: "#d97706", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Star size={14} fill="#d97706" color="#d97706" /> {vendorStore.rating.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Verification Status</span>
              <span className="detail-value status-active" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle size={14} color="#16a34a" /> Active & Approved
              </span>
            </div>
          </div>

          {/* Quick Metrics Pill Summary */}
          <div className="sidebar-quick-stats">
            <div className="quick-stat-box">
              <span className="stat-num">{vendorProducts.length}</span>
              <span className="stat-lbl">Items</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-num" style={{ color: "#16a34a" }}>
                ₹{netEarnings > 9999 ? `${(netEarnings / 1000).toFixed(1)}k` : netEarnings}
              </span>
              <span className="stat-lbl">Payout</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-num" style={{ color: totalReturnsCount > 0 ? "#ef4444" : "#64748b" }}>
                {totalReturnsCount}
              </span>
              <span className="stat-lbl">Returns</span>
            </div>
          </div>

          {/* Navigation Tabs Menu */}
          <nav className="vendor-sidebar-nav">
            <button
              className={`nav-tab-btn ${activeTab === "inventory" ? "active" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              <Package size={18} />
              <span>Products & Inventory</span>
              <span className="tab-count-badge">{vendorProducts.length}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "financials" ? "active" : ""}`}
              onClick={() => setActiveTab("financials")}
            >
              <PieChart size={18} />
              <span>Profit & Loss Analysis</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "returns" ? "active" : ""}`}
              onClick={() => setActiveTab("returns")}
            >
              <RefreshCw size={18} />
              <span>Returns & Refunds</span>
              {totalReturnsCount > 0 && <span className="tab-count-badge alert">{totalReturnsCount}</span>}
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>Merchant Profile</span>
            </button>
          </nav>

          {/* Sidebar Quick Logout & Exit */}
          <div className="sidebar-footer-actions">
            <button className="sidebar-logout-btn" onClick={onLogout}>
              <LogOut size={16} />
              <span>Logout ({vendorStore.ownerName})</span>
            </button>
          </div>
        </aside>

        {/* ================= RIGHT MAIN CONTENT AREA ================= */}
        <main className="vendor-dashboard-content">
          
          {/* Top Hero Banner */}
          <div className="vendor-hero-card">
            <div className="vendor-hero-info">
              <h1>
                <Store size={28} color="#60a5fa" /> Welcome, {vendorStore.ownerName}!
              </h1>
              <p>Store: <strong>{vendorStore.storeName}</strong> • Manage products, profit/loss, and customer returns</p>
            </div>
            <button
              className="add-product-vendor-btn"
              style={{ background: "#ffffff", color: "#1e1b4b", fontWeight: "700" }}
              onClick={() => {
                setActiveTab("inventory");
                setShowAddForm(true);
              }}
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          {/* Alerts / Notices */}
          {publishedAlert && (
            <div className="vendor-alert-banner alert-success">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <CheckCircle size={24} color="#059669" />
                <div>
                  <h4 style={{ margin: 0, color: "#065f46", fontSize: "15px" }}>
                    "{publishedAlert.name}" Published to {vendorStore.storeName}!
                  </h4>
                  <p style={{ margin: 0, color: "#047857", fontSize: "13px" }}>
                    Listed under <strong>{publishedAlert.category}</strong> at ₹{publishedAlert.price.toLocaleString()}.
                  </p>
                </div>
              </div>
              <button
                className="add-product-vendor-btn"
                style={{ background: "#059669", fontSize: "12px", padding: "6px 12px" }}
                onClick={onBackToHome}
              >
                View in Marketplace →
              </button>
            </div>
          )}

          {deletedAlert && (
            <div className="vendor-alert-banner alert-delete">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Trash2 size={22} color="#dc2626" />
                <span style={{ color: "#991b1b", fontSize: "14px", fontWeight: "600" }}>{deletedAlert}</span>
              </div>
              <button
                style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}
                onClick={() => setDeletedAlert(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Dynamic Metric KPI Bar */}
          <div className="vendor-stats-grid">
            <div className="vendor-stat-card">
              <div className="vendor-stat-icon-wrapper" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <Package size={26} />
              </div>
              <div className="vendor-stat-details">
                <h4>Listed Products</h4>
                <p>
                  <span style={{ color: vendorProducts.length > 0 ? "#16a34a" : "#64748b" }}>
                    {vendorProducts.length} Items
                  </span>
                </p>
              </div>
            </div>

            <div className="vendor-stat-card">
              <div className="vendor-stat-icon-wrapper" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                <DollarSign size={26} />
              </div>
              <div className="vendor-stat-details">
                <h4>Gross Revenue</h4>
                <p>₹{grossSalesVolume.toLocaleString()}</p>
              </div>
            </div>

            <div className="vendor-stat-card">
              <div className="vendor-stat-icon-wrapper" style={{ background: "#fef3c7", color: "#d97706" }}>
                <TrendingUp size={26} />
              </div>
              <div className="vendor-stat-details">
                <h4>Net Payout (95%)</h4>
                <p style={{ color: "#16a34a" }}>₹{netEarnings.toLocaleString()}</p>
              </div>
            </div>

            <div className="vendor-stat-card">
              <div className="vendor-stat-icon-wrapper" style={{ background: netProfitLoss >= 0 ? "#ecfdf5" : "#fef2f2", color: netProfitLoss >= 0 ? "#059669" : "#dc2626" }}>
                <BarChart3 size={26} />
              </div>
              <div className="vendor-stat-details">
                <h4>Net Profit / Loss</h4>
                <p style={{ color: netProfitLoss >= 0 ? "#059669" : "#dc2626" }}>
                  ₹{netProfitLoss.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* TAB 1: PRODUCTS & INVENTORY MANAGEMENT */}
          {activeTab === "inventory" && (
            <div className="vendor-content-box">
              <div className="vendor-tab-header">
                <div>
                  <h2 className="vendor-tab-title">{vendorStore.storeName} Inventory ({vendorProducts.length} Items)</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Add, edit, or delete items listed under your merchant account.
                  </p>
                </div>
                {!showAddForm && (
                  <button className="add-product-vendor-btn" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} /> List New Item
                  </button>
                )}
              </div>

              {/* Add Product Form Box */}
              {showAddForm && (
                <div className="seller-form-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>
                      List New Product under {vendorStore.storeName}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <X size={16} /> Close
                    </button>
                  </div>

                  <form onSubmit={handleAddProductSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className="seller-form-group">
                        <label>Product Title *</label>
                        <input
                          type="text"
                          className="seller-form-input"
                          placeholder="e.g. Wireless ANC Headphones"
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="seller-form-group">
                        <label>Category *</label>
                        <select
                          className="seller-form-input"
                          value={newProductCategory}
                          onChange={(e) => setNewProductCategory(e.target.value)}
                        >
                          <option value="Footwear">Footwear</option>
                          <option value="Mobiles">Mobiles</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Appliances">Appliances</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Sports">Sports</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className="seller-form-group">
                        <label>Selling Price (₹) *</label>
                        <input
                          type="number"
                          className="seller-form-input"
                          placeholder="e.g. 2999"
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="seller-form-group">
                        <label>Product Image URL</label>
                        <input
                          type="text"
                          className="seller-form-input"
                          placeholder="https://images.unsplash.com/..."
                          value={newProductImage}
                          onChange={(e) => setNewProductImage(e.target.value)}
                        />
                      </div>
                    </div>

                    <ImageUploadButton onUploaded={setNewProductImage} />

                    {/* Quick Image Picker Options */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "6px" }}>
                        Or pick a sample image:
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {sampleImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewProductImage(img.url)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: newProductImage === img.url ? "2px solid #2563eb" : "1px solid #cbd5e1",
                              background: newProductImage === img.url ? "#eff6ff" : "#fff",
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <ImageIcon size={14} /> {img.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="seller-form-group">
                      <label>Description & Specifications</label>
                      <textarea
                        className="seller-form-input"
                        rows="2"
                        placeholder="Key features, warranty, specifications..."
                        value={newProductDesc}
                        onChange={(e) => setNewProductDesc(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                      <button type="submit" className="add-product-vendor-btn">
                        <Plus size={16} /> Publish Item to {vendorStore.storeName}
                      </button>
                      <button
                        type="button"
                        className="add-product-vendor-btn"
                        style={{ background: "#64748b" }}
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Search & Filter bar for Vendor Inventory */}
              {vendorProducts.length > 0 && (
                <div className="inventory-controls-bar">
                  <div className="search-input-box">
                    <Search size={16} color="#64748b" />
                    <input
                      type="text"
                      placeholder="Search store inventory..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                  </div>

                  <div className="category-select-box">
                    <Filter size={16} color="#64748b" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Products Data Table */}
              <table className="vendor-products-table">
                <thead>
                  <tr>
                    <th>Product Item</th>
                    <th>Category</th>
                    <th>Price & Net (95%)</th>
                    <th>Status</th>
                    <th>Returns</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorProducts.length === 0 ? (
                    /* STRICT EMPTY STATE FOR NEW VENDORS */
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
                        <div className="vendor-empty-state">
                          <div className="empty-icon-circle">
                            <Package size={48} color="#2563eb" />
                          </div>
                          <h3>{vendorStore.storeName} Catalog is Currently Empty</h3>
                          <p>
                            Welcome <strong>{vendorStore.ownerName}</strong>! Your approved vendor account is active, but you have not listed any products yet. Click below to add your first item to the marketplace.
                          </p>
                          <button
                            className="add-product-vendor-btn"
                            onClick={() => setShowAddForm(true)}
                            style={{ padding: "0.75rem 1.5rem", fontSize: "14px" }}
                          >
                            <Plus size={18} /> Add First Product to {vendorStore.storeName}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredVendorProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                        No items match your filter criteria ("{inventorySearch}").
                      </td>
                    </tr>
                  ) : (
                    filteredVendorProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "600" }}>
                          <img src={p.image} alt={p.name} className="vendor-product-img-thumb" />
                          <div>
                            <span style={{ color: "#0f172a", display: "block" }}>{p.name}</span>
                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>
                              ID: #{p.id} • Store: {p.sellerName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-tag">{p.category}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>₹{p.price.toLocaleString()}</div>
                          <div style={{ fontSize: "11px", color: "#16a34a" }}>Net: ₹{Math.round(p.price * 0.95).toLocaleString()}</div>
                        </td>
                        <td>
                          <span className="status-live-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Check size={12} /> APPROVED & LIVE
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: "600", color: (p.returnsCount || 0) > 0 ? "#ef4444" : "#64748b" }}>
                            {p.returnsCount || 0} Returns
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="delete-item-btn"
                            title="Delete product from store"
                            onClick={() => handleDeleteClick(p)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: PROFIT & LOSS ANALYSIS */}
          {activeTab === "financials" && (
            <div className="vendor-content-box">
              <div className="vendor-tab-header">
                <div>
                  <h2 className="vendor-tab-title">Profit & Loss Financial Statement</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Financial ledger, platform commission breakdown (5%), and net profitability.
                  </p>
                </div>
              </div>

              {/* Financial Overview Cards */}
              <div className="financial-summary-cards">
                <div className="fin-card">
                  <span className="fin-title">Total Gross Sales</span>
                  <span className="fin-amount">₹{grossSalesVolume.toLocaleString()}</span>
                  <span className="fin-sub">From {vendorProducts.length} listed catalog items</span>
                </div>

                <div className="fin-card">
                  <span className="fin-title">ShopMate Commission (5%)</span>
                  <span className="fin-amount" style={{ color: "#d97706" }}>- ₹{platformFee.toLocaleString()}</span>
                  <span className="fin-sub">Platform maintenance & payment gateway fee</span>
                </div>

                <div className="fin-card">
                  <span className="fin-title">Customer Return Deductions</span>
                  <span className="fin-amount" style={{ color: totalReturnRefundLoss > 0 ? "#dc2626" : "#64748b" }}>
                    - ₹{totalReturnRefundLoss.toLocaleString()}
                  </span>
                  <span className="fin-sub">{totalReturnsCount} returned item refunds</span>
                </div>

                <div className="fin-card highlight">
                  <span className="fin-title">Net Profit / Loss Balance</span>
                  <span className="fin-amount" style={{ color: netProfitLoss >= 0 ? "#059669" : "#dc2626" }}>
                    ₹{netProfitLoss.toLocaleString()}
                  </span>
                  <span className="fin-sub" style={{ fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {netProfitLoss >= 0 ? (
                      <>
                        <CheckCircle size={14} color="#16a34a" /> Profitable Account
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} color="#dc2626" /> Loss Recorded
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Profit & Loss Breakdown Table */}
              <h3 style={{ fontSize: "1.1rem", margin: "1.5rem 0 1rem", color: "#0f172a" }}>
                Financial Ledger Breakdown
              </h3>
              <table className="vendor-products-table">
                <thead>
                  <tr>
                    <th>Financial Metric</th>
                    <th>Category</th>
                    <th>Calculation / Basis</th>
                    <th style={{ textAlign: "right" }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Gross Sales Revenue</strong></td>
                    <td>Sales Income</td>
                    <td>Catalog Price × Completed Orders</td>
                    <td style={{ textAlign: "right", fontWeight: "bold", color: "#0f172a" }}>
                      + ₹{grossSalesVolume.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>ShopMate Platform Commission</strong></td>
                    <td>Operational Expense</td>
                    <td>Fixed 5% seller fee</td>
                    <td style={{ textAlign: "right", color: "#d97706", fontWeight: "bold" }}>
                      - ₹{platformFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Seller Net Payout (95%)</strong></td>
                    <td>Subtotal Earnings</td>
                    <td>Gross Sales minus 5% Fee</td>
                    <td style={{ textAlign: "right", color: "#16a34a", fontWeight: "bold" }}>
                      ₹{netEarnings.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Customer Return Refunds</strong></td>
                    <td>Return Loss</td>
                    <td>Refunds issued to buyers</td>
                    <td style={{ textAlign: "right", color: totalReturnRefundLoss > 0 ? "#dc2626" : "#64748b", fontWeight: "bold" }}>
                      - ₹{totalReturnRefundLoss.toLocaleString()}
                    </td>
                  </tr>
                  <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                    <td><strong>FINAL NET PROFIT / LOSS</strong></td>
                    <td>Net Result</td>
                    <td>Net Payout minus Return Loss</td>
                    <td style={{ textAlign: "right", fontSize: "1.1rem", color: netProfitLoss >= 0 ? "#059669" : "#dc2626" }}>
                      ₹{netProfitLoss.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: RETURNS & REFUNDS */}
          {activeTab === "returns" && (
            <div className="vendor-content-box">
              <div className="vendor-tab-header">
                <div>
                  <h2 className="vendor-tab-title">Customer Returns & Refund History</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Track returned items, return reasons, and refund status for {vendorStore.storeName}.
                  </p>
                </div>
              </div>

              {returnLogs.length === 0 ? (
                <div className="vendor-empty-state" style={{ padding: "3rem 1rem" }}>
                  <CheckCircle size={44} color="#16a34a" />
                  <h3>Zero Returns Logged!</h3>
                  <p>Congratulations! No customer returns have been recorded for {vendorStore.storeName}.</p>
                </div>
              ) : (
                <table className="vendor-products-table">
                  <thead>
                    <tr>
                      <th>Return Ticket ID</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Return Reason</th>
                      <th>Refund Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnLogs.map((log) => (
                      <tr key={log.id}>
                        <td><code>{log.id}</code></td>
                        <td style={{ fontWeight: "600", color: "#0f172a" }}>{log.productName}</td>
                        <td>{log.category}</td>
                        <td>
                          <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                            {log.reason}
                          </span>
                        </td>
                        <td style={{ fontWeight: "bold", color: "#dc2626" }}>₹{log.refundAmount.toLocaleString()}</td>
                        <td>
                          <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Check size={12} /> {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 4: MERCHANT PROFILE */}
          {activeTab === "profile" && (
            <div className="vendor-content-box">
              <div className="vendor-tab-header">
                <div>
                  <h2 className="vendor-tab-title">Merchant Store Profile & Verification</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Official ShopMate seller account details and document verification.
                  </p>
                </div>
              </div>

              <div className="profile-full-grid">
                <div className="profile-info-block">
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Store size={16} /> Store Information
                  </h4>
                  <div className="info-row">
                    <span className="info-lbl">Store Name:</span>
                    <span className="info-val"><strong>{vendorStore.storeName}</strong></span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Business Category:</span>
                    <span className="info-val">{vendorStore.category}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Store Rating:</span>
                    <span className="info-val" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Star size={14} fill="#d97706" color="#d97706" /> 5.0 / 5.0 (Verified Merchant)
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Listed Items:</span>
                    <span className="info-val">{vendorProducts.length} Products</span>
                  </div>
                </div>

                <div className="profile-info-block">
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={16} /> Account Owner Details
                  </h4>
                  <div className="info-row">
                    <span className="info-lbl">Owner Name:</span>
                    <span className="info-val">{vendorStore.ownerName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Email Address:</span>
                    <span className="info-val">{vendorStore.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Contact Phone:</span>
                    <span className="info-val">{vendorStore.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Registered Address:</span>
                    <span className="info-val">{vendorStore.address}</span>
                  </div>
                </div>

                <div className="profile-info-block" style={{ gridColumn: "1 / -1" }}>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lock size={16} /> Security & Document Verification
                  </h4>
                  <div className="info-row">
                    <span className="info-lbl">Document Reference / GSTIN:</span>
                    <span className="info-val">
                      <code className="code-highlight">{vendorStore.sampleDocumentId}</code>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Account Verification:</span>
                    <span className="info-val status-active" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle size={14} color="#16a34a" /> Approved & Live in ShopMate Network
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">Registration Date:</span>
                    <span className="info-val">{vendorStore.registeredDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Standalone Vendor Footer */}
      <footer className="vendor-standalone-footer">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Store size={14} /> <strong>ShopMate Merchant Network</strong>
          </span>
          <span style={{ margin: "0 10px", color: "#cbd5e1" }}>|</span>
          <span>Store: <strong>{vendorStore.storeName}</strong> ({vendorStore.ownerName})</span>
        </div>
        <button className="vendor-footer-btn" onClick={onBackToHome}>
          View Public Marketplace →
        </button>
      </footer>
    </div>
  );
}

export default VendorDashboardPage;