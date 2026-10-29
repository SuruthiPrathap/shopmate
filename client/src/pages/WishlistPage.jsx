import React from "react";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, ArrowRight } from "lucide-react";

function WishlistPage({
  wishlistIds = [],
  allProducts = [],
  onAddToCart,
  onToggleWishlist,
  onNavigateToProduct,
  onBackToHome
}) {
  const wishlistedProducts = allProducts.filter((product) =>
    wishlistIds.includes(product.id)
  );

  return (
    <div className="wishlist-page-container">
      {/* Top Breadcrumb & Header */}
      <div className="wishlist-page-header">
        <button className="back-btn-pill" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </button>
        <div className="header-title-box">
          <div className="wishlist-title-row">
            <Heart size={24} fill="#ff3f6c" color="#ff3f6c" />
            <h1>My Wishlist</h1>
            <span className="wishlist-count-pill">{wishlistedProducts.length} Items</span>
          </div>
        </div>
      </div>

      {/* Main Wishlist Content */}
      {wishlistedProducts.length === 0 ? (
        /* Empty State */
        <div className="wishlist-empty-state">
          <div className="empty-heart-icon-wrapper">
            <Heart size={48} color="#94a3b8" />
          </div>
          <h2>Your Wishlist is Empty!</h2>
          <p>Explore our top ShopMate collections and save your favorite products here.</p>
          <button className="explore-shopping-btn" onClick={onBackToHome}>
            <span>Explore Products Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="wishlist-grid">
          {wishlistedProducts.map((product) => (
            <div key={product.id} className="wishlist-card">
              {/* Image & Badges */}
              <div className="wishlist-card-image-box">
                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-card-img"
                  onClick={() => onNavigateToProduct(product)}
                />
                {product.discount && (
                  <span className="wishlist-discount-badge">{product.discount}</span>
                )}
                <button
                  className="wishlist-remove-btn"
                  onClick={() => onToggleWishlist(product.id)}
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="wishlist-card-info">
                <span className="wishlist-category-tag">{product.category}</span>
                <h3
                  className="wishlist-product-name"
                  onClick={() => onNavigateToProduct(product)}
                >
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="wishlist-rating-row">
                  <div className="rating-pill">
                    <span>{product.rating}</span>
                    <Star size={10} fill="#fff" color="#fff" />
                  </div>
                  <span className="reviews-count">({product.reviewsCount.toLocaleString()})</span>
                </div>

                {/* Price */}
                <div className="wishlist-price-row">
                  <span className="wishlist-price">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="wishlist-old-price">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart CTA */}
                <button
                  className="wishlist-add-cart-btn"
                  onClick={() => onAddToCart(product)}
                >
                  <ShoppingBag size={16} />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
