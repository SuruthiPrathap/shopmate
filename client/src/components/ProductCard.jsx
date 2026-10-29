import React, { useState } from "react";
import { Star, Heart, ShoppingBag, Check, Truck, Flame, Eye, Store, ShieldCheck } from "lucide-react";

function ProductCard({ product, onAddToCart, onBuyNow, onToggleWishlist, isWishlisted, onSelectProduct }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (onBuyNow) onBuyNow(product);
    else if (onSelectProduct) onSelectProduct(product);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="product-card-top">
        {product.tag && <span className="product-badge">{product.tag}</span>}
        {product.discount && parseInt(product.discount) >= 45 && (
          <span className="product-badge" style={{ backgroundColor: '#ff3f6c', left: 'auto', right: '45px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} /> SUPER SAVER
          </span>
        )}

        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(product.id);
          }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#ff3f6c" : "none"} color={isWishlisted ? "#ff3f6c" : "#666"} />
        </button>

        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          <div className="quick-view-overlay">
            <Eye size={16} />
            <span>Quick View</span>
          </div>
        </div>
      </div>

      <div className="product-card-details">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="product-category">{product.category}</span>
          {product.sellerName && (
            <span style={{ fontSize: "10px", color: "#2563eb", background: "#eff6ff", padding: "2px 6px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: "600" }}>
              <Store size={10} /> {product.sellerName}
            </span>
          )}
        </div>
        <h3 className="product-name" title={product.name}>{product.name}</h3>

        <div className="product-rating-row">
          <div className="rating-pill">
            <span>{product.rating}</span>
            <Star size={12} fill="#fff" color="#fff" />
          </div>
          <span className="reviews-count">({product.reviewsCount.toLocaleString()})</span>
        </div>

        <div className="product-price-row">
          {product.price > 2000 && (
            <span style={{ fontSize: '11px', color: '#388e3c', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={14} /> Free Delivery
            </span>
          )}

          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
          {product.discount && <span className="product-discount">{product.discount}</span>}
        </div>

               <div className="card-action-row">
          <button
            className={`add-to-cart-btn ${added ? "success" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Added!</span>
              </>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;