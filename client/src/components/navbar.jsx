import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ShoppingBag, User, Heart, X, ChevronDown, Package, LogOut, TrendingUp, Star, Sparkles, Filter, Store } from "lucide-react";
import { parseSmartSearch } from "../utils/nlpSearch";

function Navbar({ 
  searchQuery = "", 
  onSearchChange, 
  allProducts = [],
  cartCount = 0, 
  wishlistCount = 0,
  onOpenCart, 
  onOpenLogin,
  onOpenSellerModal,
  onResetFilter,
  user = null,
  onLogout,
  onNavigateToProfile,
  onNavigateToWishlist,
  onNavigateToAdmin,
  onNavigateToProduct,
  onNavigateToCategory,
  onNavigateToStores,
  onNavigateToVendorPortal
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoToProfile = () => {
    setIsProfileOpen(false);
    if (onNavigateToProfile) onNavigateToProfile();
  };

  const handleGoToWishlist = () => {
    setIsProfileOpen(false);
    if (onNavigateToWishlist) onNavigateToWishlist();
  };

  // Smart NLP Search Intent Parsing
  const searchNLP = useMemo(() => {
    return parseSmartSearch(searchQuery, allProducts);
  }, [searchQuery, allProducts]);

  const liveSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchNLP.filteredProducts.slice(0, 5);
  }, [searchNLP, searchQuery]);

  const parsedIntent = searchNLP.parsedIntent;

  const trendingSearches = [
    { text: "iPhone 15 Pro Max", categoryKey: "Mobiles" },
    { text: "Nike Running Shoes", categoryKey: "Footwear" },
    { text: "Sony ANC Headphones", categoryKey: "Electronics" },
    { text: "Air Fryer XL", categoryKey: "Appliances" },
    { text: "Smartwatches", categoryKey: "Mobiles" }
  ];

  const handleSelectProductSuggestion = (product) => {
    setIsSearchFocused(false);
    if (onNavigateToProduct) onNavigateToProduct(product);
  };

  const handleSelectTrending = (term, catKey) => {
    if (onSearchChange) onSearchChange(term);
    setIsSearchFocused(false);
    if (catKey && onNavigateToCategory) onNavigateToCategory(catKey);
  };

  // Dynamic Flipkart Rotating Search Placeholder
  const placeholderTexts = useMemo(() => [
    "Search for Products, Brands & More",
    "Search for 'shoes under 4000'",
    "Search for '5G phone'",
    "Search for 'iPhone 15 Pro'",
    "Search for 'best rated headphones'",
    "Search for 'Nike running shoes'"
  ], []);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholderTexts]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={onResetFilter} role="button" tabIndex={0}>
          <ShoppingBag className="logo-icon" size={26} color="#2874f0" />
          <span className="logo-text">Shop<span className="logo-highlight">Mate</span></span>
        </div>
      </div>

      {/* Smart Flipkart Search Bar with NLP */}
      <div className="navbar-search" ref={searchRef}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder={isSearchFocused ? "Search for Products, Brands & More" : placeholderTexts[placeholderIndex]}
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <X 
            size={16} 
            className="search-clear" 
            onClick={() => onSearchChange && onSearchChange("")} 
          />
        )}

        {/* Flipkart Interactive Suggestions & NLP Intent Dropdown */}
        {isSearchFocused && (
          <div className="search-suggestions-dropdown">
            {/* Parsed NLP Intent Pill Notice */}
            {parsedIntent && (parsedIntent.maxPrice || parsedIntent.detectedCategory || parsedIntent.detectedBrand || parsedIntent.minRating) && (
              <div className="search-intent-banner">
                <Sparkles size={14} color="#2874f0" />
                <span>Smart Filter Active:</span>
                {parsedIntent.maxPrice && <span className="intent-tag">Price ≤ ₹{parsedIntent.maxPrice.toLocaleString()}</span>}
                {parsedIntent.detectedCategory && <span className="intent-tag">Cat: {parsedIntent.detectedCategory}</span>}
                {parsedIntent.detectedBrand && <span className="intent-tag">Brand: {parsedIntent.detectedBrand}</span>}
                {parsedIntent.minRating && <span className="intent-tag">{parsedIntent.minRating}★+ Rated</span>}
              </div>
            )}

            {/* Empty Search: Show Trending Searches */}
            {!searchQuery.trim() && (
              <div className="trending-searches-box">
                <div className="suggestions-header">
                  <TrendingUp size={14} color="#2874f0" />
                  <span>Trending on ShopMate</span>
                </div>
                <div className="trending-chips-row">
                  {trendingSearches.map((item, idx) => (
                    <button
                      key={idx}
                      className="trending-chip-btn"
                      onClick={() => handleSelectTrending(item.text, item.categoryKey)}
                    >
                      <Search size={12} />
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typed Search: Show Live Matching Products */}
            {searchQuery.trim() !== "" && (
              <div className="live-products-suggestions">
                <div className="suggestions-header">
                  <Search size={14} color="#2874f0" />
                  <span>Matching Products ({searchNLP.filteredProducts.length} Found)</span>
                </div>

                {liveSuggestions.length === 0 ? (
                  <div className="no-suggestion-item">
                    <Filter size={16} color="#94a3b8" />
                    <span>No exact product match found for "{searchQuery}"</span>
                  </div>
                ) : (
                  liveSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      className="suggestion-product-row"
                      onClick={() => handleSelectProductSuggestion(prod)}
                    >
                      <img src={prod.image} alt={prod.name} className="suggestion-thumb" />
                      <div className="suggestion-info">
                        <h5 className="suggestion-title">{prod.name}</h5>
                        <div className="suggestion-meta">
                          <span className="suggestion-cat">{prod.category}</span>
                          <div className="suggestion-rating">
                            <span>{prod.rating}</span>
                            <Star size={10} fill="#fff" color="#fff" />
                          </div>
                        </div>
                      </div>
                      <div className="suggestion-price">
                        <span>₹{prod.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Subtle Become a Seller button for public users or buyers */}
        {(!user || (user.role !== "admin" && user.role !== "vendor")) && (
          <button 
            className="become-seller-nav-btn"
            onClick={onOpenSellerModal}
            title="Become a Seller on ShopMate"
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#2563eb",
              padding: "0.45rem 0.85rem",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <Store size={16} color="#2563eb" />
            <span>Become a Seller</span>
          </button>
        )}

        {/* Vendor Quick Portal Switcher Button */}
        {user && user.role === "vendor" && (
          <button 
            className="become-seller-nav-btn"
            onClick={onNavigateToVendorPortal}
            title="Go to Seller Central Vendor Dashboard"
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#059669",
              padding: "0.45rem 0.85rem",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <Store size={16} color="#059669" />
            <span>Vendor Dashboard</span>
          </button>
        )}

        <div 
          className="navbar-action-item" 
          title="Wishlist"
          onClick={handleGoToWishlist}
          role="button"
          tabIndex={0}
        >
          <Heart size={20} />
          <span className="action-label">Wishlist</span>
          {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
        </div>

        <div className="navbar-action-item cart-action" onClick={onOpenCart} role="button" tabIndex={0} title="Shopping Cart">
          <ShoppingBag size={20} />
          <span className="action-label">Cart</span>
          {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
        </div>

        {user ? (
          <div className="navbar-profile-wrapper" ref={profileRef}>
            <button className="navbar-profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="profile-avatar-badge">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="profile-name">{user.name}</span>
              <ChevronDown size={14} className={`chevron-icon ${isProfileOpen ? "open" : ""}`} />
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-user-header" onClick={handleGoToProfile} style={{ cursor: "pointer" }}>
                  <div className="dropdown-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                  <div className="dropdown-user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    {user.role === "admin" && (
                      <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "bold" }}>● Admin Account</span>
                    )}
                    {user.role === "vendor" && (
                      <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "bold" }}>
                        ● Vendor ({user.vendorStatus === "approved" ? "Verified" : "Pending"})
                      </span>
                    )}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleGoToProfile}>
                  <User size={16} />
                  <span>My Profile</span>
                </div>
                <div className="dropdown-item" onClick={handleGoToProfile}>
                  <Package size={16} />
                  <span>My Orders</span>
                </div>
                <div className="dropdown-item" onClick={handleGoToWishlist}>
                  <Heart size={16} />
                  <span>Wishlist ({wishlistCount})</span>
                </div>

                {user.role !== "admin" && user.role !== "vendor" && (
                  <div 
                    className="dropdown-item" 
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onOpenSellerModal) onOpenSellerModal();
                    }}
                    style={{ color: "#2563eb", fontWeight: "600" }}
                  >
                    <Store size={16} color="#2563eb" />
                    <span>Apply for Seller Account</span>
                  </div>
                )}

                {(user.role === "vendor" || user.role === "seller" || user.role === "admin") && (
                  <div className="dropdown-item" onClick={() => { setIsProfileOpen(false); if (onNavigateToVendorPortal) onNavigateToVendorPortal(); }}>
                    <Store size={16} color="#2563eb" />
                    <span>Vendor Store Portal</span>
                  </div>
                )}

                {user.role === "admin" && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div 
                      className="dropdown-item" 
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onNavigateToAdmin) onNavigateToAdmin();
                      }}
                      style={{ color: "#38bdf8", fontWeight: "600" }}
                    >
                      <Sparkles size={16} color="#38bdf8" />
                      <span>Admin Control Panel</span>
                    </div>
                  </>
                )}

                <div className="dropdown-divider"></div>
                <div 
                  className="dropdown-item logout-item" 
                  onClick={() => { 
                    setIsProfileOpen(false); 
                    if (onLogout) onLogout(); 
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-login-btn" onClick={onOpenLogin}>
            <User size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;