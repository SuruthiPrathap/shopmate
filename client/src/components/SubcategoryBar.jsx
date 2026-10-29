import React from "react";
import categoriesData from "../data/categories";

function SubcategoryBar({ selectedCategory, selectedSubcategory = "All", onSelectSubcategory, onBackToAll }) {
  if (selectedCategory === "All") return null;

  const currentCategoryObj = categoriesData.find(
    (c) => c.categoryKey.toLowerCase() === selectedCategory.toLowerCase()
  );

  const subcategories = currentCategoryObj ? currentCategoryObj.subcategories : ["All"];

  return (
    <div className="subcategory-bar-container">
      <div className="subcategory-bar-header">
        <button className="back-all-categories-btn" onClick={onBackToAll}>
          ← View All Categories
        </button>
        <span className="current-category-name">{currentCategoryObj ? currentCategoryObj.name : selectedCategory} Catalog</span>
      </div>

      <div className="subcategory-pills-row">
        {subcategories.map((sub, idx) => {
          const isActive = selectedSubcategory === sub || (selectedSubcategory === "All" && idx === 0);
          return (
            <button
              key={idx}
              className={`subcategory-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectSubcategory(sub.includes("All") ? "All" : sub)}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SubcategoryBar;
