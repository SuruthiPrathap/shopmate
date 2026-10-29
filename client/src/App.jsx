import React, { useState, useMemo, useEffect } from "react";
import Navbar from "./components/navbar";
import CategoryIconsRow from "./components/CategoryIconsRow";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import AdminPage from "./pages/AdminPage";
import StoresPage from "./pages/StoresPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import VendorStatusPage from "./pages/VendorStatusPage";
import InfoPage from "./pages/InfoPage";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import SellerApplicationModal from "./components/SellerApplicationModal";
import CheckoutModal from "./components/CheckoutModal";
import initialProductsData from "./data/products";

import { parseSmartSearch } from "./utils/nlpSearch";
import {
  getToken,
  clearToken,
  fetchMe,
  fetchSellers,
  approveSellerRequest,
  rejectSellerRequest,
  registerSellerRequest,
  isMongoId,
  fetchProducts,
  createVendorProduct,
  deleteVendorProductRequest,
  createAdminProduct,
  deleteAdminProductRequest,
} from "./api";

import "./App.css";

function App() {
  const [productsList, setProductsList] = useState(initialProductsData);
  const [vendorsList, setVendorsList] = useState([
    { id: 1, storeName: "Nike Official Store", email: "nike@vendor.com", approvalStatus: "approved", vendorStatus: "approved", category: "Footwear & Sportswear", ownerName: "Nike Vendor" },
    { id: 2, storeName: "Apple Authorised Reseller", email: "apple@vendor.com", approvalStatus: "approved", vendorStatus: "approved", category: "Mobiles & Laptops", ownerName: "Apple Reseller" },
    { id: 3, storeName: "Samsung Galaxy Experience", email: "samsung@vendor.com", approvalStatus: "approved", vendorStatus: "approved", category: "Mobiles & Smart Home", ownerName: "Samsung Official" },
    { id: 4, storeName: "Puma India Direct", email: "puma@vendor.com", approvalStatus: "approved", vendorStatus: "approved", category: "Footwear & Activewear", ownerName: "Puma India" },
    { id: 5, storeName: "Sony Audio & Vision Flagship", email: "sony@vendor.com", approvalStatus: "approved", vendorStatus: "approved", category: "Electronics & Headphones", ownerName: "Sony Official" },
    { id: 6, storeName: "Apex Electronics Store", email: "apex@vendor.com", approvalStatus: "pending", vendorStatus: "pending", category: "Electronics", ownerName: "Apex Seller", registeredDate: "2026-10-05" }
  ]);
  const [currentView, setCurrentView] = useState("home"); // "home" | "category" | "product" | "profile" | "wishlist" | "stores" | "vendor-dashboard" | "vendor-status" | "admin"
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [infoTopic, setInfoTopic] = useState("help"); // which footer page is open
  const [profileTab, setProfileTab] = useState("info"); // which tab the profile page opens on
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutFromCart, setCheckoutFromCart] = useState(false);
  const [checkoutKey, setCheckoutKey] = useState(0); // new key = fresh checkout form each time

  // Admin: approve a seller (saved in the database for real accounts)
  const handleApproveVendorAccount = async (vendorId) => {
    try {
      if (isMongoId(vendorId)) await approveSellerRequest(vendorId);
      setVendorsList((prev) =>
        prev.map((v) =>
          v.id === vendorId || v._id === vendorId
            ? { ...v, approvalStatus: "approved", vendorStatus: "approved" }
            : v
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin: reject / revoke a seller
  const handleRevokeVendorAccount = async (vendorId) => {
    try {
      if (isMongoId(vendorId)) await rejectSellerRequest(vendorId);
      setVendorsList((prev) =>
        prev.map((v) =>
          v.id === vendorId || v._id === vendorId
            ? { ...v, approvalStatus: "rejected", vendorStatus: "rejected" }
            : v
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // "Become a Seller" form -> creates a pending vendor account in the database.
  // Throws on error so the modal can show the message (e.g. email already exists).
  const handleRegisterVendorAccount = async (form) => {
    await registerSellerRequest(form);
    clearToken(); // they must sign in; the old flow also asked the seller to sign in after applying
  };

  // Load products from the database (falls back to the built-in demo list if the server is unreachable)
  useEffect(() => {
    fetchProducts()
      .then((list) => { if (list.length) setProductsList(list); })
      .catch((err) => console.warn("Using demo products:", err.message));
  }, []);

  // Restore login after page refresh (token saved in the browser)
  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then((me) => setUser(me))
      .catch(() => clearToken()); // expired / invalid token
  }, []);

  // Admin: load real seller applications from the database
  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchSellers()
      .then((real) =>
        setVendorsList((prev) => [...real, ...prev.filter((v) => !isMongoId(v.id))])
      )
      .catch((err) => console.error("Could not load sellers:", err.message));
  }, [user]);

  // Filter products using NLP Smart Search parser
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return productsList;
    return parseSmartSearch(searchQuery, productsList).filteredProducts;
  }, [searchQuery, productsList]);

  // Vendor adds a product -> saved in the database. Throws so the dashboard can show the error.
  const handleAddVendorProduct = async (p) => {
    const saved = await createVendorProduct({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: Math.round(p.originalPrice || p.price),
      discount: p.discount,
      image: p.image,
      description: p.description,
      tag: p.tag,
    });
    setProductsList((prev) => [saved, ...prev]);
    return saved;
  };

  const handleDeleteVendorProduct = async (productId) => {
    try {
      if (isMongoId(productId)) await deleteVendorProductRequest(productId);
      setProductsList((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin: create / delete any product in the database
  const handleAdminCreateProduct = async (fields) => {
    const saved = await createAdminProduct(fields);
    setProductsList((prev) => [saved, ...prev]);
    return saved;
  };

  const handleAdminDeleteProduct = async (productId) => {
    if (isMongoId(productId)) await deleteAdminProductRequest(productId);
    setProductsList((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
  };

  const handleRateProduct = (productId, newRating, reviewText = "") => {
    setProductsList((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId || p._id === productId) {
          const currentCount = Number(p.reviewsCount) || 0;
          const currentRating = Number(p.rating) || 4.5;
          const totalPoints = currentRating * currentCount + Number(newRating);
          const newCount = currentCount + 1;
          const updatedAvg = Math.round((totalPoints / newCount) * 10) / 10;

          const newReview = {
            id: Date.now(),
            userName: user ? user.name : "Verified Buyer",
            rating: Number(newRating),
            comment: reviewText || "Great quality product! Highly recommended.",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            verified: true
          };

          const userReviews = [newReview, ...(p.userReviews || [])];

          return {
            ...p,
            rating: updatedAvg,
            reviewsCount: newCount,
            userReviews
          };
        }
        return p;
      })
    );
  };

  // Page Navigation Handlers
  const handleNavigateToHome = () => {
    setCurrentView("home");
    setActiveCategory("All");
    setSelectedProduct(null);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToCategory = (catKey) => {
    setActiveCategory(catKey);
    setCurrentView("category");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   const handleNavigateToProfile = () => {
    setProfileTab("info");
    setCurrentView("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    // Footer pages: Help Center, Returns, Shipping, Privacy, Terms, Security
  const handleNavigateToInfo = (topic) => {
    setInfoTopic(topic);
    setCurrentView("info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Footer "Track Order": opens My Orders (asks to sign in first)
  const handleTrackOrder = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (user.role === "admin" || user.role === "vendor") {
      alert("Order tracking is for customer accounts. Please sign in as a customer.");
      return;
    }
    setProfileTab("orders");
    setCurrentView("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToWishlist = () => {
    setCurrentView("wishlist");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToAdmin = () => {
    setCurrentView("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToStores = () => {
    setCurrentView("stores");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToVendorPortal = () => {
    if (user && user.role === "vendor") {
      if (user.vendorStatus === "approved") {
        setCurrentView("vendor-dashboard");
      } else {
        setCurrentView("vendor-status");
      }
    } else {
      setCurrentView("vendor-dashboard");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleToggleWishlist = (productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Post-login redirect. The backend already decided the role and vendor status.
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);

    if (userData.role === "admin") {
      setCurrentView("admin");
    } else if (userData.role === "vendor") {
      setCurrentView(userData.vendorStatus === "approved" ? "vendor-dashboard" : "vendor-status");
    } else {
      setCurrentView("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Opens the checkout for the cart or for one product ("Buy Now").
  // Needs a customer login and products that come from the database.
  const openCheckout = (items, fromCart) => {
    if (!user) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }
    if (user.role === "admin" || user.role === "vendor") {
      alert("Please sign in with a customer account to place an order.");
      return;
    }
    if (items.some((i) => !isMongoId(i.id))) {
      alert("These items are demo products. Please refresh the page and try again.");
      return;
    }
    setCheckoutItems(items);
    setCheckoutFromCart(fromCart);
    setCheckoutKey((k) => k + 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckout = () => openCheckout(cartItems, true);
  const handleBuyNow = (product, size) => openCheckout([{ ...product, quantity: 1, size: size || "" }], false);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isPortalView = currentView === "admin" || currentView === "vendor-dashboard" || currentView === "vendor-status";

  return (
    <div className="app">
      {/* Customer Header & Category Navbar - Hidden on Admin and Vendor Portal Views */}
      {!isPortalView && (
        <>
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q && currentView !== "home") setCurrentView("home");
            }}
            allProducts={productsList}
            cartCount={cartCount}
            wishlistCount={wishlistIds.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenSellerModal={() => setIsSellerModalOpen(true)}
            onResetFilter={handleNavigateToHome}
            user={user}
            onLogout={handleLogout}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToWishlist={handleNavigateToWishlist}
            onNavigateToAdmin={handleNavigateToAdmin}
            onNavigateToProduct={handleNavigateToProduct}
            onNavigateToCategory={handleNavigateToCategory}
            onNavigateToStores={handleNavigateToStores}
            onNavigateToVendorPortal={handleNavigateToVendorPortal}
          />

          <CategoryIconsRow
            selectedCategory={activeCategory}
            onSelectCategory={(cat) => {
              if (cat === "All") {
                handleNavigateToHome();
              } else {
                handleNavigateToCategory(cat);
              }
            }}
          />
        </>
      )}

      {/* Page Routing Views */}
      <main className={isPortalView ? "portal-main-content" : "main-content"}>
        {currentView === "home" && (
          <HomePage
            onNavigateToCategory={handleNavigateToCategory}
            onNavigateToProduct={handleNavigateToProduct}
            products={searchedProducts}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {currentView === "category" && (
          <CategoryPage
            key={activeCategory || "All"}
            categoryKey={activeCategory || "All"}
            allProducts={productsList}
            onBackToHome={handleNavigateToHome}
            onNavigateToProduct={handleNavigateToProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {currentView === "product" && (
          <ProductDetailPage
            product={productsList.find((p) => (p.id === selectedProduct?.id || p._id === selectedProduct?._id)) || selectedProduct}
            onBack={() => setCurrentView(activeCategory !== "All" ? "category" : "home")}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
            onRateProduct={handleRateProduct}
            user={user}
          />
        )}

        {currentView === "profile" && (
                    <ProfilePage
            key={profileTab}
            initialTab={profileTab}
            user={user}
            onUpdateUser={setUser}
            onBackToHome={handleNavigateToHome}
          />
        )}

                {currentView === "info" && (
          <InfoPage topic={infoTopic} onBackToHome={handleNavigateToHome} />
        )}

        {currentView === "wishlist" && (
          <WishlistPage
            wishlistIds={wishlistIds}
            allProducts={productsList}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToProduct={handleNavigateToProduct}
            onBackToHome={handleNavigateToHome}
          />
        )}

        {currentView === "admin" && (
          <AdminPage
            user={user}
            onLogout={handleLogout}
            onBackToHome={handleNavigateToHome}
            onNavigateToVendorPortal={handleNavigateToVendorPortal}
            initialProducts={productsList}
            onUpdateProductsList={setProductsList}
            vendorsList={vendorsList}
            onApproveVendorAccount={handleApproveVendorAccount}
            onRevokeVendorAccount={handleRevokeVendorAccount}
            onCreateProduct={handleAdminCreateProduct}
            onDeleteProduct={handleAdminDeleteProduct}
          />
        )}

        {currentView === "stores" && (
          <StoresPage
            allProducts={productsList}
            vendorsList={vendorsList}
            onNavigateToProduct={handleNavigateToProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpenVendorPortal={handleNavigateToVendorPortal}
            onBackToHome={handleNavigateToHome}
          />
        )}

        {currentView === "vendor-dashboard" && (
          <VendorDashboardPage
            user={user}
            onLogout={handleLogout}
            allProducts={productsList}
            onAddProduct={handleAddVendorProduct}
            onDeleteProduct={handleDeleteVendorProduct}
            onBackToHome={handleNavigateToHome}
          />
        )}

        {currentView === "vendor-status" && (
          <VendorStatusPage
            user={user}
            onLogout={handleLogout}
            onBackToHome={handleNavigateToHome}
          />
        )}
      </main>

      {/* Customer Footer - Hidden on Admin and Vendor Portal Views */}
            {!isPortalView && (
        <Footer
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
          onNavigateToCategory={handleNavigateToCategory}
          onNavigateToInfo={handleNavigateToInfo}
          onTrackOrder={handleTrackOrder}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        key={checkoutKey}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems}
        user={user}
        onOrderPlaced={() => {
          if (checkoutFromCart) setCartItems([]); // "Buy Now" keeps the cart as it is
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SellerApplicationModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onSubmitApplication={handleRegisterVendorAccount}
        onOpenLogin={() => setIsLoginOpen(true)}
        vendorsList={vendorsList}
      />
    </div>
  );
}

export default App;