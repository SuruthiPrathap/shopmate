// Helper function to return 3 matching angle/detail images for any product

export function getProductGallery(product) {
  if (!product) return [];
  if (product.images && product.images.length > 0) return product.images;

  const mainImg = product.image;
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();

  let alt1 = mainImg;
  let alt2 = mainImg;

  if (name.includes("iphone")) {
    alt1 = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80";
  } else if (name.includes("samsung") || name.includes("galaxy")) {
    alt1 = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80";
  } else if (name.includes("airpods") || name.includes("earbuds") || name.includes("airpods pro")) {
    alt1 = "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80";
  } else if (name.includes("headphones") || name.includes("sony") || name.includes("bose")) {
    alt1 = "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80";
  } else if (name.includes("macbook") || name.includes("laptop") || name.includes("asus")) {
    alt1 = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80";
  } else if (name.includes("watch") || category.includes("smartwatches")) {
    alt1 = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80";
  } else if (name.includes("keyboard") || name.includes("keychron")) {
    alt1 = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80";
  } else if (name.includes("monitor") || name.includes("lg")) {
    alt1 = "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80";
  } else if (category.includes("footwear") || name.includes("shoe") || name.includes("sneaker") || name.includes("boot") || name.includes("loafe") || name.includes("oxford")) {
    alt1 = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80";
  } else if (name.includes("jacket") || name.includes("shirt") || name.includes("dress") || category.includes("fashion")) {
    alt1 = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80";
  } else if (name.includes("fryer") || name.includes("cooker") || name.includes("coffee") || category.includes("appliances")) {
    alt1 = "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80";
  } else if (category.includes("beauty") || name.includes("serum") || name.includes("cleanser")) {
    alt1 = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1608248597263-0057e57b4524?w=800&q=80";
  } else if (category.includes("sports") || name.includes("dumbbell") || name.includes("mat")) {
    alt1 = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80";
    alt2 = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80";
  }

  return [mainImg, alt1, alt2];
}
