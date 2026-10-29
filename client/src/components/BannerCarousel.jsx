import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Big Savings Days",
    subtitle: "Up to 80% OFF on Electronics & Gadgets",
    bg: "linear-gradient(135deg, #2874f0 0%, #004fb6 100%)",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    badge: "EXCLUSIVE DEAL",
    cta: "Shop Electronics",
    categoryKey: "Electronics"
  },
  {
    id: 2,
    title: "Fashion Clearance Sale",
    subtitle: "Trends starting from ₹499 | Extra 15% OFF with Bank Cards",
    bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    badge: "NEW ARRIVALS",
    cta: "Explore Fashion",
    categoryKey: "Fashion"
  },
  {
    id: 3,
    title: "NextGen Smartphone Fest",
    subtitle: "Exchange offer up to ₹10,000 | No Cost EMI available",
    bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    badge: "LIMITED TIME",
    cta: "View Mobiles",
    categoryKey: "Mobiles"
  },
  {
    id: 4,
    title: "Home & Kitchen Makeover",
    subtitle: "Upgrade your living space with top brand appliances",
    bg: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    badge: "FESTIVE SALE",
    cta: "Shop Appliances",
    categoryKey: "Appliances"
  }
];

function BannerCarousel({ onNavigateToCategory }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="banner-carousel-container">
      <div 
        className="banner-slide-active"
        style={{ background: currentBanner.bg }}
      >
        <div className="banner-content">
          <span className="banner-badge">{currentBanner.badge}</span>
          <h2 className="banner-title">{currentBanner.title}</h2>
          <p className="banner-subtitle">{currentBanner.subtitle}</p>
          <button
            className="banner-cta-btn"
            onClick={() => onNavigateToCategory && onNavigateToCategory(currentBanner.categoryKey)}
          >
            {currentBanner.cta}
          </button>
        </div>
        <div className="banner-image-wrapper">
          <img 
            src={currentBanner.image} 
            alt={currentBanner.title} 
            className="banner-hero-img" 
          />
        </div>
      </div>

      <button className="carousel-btn left" onClick={handlePrev} aria-label="Previous Banner">
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-btn right" onClick={handleNext} aria-label="Next Banner">
        <ChevronRight size={24} />
      </button>

      <div className="carousel-dots">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;