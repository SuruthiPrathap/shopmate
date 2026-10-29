// Smart Natural Language Processing (NLP) & Query Intent Parser for Search Bar

export function parseSmartSearch(query = "", products = []) {
  if (!query || !query.trim()) {
    return {
      filteredProducts: products,
      parsedIntent: null
    };
  }

  const rawQuery = query.toLowerCase().trim();
  let remainingText = rawQuery;

  let maxPrice = null;
  let minPrice = null;
  let minRating = null;
  let sortOrder = null; // "price-asc" | "rating-desc" | null
  let detectedCategory = null;
  let detectedBrand = null;

  // 1. Parse Price Constraints ("under 5000", "below 4000", "less than 10k", "under 1 lakh")
  const underRegex = /(?:under|below|less than|within|under\s*rs\.?|under\s*₹)\s*(\d+(?:\.\d+)?)\s*(k|lakh|l)?/i;
  const underMatch = rawQuery.match(underRegex);
  if (underMatch) {
    let val = parseFloat(underMatch[1]);
    const unit = (underMatch[2] || "").toLowerCase();
    if (unit === "k") val *= 1000;
    if (unit === "lakh" || unit === "l") val *= 100000;
    maxPrice = val;
    remainingText = remainingText.replace(underMatch[0], "").trim();
  }

  // Parse "above 50000" or "more than 2000"
  const aboveRegex = /(?:above|more than|greater than|over)\s*(\d+(?:\.\d+)?)\s*(k|lakh|l)?/i;
  const aboveMatch = rawQuery.match(aboveRegex);
  if (aboveMatch) {
    let val = parseFloat(aboveMatch[1]);
    const unit = (aboveMatch[2] || "").toLowerCase();
    if (unit === "k") val *= 1000;
    if (unit === "lakh" || unit === "l") val *= 100000;
    minPrice = val;
    remainingText = remainingText.replace(aboveMatch[0], "").trim();
  }

  // 2. Parse Rating Constraints ("best rated", "top rated", "4 star", "highest rated")
  if (
    rawQuery.includes("best rated") ||
    rawQuery.includes("top rated") ||
    rawQuery.includes("highest rated") ||
    rawQuery.includes("best quality")
  ) {
    minRating = 4.7;
    sortOrder = "rating-desc";
    remainingText = remainingText
      .replace(/best rated|top rated|highest rated|best quality/gi, "")
      .trim();
  } else if (rawQuery.includes("4 star") || rawQuery.includes("4★")) {
    minRating = 4.0;
    remainingText = remainingText.replace(/4 star|4★/gi, "").trim();
  }

  // 3. Parse Price Sort Intents ("cheap", "budget", "low price", "affordable")
  if (
    rawQuery.includes("cheap") ||
    rawQuery.includes("budget") ||
    rawQuery.includes("affordable") ||
    rawQuery.includes("low price")
  ) {
    sortOrder = "price-asc";
    remainingText = remainingText
      .replace(/cheap|budget|affordable|low price/gi, "")
      .trim();
  }

  // 4. Common Keyword Mapping for Categories
  const categoryKeywords = {
    footwear: ["shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "sandal", "footwear", "loafe", "runner"],
    mobiles: ["phone", "phones", "mobile", "mobiles", "smartphone", "smartphones", "5g", "iphone", "galaxy", "pixel", "redmi", "oneplus"],
    electronics: ["laptop", "laptops", "headphone", "headphones", "earbud", "earbuds", "airpod", "airpods", "keyboard", "monitor", "anc", "audio"],
    fashion: ["shirt", "shirts", "jacket", "jackets", "dress", "dresses", "sunglasses", "handbag", "tote", "fashion", "clothes"],
    appliances: ["fryer", "air fryer", "coffee", "espresso", "vacuum", "cooker", "appliance", "appliances", "kitchen"],
    beauty: ["serum", "cleanser", "skincare", "cream", "beauty", "niacinamide"],
    sports: ["dumbbell", "dumbbells", "yoga", "mat", "sport", "sports", "fitness", "compression"]
  };

  for (const [catName, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => rawQuery.includes(kw))) {
      detectedCategory = catName;
      break;
    }
  }

  // 5. Brand Extraction
  const knownBrands = [
    "nike", "adidas", "puma", "asics", "reebok", "clarks", "skechers", "red chief",
    "apple", "samsung", "oneplus", "google", "redmi", "nothing",
    "sony", "bose", "asus", "lg", "keychron",
    "ray-ban", "philips", "delonghi", "dyson", "instant pot",
    "minimalist", "cerave", "estée lauder", "under armour"
  ];

  for (const b of knownBrands) {
    if (rawQuery.includes(b)) {
      detectedBrand = b;
      break;
    }
  }

  // Filter Products
  const searchTerms = remainingText
    .split(/\s+/)
    .filter((t) => t.length > 1 && !["for", "in", "with", "and", "the", "a", "of", "rs", "rupees"].includes(t));

  let filtered = products.filter((p) => {
    if (!p) return false;

    // Check Max Price
    if (maxPrice !== null && p.price > maxPrice) return false;
    // Check Min Price
    if (minPrice !== null && p.price < minPrice) return false;
    // Check Min Rating
    if (minRating !== null && p.rating < minRating) return false;

    // Check Category Match if specified
    if (detectedCategory) {
      const pCat = (p.category || "").toLowerCase();
      if (!pCat.includes(detectedCategory) && !detectedCategory.includes(pCat)) {
        // Allow fallback if product name contains keyword
        const pName = (p.name || "").toLowerCase();
        const keywords = categoryKeywords[detectedCategory] || [];
        const matchesNameKw = keywords.some((kw) => pName.includes(kw));
        if (!matchesNameKw) return false;
      }
    }

    // Check Brand Match
    if (detectedBrand) {
      const pName = (p.name || "").toLowerCase();
      if (!pName.includes(detectedBrand)) return false;
    }

    // Check remaining search terms against name/category/subcategory/description
    if (searchTerms.length > 0) {
      const text = `${p.name} ${p.category} ${p.subcategory || ""} ${p.description || ""}`.toLowerCase();
      const matchesTerms = searchTerms.every((term) => text.includes(term));
      if (!matchesTerms) return false;
    }

    return true;
  });

  // Apply Sorting Intent
  if (sortOrder === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return {
    filteredProducts: filtered,
    parsedIntent: {
      maxPrice,
      minPrice,
      minRating,
      detectedCategory,
      detectedBrand,
      sortOrder
    }
  };
}
