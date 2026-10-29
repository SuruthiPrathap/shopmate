import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import categoriesData from "../data/categories";
import { ChevronRight, ChevronDown, ChevronUp, X, Filter, Star } from "lucide-react";

function CategoryPage({ 
  categoryKey = "All", 
  allProducts = [], 
  onBackToHome, 
  onNavigateToProduct, 
  onAddToCart, 
  onBuyNow,
  onToggleWishlist, 
  wishlistIds = []
}) {
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(350000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minDiscount, setMinDiscount] = useState(0);

  // Mobile filter drawer (slides in from the left on phones)
  const [showFilters, setShowFilters] = useState(false);

  // Accordion Expand/Collapse states
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isDiscountOpen, setIsDiscountOpen] = useState(true);
  const [brandSearch, setBrandSearch] = useState("");

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Safe category key
  const safeCategoryKey = (categoryKey || "All").toString().toLowerCase();



  const categoryObj = useMemo(() => {
    return categoriesData.find(
      (c) => c.categoryKey && c.categoryKey.toLowerCase() === safeCategoryKey
    ) || {
      name: categoryKey || "Catalog",
      tagline: `Explore all products in this collection`,
      subcategories: ["All"]
    };
  }, [safeCategoryKey, categoryKey]);

  // Products belonging to this category
  const categoryProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    return allProducts.filter((product) => {
      if (!product || !product.category) return false;
      const productCat = product.category.toString().toLowerCase();
      return safeCategoryKey === "all" || productCat === safeCategoryKey;
    });
  }, [allProducts, safeCategoryKey]);

  // Extract available brands dynamically from category products
  const availableBrands = useMemo(() => {
    const brandSet = new Set();
    categoryProducts.forEach((p) => {
      if (p.name) {
        const nameParts = p.name.split(" ");
        const firstWord = nameParts[0];
        if (firstWord) brandSet.add(firstWord);
      }
    });
    return Array.from(brandSet).sort();
  }, [categoryProducts]);

  // Toggle brand selection
  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters manually
  const handleClearAllFilters = () => {
    setSelectedSubcategory("All");
    setMinRating(0);
    setMaxPrice(350000);
    setSelectedBrands([]);
    setMinDiscount(0);
    setBrandSearch("");
  };

  const hasActiveFilters =
    selectedSubcategory !== "All" ||
    minRating > 0 ||
    maxPrice < 350000 ||
    selectedBrands.length > 0 ||
    minDiscount > 0;

  // How many filters are active (shown on the mobile Filters button)
  const activeFilterCount =
    (selectedSubcategory !== "All" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 350000 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    selectedBrands.length;

  // Defensive Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let items = categoryProducts.filter((product) => {
      // Subcategory match
      const productSub = (product.subcategory || "").toString().toLowerCase();
      const targetSub = (selectedSubcategory || "All").toString().toLowerCase();
      const matchesSubcategory =
        targetSub === "all" ||
        targetSub.includes("all") ||
        productSub === targetSub;
      if (!matchesSubcategory) return false;

      // Price match
      if ((product.price || 0) > maxPrice) return false;

      // Rating match
      if ((product.rating || 0) < minRating) return false;

      // Brand match
      if (selectedBrands.length > 0) {
        const prodNameLower = (product.name || "").toLowerCase();
        const matchesAnyBrand = selectedBrands.some((brand) =>
          prodNameLower.includes(brand.toLowerCase())
        );
        if (!matchesAnyBrand) return false;
      }

      // Discount match
      if (minDiscount > 0) {
        const discountNum = parseInt(product.discount || "0", 10) || 0;
        if (discountNum < minDiscount) return false;
      }

      return true;
    });

    // Sort items safely
    if (sortBy === "Price -- Low to High") {
      items.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "Price -- High to Low") {
      items.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "Newest First") {
      items.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else {
      // Popularity (Rating * Reviews)
      items.sort((a, b) => ((b.rating || 0) * (b.reviewsCount || 0)) - ((a.rating || 0) * (a.reviewsCount || 0)));
    }

    return items;
  }, [categoryProducts, selectedSubcategory, minRating, maxPrice, selectedBrands, minDiscount, sortBy]);

  // Filtered brand checkboxes search
  const filteredAvailableBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="flipkart-catalog-layout">
      {/* Dark overlay behind the mobile filter drawer */}
      <div
        className={`sidebar-overlay ${showFilters ? "show" : ""}`}
        onClick={() => setShowFilters(false)}
      />

      {/* ===== Left Sidebar Filters (drawer on phones) ===== */}
      <aside className={`flipkart-sidebar ${showFilters ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          {hasActiveFilters && (
            <button className="clear-all-sidebar-btn" onClick={handleClearAllFilters}>
              CLEAR ALL
            </button>
          )}
          <button
            className="sidebar-close-btn"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="active-filters-box">
            {selectedSubcategory !== "All" && (
              <span className="filter-pill-badge" onClick={() => setSelectedSubcategory("All")}>
                {selectedSubcategory} <X size={12} />
              </span>
            )}
            {maxPrice < 350000 && (
              <span className="filter-pill-badge" onClick={() => setMaxPrice(350000)}>
                Under ₹{maxPrice.toLocaleString()} <X size={12} />
              </span>
            )}
            {minRating > 0 && (
              <span className="filter-pill-badge" onClick={() => setMinRating(0)}>
                {minRating} <Star size={11} fill="currentColor" style={{ verticalAlign: "-1px" }} /> & above <X size={12} />
              </span>
            )}
            {minDiscount > 0 && (
              <span className="filter-pill-badge" onClick={() => setMinDiscount(0)}>
                {minDiscount}%+ Off <X size={12} />
              </span>
            )}
            {selectedBrands.map((b) => (
              <span key={b} className="filter-pill-badge" onClick={() => handleToggleBrand(b)}>
                {b} <X size={12} />
              </span>
            ))}
          </div>
        )}

        {/* Categories & Subcategories */}
        <div className="filter-group">
          <h4 className="filter-title">CATEGORIES</h4>
          <div className="category-tree">
            <span className="tree-item link" onClick={onBackToHome}>
              &lt; Home
            </span>
            <span className="tree-item active-cat">
              &lt; {categoryObj.name}
            </span>
            {categoryObj.subcategories.map((sub, idx) => {
              const count = categoryProducts.filter((p) => {
                if (sub === "All" || sub.includes("All")) return true;
                return (p.subcategory || "").toLowerCase() === sub.toLowerCase();
              }).length;

              return (
                <span
                  key={idx}
                  className={`tree-subitem ${selectedSubcategory === sub ? "active" : ""}`}
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  <span>{sub}</span>
                  <span className="sub-count">({count})</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <h4 className="filter-title">PRICE</h4>
          <div className="price-slider-box">
            <input 
              type="range" 
              min="500" 
              max="350000" 
              step="1000"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-range-slider"
            />
            <div className="price-range-labels">
              <span>Max Price: <strong>₹{maxPrice.toLocaleString()}</strong></span>
              {maxPrice < 350000 && (
                <button className="clear-filter-text" onClick={() => setMaxPrice(350000)}>Reset</button>
              )}
            </div>
            {/* Quick Price Preset Buttons */}
            <div className="price-presets-row">
              <button 
                className={`preset-btn ${maxPrice === 5000 ? "active" : ""}`}
                onClick={() => setMaxPrice(5000)}
              >
                Under ₹5K
              </button>
              <button 
                className={`preset-btn ${maxPrice === 30000 ? "active" : ""}`}
                onClick={() => setMaxPrice(30000)}
              >
                Under ₹30K
              </button>
              <button 
                className={`preset-btn ${maxPrice === 100000 ? "active" : ""}`}
                onClick={() => setMaxPrice(100000)}
              >
                Under ₹1L
              </button>
            </div>
          </div>
        </div>

        {/* BRAND Accordion */}
        <div className="filter-group accordion">
          <div 
            className="accordion-title" 
            onClick={() => setIsBrandOpen(!isBrandOpen)}
          >
            <span>BRAND ({selectedBrands.length > 0 ? selectedBrands.length : "ALL"})</span>
            {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {isBrandOpen && (
            <div className="accordion-content">
              {availableBrands.length > 5 && (
                <input
                  type="text"
                  placeholder="Search Brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="brand-search-input"
                />
              )}
              <div className="brand-checkboxes-list">
                {filteredAvailableBrands.map((brand) => (
                  <label key={brand} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleToggleBrand(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMER RATING Accordion */}
        <div className="filter-group accordion">
          <div 
            className="accordion-title" 
            onClick={() => setIsRatingOpen(!isRatingOpen)}
          >
            <span>CUSTOMER RATING</span>
            {isRatingOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {isRatingOpen && (
            <div className="accordion-content">
              <div className="rating-checkboxes">
                {[4, 3, 2].map((stars) => (
                  <label key={stars} className="checkbox-label">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === stars} 
                      onChange={() => setMinRating(minRating === stars ? 0 : stars)} 
                    />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>{stars} <Star size={12} fill="#f59e0b" color="#f59e0b" /> & above</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DISCOUNT Accordion */}
        <div className="filter-group accordion">
          <div 
            className="accordion-title" 
            onClick={() => setIsDiscountOpen(!isDiscountOpen)}
          >
            <span>DISCOUNT</span>
            {isDiscountOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {isDiscountOpen && (
            <div className="accordion-content">
              <div className="discount-radios">
                {[50, 40, 30, 20].map((percent) => (
                  <label key={percent} className="checkbox-label">
                    <input 
                      type="radio" 
                      name="discount" 
                      checked={minDiscount === percent} 
                      onChange={() => setMinDiscount(minDiscount === percent ? 0 : percent)} 
                    />
                    <span>{percent}% or more</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone only: closes the drawer and shows the results */}
        <button className="sidebar-apply-btn" onClick={() => setShowFilters(false)}>
          Show {filteredProducts.length} Products
        </button>
      </aside>

      {/* ===== Main Content Column ===== */}
      <main className="flipkart-main-content">
        {/* Phone only: opens the filter drawer */}
        <button className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
          <Filter size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        {/* Breadcrumb Trail */}
        <div className="catalog-breadcrumbs">
          <span onClick={onBackToHome} style={{ cursor: 'pointer' }}>Home</span> <ChevronRight size={12} />
          <span>{categoryObj.name}</span> <ChevronRight size={12} />
          <span className="current">{selectedSubcategory}</span>
        </div>

        {/* Category Heading & Count */}
        <div className="catalog-header-row">
          <h1 className="catalog-page-title">{categoryObj.name}</h1>
          <span className="catalog-product-count">
            (Showing {filteredProducts.length} of {categoryProducts.length} products)
          </span>
        </div>

        {/* Sort By Tab Bar */}
        <div className="flipkart-sort-bar">
          <span className="sort-label">Sort By</span>
          {["Popularity", "Price -- Low to High", "Price -- High to Low", "Newest First"].map((tab) => (
            <button
              key={tab}
              className={`sort-tab-btn ${sortBy === tab ? "active" : ""}`}
              onClick={() => setSortBy(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            <Filter size={40} className="no-products-icon" />
            <h3>No products found matching your filters</h3>
            <p>Try resetting the price range, brand filters, or rating selection.</p>
            <button className="reset-filter-btn" onClick={handleClearAllFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="flipkart-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onSelectProduct={onNavigateToProduct}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryPage;