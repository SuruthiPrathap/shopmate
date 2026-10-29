import React from "react";
import { ShoppingBag, Mail, Phone, MapPin, Heart } from "lucide-react";

// Makes a footer link run a function (and stops the browser from jumping to "#")
const go = (action) => (e) => {
  e.preventDefault();
  if (action) action();
};

function Footer({ onOpenSellerModal, onNavigateToCategory, onNavigateToInfo, onTrackOrder }) {
  return (
    <footer className="footer" id="about">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <ShoppingBag size={24} color="#2874f0" />
            <span>Shop<span className="logo-highlight">Mate</span></span>
          </div>
          <p className="footer-desc">
            Your one-stop destination for authentic products, unbeatable prices, and lightning-fast delivery across India.
          </p>
          <div className="footer-contact">
            <p><Phone size={14} /> <a href="tel:+9118001234567" style={{ color: "inherit", textDecoration: "none" }}>+91 1800-123-4567</a></p>
            <p><Mail size={14} /> <a href="mailto:support@shopmate.com" style={{ color: "inherit", textDecoration: "none" }}>support@shopmate.com</a></p>
            <p><MapPin size={14} /> Tech Park, Bengaluru, India</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#help" onClick={go(() => onNavigateToInfo("help"))}>Help Center</a></li>
            <li><a href="#track" onClick={go(onTrackOrder)}>Track Order</a></li>
            <li><a href="#returns" onClick={go(() => onNavigateToInfo("returns"))}>Returns & Refunds</a></li>
            <li><a href="#shipping" onClick={go(() => onNavigateToInfo("shipping"))}>Shipping Policy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Top Categories</h4>
          <ul>
            <li><a href="#mobiles" onClick={go(() => onNavigateToCategory("Mobiles"))}>Mobiles & Tablets</a></li>
            <li><a href="#electronics" onClick={go(() => onNavigateToCategory("Electronics"))}>Electronics & Laptops</a></li>
            <li><a href="#fashion" onClick={go(() => onNavigateToCategory("Fashion"))}>Fashion & Footwear</a></li>
            <li><a href="#appliances" onClick={go(() => onNavigateToCategory("Appliances"))}>Home Appliances</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4>Newsletter</h4>
          <p>Subscribe to receive update alerts and secret discount coupons!</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopMate Inc. Built with <Heart size={14} color="#ff3f6c" fill="#ff3f6c" /> for smart shoppers.</p>
        <div className="footer-legal">
          <a href="#privacy" onClick={go(() => onNavigateToInfo("privacy"))}>Privacy Policy</a>
          <a href="#terms" onClick={go(() => onNavigateToInfo("terms"))}>Terms of Service</a>
          <button
            onClick={onOpenSellerModal}
            style={{ background: "transparent", border: "none", color: "#2874f0", cursor: "pointer", fontWeight: "700", padding: 0, textDecoration: "underline", fontSize: "13px" }}
          >
            Become a Seller on ShopMate
          </button>
          <a href="#security" onClick={go(() => onNavigateToInfo("security"))}>Security</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;