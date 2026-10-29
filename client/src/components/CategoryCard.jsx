import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import categoriesData from "../data/categories";

// 8th card: opens every product at once (also fills the last row of the grid)
const ALL_DEALS_IMAGE = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80";

function CategoryCard({ onSelectCategory }) {
  return (
    <section className="category-section" id="categories-grid">
      <div className="section-header">
        <div className="section-title-container">
          <Sparkles className="section-icon" size={24} color="#2874f0" />
          <h2>Explore Top Categories</h2>
        </div>
        <span className="products-count-badge">Popular Collections</span>
      </div>

      <div className="category-grid">
               {categoriesData.filter((cat) => cat.showOnHome !== false).map((cat) => (
          <div
            key={cat.id}
            className="category-hero-card"
            onClick={() => onSelectCategory(cat.categoryKey)}
            role="button"
            tabIndex={0}
          >
            <div className="category-card-banner">
              <img src={cat.bannerImage} alt={cat.name} className="category-card-img" />
              <div className="category-card-overlay">
                <span className="category-badge-pill">{cat.subcategories.length} Collections</span>
              </div>
            </div>

            <div className="category-card-body">
              <h3 className="category-card-title">{cat.name}</h3>
              <p className="category-card-tagline">{cat.tagline}</p>
              
              <div className="subcategory-pills-preview">
                {cat.subcategories.slice(0, 3).map((sub, idx) => (
                  <span key={idx} className="sub-pill">{sub}</span>
                ))}
                {cat.subcategories.length > 3 && (
                  <span className="sub-pill more">+{cat.subcategories.length - 3} More</span>
                )}
              </div>

              <div className="category-card-action">
                <span>Explore All {cat.categoryKey}</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}

        {/* All products & deals */}
        <div
          className="category-hero-card"
          onClick={() => onSelectCategory("All")}
          role="button"
          tabIndex={0}
        >
          <div className="category-card-banner">
            <img src={ALL_DEALS_IMAGE} alt="All products and deals" className="category-card-img" />
            <div className="category-card-overlay">
              <span className="category-badge-pill">All Categories</span>
            </div>
          </div>

          <div className="category-card-body">
            <h3 className="category-card-title">All Products & Deals</h3>
            <p className="category-card-tagline">Up to 60% OFF | Browse every category in one place</p>

            <div className="subcategory-pills-preview">
              <span className="sub-pill">Top Rated</span>
              <span className="sub-pill">Best Deals</span>
              <span className="sub-pill">New Arrivals</span>
            </div>

            <div className="category-card-action">
              <span>Shop All Deals</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryCard;