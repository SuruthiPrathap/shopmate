import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

function CartDrawer({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const shippingFee = subtotal > 1000 || cartItems.length === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={22} className="cart-header-icon" />
            <h2>Your Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h2>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={64} className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-category">{item.category}</span>
                    <div className="cart-item-pricing">
                      <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="cart-item-original">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      className="cart-remove-btn" 
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="cart-summary-row discount">
                <span>Total Savings</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? <strong className="free-text">FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row total">
              <span>Total Amount</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
