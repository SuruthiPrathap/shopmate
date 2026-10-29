import React from "react";
import {
  LayoutGrid,
  Smartphone,
  Laptop,
  Shirt,
  Baby,
  Zap,
  Sparkles,
  Dumbbell,
  Sofa
} from "lucide-react";

const navCategories = [
  { id: 1, name: "All Products", categoryKey: "All", icon: LayoutGrid, color: "#2874f0", bg: "#eef5ff" },
  { id: 2, name: "Mobiles", categoryKey: "Mobiles", icon: Smartphone, color: "#4f46e5", bg: "#eef2ff" },
  { id: 3, name: "Electronics", categoryKey: "Electronics", icon: Laptop, color: "#0284c7", bg: "#f0f9ff" },
  { id: 4, name: "Fashion", categoryKey: "Fashion", icon: Shirt, color: "#ec4899", bg: "#fdf2f8" },
    { id: 5, name: "Kids", categoryKey: "Kids", icon: Baby, color: "#10b981", bg: "#ecfdf5" },
  { id: 6, name: "Appliances", categoryKey: "Appliances", icon: Zap, color: "#f59e0b", bg: "#fffbeb" },
  { id: 7, name: "Beauty", categoryKey: "Beauty", icon: Sparkles, color: "#8b5cf6", bg: "#f5f3ff" },
  { id: 8, name: "Sports", categoryKey: "Sports", icon: Dumbbell, color: "#ef4444", bg: "#fef2f2" },
  { id: 9, name: "Furniture", categoryKey: "Furniture", icon: Sofa, color: "#d97706", bg: "#fff8f0" }
];

function CategoryIconsRow({ selectedCategory = "All", onSelectCategory }) {
  return (
    <div className="category-bar-wrapper">
      <div className="category-icons-row">
        {navCategories.map((cat) => {
          const isActive = selectedCategory === cat.categoryKey;
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.id}
              className={`category-icon-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.categoryKey)}
              role="button"
              tabIndex={0}
            >
              <div
                className="category-icon-container"
                style={{
                  backgroundColor: isActive ? cat.color : cat.bg,
                  color: isActive ? "#ffffff" : cat.color
                }}
              >
                <IconComponent size={26} strokeWidth={2} />
              </div>
              <p className="category-label">{cat.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryIconsRow;