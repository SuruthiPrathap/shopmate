import React from "react";
import BannerCarousel from "../components/BannerCarousel";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import FeaturedProducts from "../components/FeaturedProducts";

function HomePage({ 
  onNavigateToCategory, 
  onNavigateToProduct, 
  products, 
  searchQuery = "",
  onAddToCart, 
  onToggleWishlist, 
  wishlistIds 
}) {
  return (
    <div className="home-page">
      {!searchQuery ? (
        <>
                    <BannerCarousel onNavigateToCategory={onNavigateToCategory} />

                   <Hero 
            onExploreClick={() => onNavigateToCategory("All")}
            onBrowseClick={() => {
              const el = document.getElementById("categories-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} 
          />

          {/* Clean Visual Category Cards Grid on Home Page */}
          <CategoryCard onSelectCategory={onNavigateToCategory} />
        </>
      ) : (
        /* If user types in global search bar, show search results */
        <FeaturedProducts
          products={products}
          selectedCategory="All"
          searchQuery={searchQuery}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
          onResetFilter={() => {}}
          onSelectProduct={onNavigateToProduct}
        />
      )}
    </div>
  );
}

export default HomePage;
