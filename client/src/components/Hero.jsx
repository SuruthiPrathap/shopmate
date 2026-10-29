import React from "react";
import { ShieldCheck, Truck, RotateCcw, Tag, ArrowRight, Zap } from "lucide-react";

function Hero({ onExploreClick, onBrowseClick }) {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-text-side">
          <div className="hero-pill">
            <Zap size={16} fill="#ff9900" color="#ff9900" />
            <span>Grand Mega Sale | Up to 80% OFF</span>
          </div>

          <h1 className="hero-headline">
            Shop Smarter with <span className="gradient-text">ShopMate</span>
          </h1>

          <p className="hero-subline">
            Discover thousands of top-tier products across Electronics, Fashion, Mobiles & Home Essentials — all delivered right to your doorstep with guaranteed savings.
          </p>

          <div className="hero-cta-group">
            <button className="hero-primary-btn" onClick={onExploreClick}>
              <span>Explore Top Deals</span>
              <ArrowRight size={18} />
            </button>
                       <button type="button" className="hero-secondary-btn" onClick={onBrowseClick}>
              Browse Categories
            </button>
          </div>

          <div className="hero-features-bar">
            <div className="feature-item">
              <Truck size={18} className="feature-icon" />
              <span>Free Delivery</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={18} className="feature-icon" />
              <span>100% Authentic</span>
            </div>
            <div className="feature-item">
              <RotateCcw size={18} className="feature-icon" />
              <span>Easy Returns</span>
            </div>
            <div className="feature-item">
              <Tag size={18} className="feature-icon" />
              <span>Best Prices</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-side">
          <div className="hero-card-stack">
            <div className="hero-featured-card">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" 
                alt="Featured Product" 
                className="hero-card-img" 
              />
              <div className="hero-card-glass">
                <span className="hero-card-tag">🔥 HOT SELLER</span>
                <h4>Pro Running Shoes</h4>
                <div className="hero-card-price">
                  <span className="now-price">₹1,899</span>
                  <span className="old-price">₹3,499</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;