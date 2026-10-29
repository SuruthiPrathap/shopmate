import React from "react";
import ProductCard from "./ProductCard";
import { Sparkles, PackageSearch } from "lucide-react";

function FeaturedProducts({ 
  products = [], 
  selectedCategory = "All", 
  searchQuery = "", 
  onAddToCart, 
  onToggleWishlist,
  wishlistIds = [],
  onResetFilter,
  onSelectProduct
}) {
  return (
    <section className="featured-products" id="products">
      <div className="section-header">
        <div className="section-title-container">
          <Sparkles className="section-icon" size={24} color="#2874f0" />
          <h2>
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCategory !== "All" 
                ? `${selectedCategory} Collection` 
                : "Trending & Featured Deals"}
          </h2>
        </div>
        <span className="products-count-badge">{products.length} Products Found</span>
      </div>

      {products.length === 0 ? (
        <div className="no-products-found">
          <PackageSearch size={56} className="no-products-icon" />
          <h3>No matching products found</h3>
          <p>We couldn't find anything matching your search criteria.</p>
          <button className="reset-filter-btn" onClick={onResetFilter}>
            View All Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;