import React, { useState } from "react";
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, RotateCcw, Heart, Check, Zap, Store, MessageSquare } from "lucide-react";
import { getProductGallery } from "../utils/productGallery";
import { getSizeOptions } from "../utils/sizes";

function ProductDetailPage({ 
  product, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onToggleWishlist, 
  isWishlisted,
  onRateProduct,
  user
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Manual Star Rating & Review Form State
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const activeImage = selectedImage || (product ? product.image : "");

  if (!product) return null;

  const sizeOptions = getSizeOptions(product); // null when this product needs no size
  const colors = ["Black", "White", "Navy Blue", "Crimson Red"];
  const galleryImages = getProductGallery(product);

  const defaultReviews = [
    {
      id: 1,
      userName: "Rahul Sharma",
      rating: 5,
      comment: "Excellent build quality and super fast delivery! Exceeded my expectations.",
      date: "2 days ago",
      verified: true
    },
    {
      id: 2,
      userName: "Priya Patel",
      rating: 4,
      comment: "Very good product! Packaging was neat and performance is smooth.",
      date: "1 week ago",
      verified: true
    },
    {
      id: 3,
      userName: "Amit Kumar",
      rating: 5,
      comment: "100% genuine product. Value for money deal!",
      date: "2 weeks ago",
      verified: true
    }
  ];

  const allReviews = (product.userReviews && product.userReviews.length > 0)
    ? product.userReviews
    : defaultReviews;

  const handleAdd = () => {
    onAddToCart(selectedSize ? { ...product, size: selectedSize } : product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (onRateProduct) {
      onRateProduct(product.id, userRating, reviewComment);
    }
    setRatingSubmitted(true);
    setReviewComment("");
  };

  return (
    <div className="product-page-container">
      {/* Back Button & Breadcrumbs */}
      <div className="product-page-nav">
        <button className="back-btn-pill" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
        <span className="page-breadcrumb">Home &gt; {product.category} &gt; {product.name}</span>
      </div>

      <div className="product-page-layout">
        {/* Left Column: Image Gallery */}
        <div className="product-page-gallery">
          <div className="page-main-img-box">
            <img src={activeImage || product.image} alt={product.name} className="page-main-img" />
            {product.discount && (
              <span className="page-discount-badge">{product.discount}</span>
            )}
          </div>
          <div className="page-thumb-strip">
            {galleryImages.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`${product.name} View ${idx + 1}`}
                className={activeImage === imgUrl ? "thumb-active" : ""}
                onClick={() => setSelectedImage(imgUrl)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Product Specs & Buy Controls */}
        <div className="product-page-details">
          <h1 className="page-product-title">{product.name}</h1>

          {product.sellerName && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", color: "#1e40af", fontWeight: "700", marginBottom: "8px" }}>
              <Store size={14} color="#2563eb" />
              <span>Sold & Fulfilled by: {product.sellerName}</span>
            </div>
          )}

          <div className="modal-rating-row">
            <div className="modal-rating-pill">
              <span>{product.rating}</span>
              <Star size={12} fill="#fff" color="#fff" />
            </div>
            <span className="modal-reviews">({product.reviewsCount.toLocaleString()} Ratings & Reviews)</span>
            <span className="verified-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Check size={13} /> ShopMate Assured
            </span>
          </div>

          <div className="modal-price-box">
            <div className="modal-price-row">
              <span className="modal-now-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="modal-old-price">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount && <span className="modal-save-percent">{product.discount}</span>}
            </div>
            <p className="inclusive-taxes">Inclusive of all taxes & free shipping</p>
          </div>

          {/* Size Selector */}
          {sizeOptions && (
            <div className="modal-option-section">
              <h4>Select Size:</h4>
              <div className="size-selector">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          <div className="modal-option-section">
            <h4>Select Color:</h4>
            <div className="color-selector">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-pill ${selectedColor === color ? "active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="modal-description-box">
            <h4>Product Specifications:</h4>
            <p>{product.description}</p>
          </div>

          <div className="modal-trust-highlights">
            <div className="trust-item">
              <Truck size={18} color="#2874f0" />
              <span>Free Express Delivery by Tomorrow</span>
            </div>
            <div className="trust-item">
              <RotateCcw size={18} color="#2874f0" />
              <span>7 Days Replacement Guarantee</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={18} color="#2874f0" />
              <span>100% Genuine Brand Warranty</span>
            </div>
          </div>

          {/* Buttons (fixed at the bottom of the screen) */}
          <div className="detail-sticky-actions">
            <button 
              className={`modal-add-cart-btn ${added ? "success" : ""}`}
              onClick={handleAdd}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
            </button>

            <button 
              className="modal-buy-now-btn"
              onClick={() => onBuyNow && onBuyNow(product, selectedSize)}
            >
              <Zap size={18} />
              <span>Buy Now</span>
            </button>

            <button 
              className={`modal-wishlist-toggle ${isWishlisted ? "active" : ""}`}
              onClick={() => onToggleWishlist(product.id)}
              title="Save to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? "#ff3f6c" : "none"} color={isWishlisted ? "#ff3f6c" : "#666"} />
            </button>
          </div>
        </div>
      </div>

      {/* RATING & REVIEWS SECTION */}
      <div className="product-reviews-container" style={{ marginTop: "2.5rem", background: "#ffffff", padding: "1.8rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <MessageSquare size={22} color="#2563eb" />
          <span>Ratings & Customer Reviews</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Rating Summary Card */}
          <div style={{ background: "#f8fafc", padding: "1.2rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "#1e293b", lineHeight: "1" }}>
                {product.rating}
              </div>
              <div>
                <div style={{ display: "flex", gap: "3px", color: "#f59e0b", marginBottom: "4px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= Math.round(product.rating) ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                  Based on {product.reviewsCount.toLocaleString()} verified ratings
                </span>
              </div>
            </div>

            {/* Distribution bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { stars: 5, pct: "75%", color: "#16a34a" },
                { stars: 4, pct: "18%", color: "#22c55e" },
                { stars: 3, pct: "5%", color: "#eab308" },
                { stars: 2, pct: "1%", color: "#f97316" },
                { stars: 1, pct: "1%", color: "#ef4444" }
              ].map((item) => (
                <div key={item.stars} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#475569" }}>
                  <span style={{ width: "30px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    {item.stars} <Star size={11} fill="#475569" color="#475569" />
                  </span>
                  <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: item.pct, height: "100%", background: item.color, borderRadius: "4px" }}></div>
                  </div>
                  <span style={{ width: "35px", textAlign: "right" }}>{item.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive User Rating Form */}
          <div style={{ background: "#f0fdf4", padding: "1.2rem", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#14532d", marginBottom: "8px" }}>
              Rate & Review this Product
            </h3>
            <p style={{ fontSize: "12px", color: "#15803d", marginBottom: "12px" }}>
              Give your manual rating to update the average product score in real time!
            </p>

            {ratingSubmitted ? (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
                <Check size={28} style={{ margin: "0 auto 6px" }} />
                <h4 style={{ fontSize: "1rem", fontWeight: "700" }}>Thank you for your rating!</h4>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  Your rating of <strong>{userRating} Stars</strong> has been submitted and live updated.
                </p>
                <button
                  type="button"
                  onClick={() => setRatingSubmitted(false)}
                  style={{ marginTop: "10px", background: "#166534", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                >
                  Rate Again / Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                {/* Interactive Star Picker */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: "none", border: "none", padding: "2px", cursor: "pointer" }}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || userRating) >= star ? "#f59e0b" : "none"}
                        color="#f59e0b"
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#15803d", marginLeft: "8px" }}>
                    {userRating} / 5 Stars
                  </span>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <textarea
                    rows={3}
                    placeholder="Write a short review (e.g. Excellent quality, fast shipping...)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #86efac", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ background: "#16a34a", color: "#ffffff", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Star size={14} fill="#fff" />
                  <span>Submit Rating</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>
            Verified Customer Reviews ({allReviews.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {allReviews.map((rev) => (
              <div key={rev.id} style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2563eb", color: "#fff", fontWeight: "700", fontSize: "12px", display: "flex", alignItems: "center", justify: "center" }}>
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{rev.userName}</strong>
                      <span style={{ fontSize: "11px", color: "#16a34a", marginLeft: "6px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        <Check size={12} /> Verified Buyer
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{rev.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ background: "#16a34a", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    <span>{rev.rating}</span>
                    <Star size={10} fill="#fff" color="#fff" />
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#334155", margin: 0, lineHeight: "1.4" }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* space so the fixed buttons never cover the page bottom */}
      <div style={{ height: "90px" }} />
    </div>
  );
}

export default ProductDetailPage;