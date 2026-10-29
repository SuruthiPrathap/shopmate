import React, { useState, useMemo } from "react";
import vendorsData from "../data/vendors";
import ProductCard from "../components/ProductCard";
import { Store, Star, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft } from "lucide-react";
import "./StoresPage.css";

function StoresPage({
  allProducts = [],
  vendorsList = [],
  onNavigateToProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenVendorPortal,
  onBackToHome
}) {
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Dynamically merge static vendor directory with newly registered / active vendor stores
  const displayVendors = useMemo(() => {
    const list = [...vendorsData];
    vendorsList.forEach((dynVendor) => {
      const exists = list.some(
        (v) =>
          v.id === dynVendor.id ||
          (v.storeName && dynVendor.storeName && v.storeName.toLowerCase() === dynVendor.storeName.toLowerCase()) ||
          (v.email && dynVendor.email && v.email.toLowerCase() === dynVendor.email.toLowerCase())
      );
      if (!exists) {
        const storeTitle = dynVendor.storeName || dynVendor.businessName || `${dynVendor.ownerName || 'Vendor'}'s Store`;
        list.push({
          id: dynVendor.id || Date.now(),
          storeName: storeTitle,
          logo: dynVendor.logo || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&q=80",
          banner: dynVendor.banner || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80",
          category: dynVendor.category || dynVendor.businessCategory || "General Store",
          rating: dynVendor.rating || 5.0,
          reviewsCount: dynVendor.reviewsCount || 1,
          isVerified: dynVendor.approvalStatus === "approved" || dynVendor.vendorStatus === "approved" || dynVendor.isVerified !== false,
          description: dynVendor.description || `Official store of ${storeTitle}. Quality products & express delivery.`,
          sellerLocation: dynVendor.sellerLocation || dynVendor.businessAddress || "Mumbai Hub",
          email: dynVendor.email
        });
      }
    });
    return list;
  }, [vendorsList]);

  const vendorProducts = selectedVendor
    ? allProducts.filter(
        (p) =>
          p.vendorId === selectedVendor.id ||
          (p.sellerEmail && selectedVendor.email && p.sellerEmail.toLowerCase() === selectedVendor.email.toLowerCase()) ||
          (p.sellerName && selectedVendor.storeName && p.sellerName.toLowerCase() === selectedVendor.storeName.toLowerCase()) ||
          (p.sellerName && selectedVendor.storeName && p.sellerName.toLowerCase().includes(selectedVendor.storeName.split(" ")[0].toLowerCase()))
      )
    : [];

  return (
    <div className="stores-page-container">
      {/* Top Breadcrumbs / Back button */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="back-btn-pill" onClick={selectedVendor ? () => setSelectedVendor(null) : onBackToHome}>
          <ArrowLeft size={16} />
          <span>{selectedVendor ? "Back to All Stores" : "Back to Home"}</span>
        </button>
      </div>

      {!selectedVendor ? (
        <>
          {/* Hero Banner for Stores Directory */}
          <div className="stores-header-banner">
            <div className="stores-header-text">
              <h1>
                <Store size={28} color="#60a5fa" /> Official Brand Stores & Vendors
              </h1>
              <p>
                Shop directly from verified brand flagships and trusted independent sellers with full warranty & express shipping.
              </p>
            </div>

            <button className="become-seller-cta-btn" onClick={onOpenVendorPortal}>
              <span>Become a Seller</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Vendors Grid */}
          <div className="stores-grid">
            {displayVendors.map((vendor) => (
              <div key={vendor.id} className="store-card">
                <img src={vendor.banner} alt={vendor.storeName} className="store-banner-img" />
                <div className="store-card-body">
                  <img src={vendor.logo} alt={vendor.storeName} className="store-logo-img" />
                  <div className="store-title-row">
                    <h3 className="store-name">{vendor.storeName}</h3>
                    {vendor.isVerified && (
                      <span className="verified-badge-pill">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <span className="store-category-tag">{vendor.category}</span>
                  <p className="store-description">{vendor.description}</p>

                  <div className="store-metrics-row">
                    <div className="store-metric-item">
                      <span className="metric-label">Seller Rating</span>
                      <span className="metric-value">
                        {vendor.rating} <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      </span>
                    </div>

                    <div className="store-metric-item">
                      <span className="metric-label">Location</span>
                      <span className="metric-value" style={{ fontSize: "12px" }}>
                        {vendor.sellerLocation.split("/")[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    className="visit-store-btn"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <span>Visit Store Catalog</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Single Vendor Store Page View */
        <div className="vendor-store-detail-view">
          <div className="stores-header-banner" style={{ backgroundImage: `url(${selectedVendor.banner})`, backgroundSize: 'cover' }}>
            <div className="stores-header-text" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                <img
                  src={selectedVendor.logo}
                  alt={selectedVendor.storeName}
                  style={{ width: "70px", height: "70px", borderRadius: "12px", border: "3px solid #fff" }}
                />
                <div>
                  <h1 style={{ fontSize: "2.2rem" }}>{selectedVendor.storeName}</h1>
                  <span className="verified-badge-pill">
                    <ShieldCheck size={12} /> Official Brand Flagship
                  </span>
                </div>
              </div>
              <p style={{ color: "#f1f5f9" }}>{selectedVendor.description}</p>
            </div>
          </div>

          <div className="catalog-header-row" style={{ marginTop: "1.5rem" }}>
            <h2>Store Products ({vendorProducts.length})</h2>
          </div>

          <div className="flipkart-products-grid" style={{ marginTop: "1rem" }}>
            {vendorProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onSelectProduct={onNavigateToProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoresPage;
