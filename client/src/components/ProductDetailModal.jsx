import React, { useState, useEffect } from "react";
import { X, Star, ShoppingBag, Truck, ShieldCheck, RotateCcw, Heart, Check, Zap } from "lucide-react";
import { getProductGallery } from "../utils/productGallery";

function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [selectedSize, setSelectedSize] = useState("UK 8");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const activeImage = selectedImage || (product ? product.image : "");

  if (!isOpen || !product) return null;

  const sizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
  const colors = ["Black", "White", "Navy Blue", "Crimson Red"];
  const galleryImages = getProductGallery(product);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="product-modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="product-modal-content">
          {/* Left Column: Image Gallery */}
          <div className="product-modal-gallery">
            <div className="main-image-box">
              <img src={activeImage || product.image} alt={product.name} className="product-modal-main-img" />
              {product.discount && (
                <span className="modal-discount-badge">{product.discount}</span>
              )}
            </div>
            <div className="thumbnail-strip">
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

          {/* Right Column: Product Info & Actions */}
          <div className="product-modal-info">
            <span className="modal-breadcrumb">ShopMate &gt; {product.category} &gt; {product.name}</span>
            <h1 className="modal-product-title">{product.name}</h1>

            <div className="modal-rating-row">
              <div className="modal-rating-pill">
                <span>{product.rating}</span>
                <Star size={12} fill="#fff" color="#fff" />
              </div>
              <span className="modal-reviews">{product.reviewsCount.toLocaleString()} Ratings & Reviews</span>
              <span className="verified-badge">✔ ShopMate Assured</span>
            </div>

            <div className="modal-price-box">
              <div className="modal-price-row">
                <span className="modal-now-price">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="modal-old-price">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.discount && <span className="modal-save-percent">{product.discount}</span>}
              </div>
              <p className="inclusive-taxes">Inclusive of all taxes</p>
            </div>

            {/* Select Size Option (for shoes / fashion) */}
            {(product.category === "Fashion" || product.name.toLowerCase().includes("shoe")) && (
              <div className="modal-option-section">
                <h4>Select Size (UK / India):</h4>
                <div className="size-selector">
                  {sizes.map((size) => (
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

            {/* Select Color Option */}
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

            {/* Description & Features */}
            <div className="modal-description-box">
              <h4>Product Overview:</h4>
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

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="modal-action-buttons">
              <button 
                className={`modal-add-cart-btn ${added ? "success" : ""}`}
                onClick={handleAdd}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              <button 
                className="modal-buy-now-btn"
                onClick={() => {
                  handleAdd();
                  onClose();
                  alert("Proceeding to Direct Checkout!");
                }}
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
      </div>
    </div>
  );
}

export default ProductDetailModal;
