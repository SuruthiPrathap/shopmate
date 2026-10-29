// Unique, High-Definition Unsplash Product Dataset (No Repeating Items)

const products = [
  // ==================== FOOTWEAR - MEN'S RUNNING ====================
  {
    id: 101,
    name: "Nike Air Zoom Pro Running Shoes",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 3499,
    originalPrice: 6999,
    discount: "50% OFF",
    rating: 4.8,
    reviewsCount: 3240,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    tag: "Bestseller",
    description: "Ultra-breathable Flyknit upper with ultra-responsive Zoom Air foam for marathons and daily runs."
  },
  {
    id: 102,
    name: "Adidas Ultraboost Light Gym Trainers",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 4299,
    originalPrice: 7999,
    discount: "46% OFF",
    rating: 4.9,
    reviewsCount: 2890,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    tag: "Pro Runner",
    description: "Light Boost midsole technology delivering maximum energy return and Continental rubber traction."
  },
  {
    id: 103,
    name: "Puma Velocity Nitro 2 Sports Shoes",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 2899,
    originalPrice: 5499,
    discount: "47% OFF",
    rating: 4.7,
    reviewsCount: 1750,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    tag: "Trending",
    description: "NITRO foam cushioning providing light and responsive feel with PUMAGRIP all-surface outsole."
  },
  {
    id: 104,
    name: "Asics Gel-Kayano 30 Stability Shoes",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 4999,
    originalPrice: 8999,
    discount: "44% OFF",
    rating: 4.9,
    reviewsCount: 2100,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
    tag: "Top Cushion",
    description: "4D GUIDANCE SYSTEM technology providing adaptive stability for long distance runners."
  },
  {
    id: 105,
    name: "Under Armour Charged Assert 9 Trainers",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 3199,
    originalPrice: 5999,
    discount: "46% OFF",
    rating: 4.6,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    tag: "Durable Gym",
    description: "Charged Cushioning helps protect against impact, while leather overlays add durable stability."
  },
  {
    id: 106,
    name: "New Balance Fresh Foam X 1080v12",
    category: "Footwear",
    subcategory: "Men's Running",
    price: 5299,
    originalPrice: 8999,
    discount: "41% OFF",
    rating: 4.8,
    reviewsCount: 1890,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
    tag: "Plush Ride",
    description: "Signature Fresh Foam X midsole technology delivers incredible comfort for long miles."
  },

  // ==================== FOOTWEAR - WOMEN'S SNEAKERS ====================
  {
    id: 107,
    name: "Puma Softride Comfort Pink Sneakers",
    category: "Footwear",
    subcategory: "Women's Sneakers",
    price: 2299,
    originalPrice: 4499,
    discount: "48% OFF",
    rating: 4.7,
    reviewsCount: 1890,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    tag: "Women's Choice",
    description: "Lightweight pastel pink casual sneakers with SoftFoam+ insoles designed for all-day comfort."
  },
  {
    id: 108,
    name: "Nike Court Vision Low White Sneakers",
    category: "Footwear",
    subcategory: "Women's Sneakers",
    price: 3199,
    originalPrice: 5999,
    discount: "46% OFF",
    rating: 4.8,
    reviewsCount: 2450,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    tag: "Street Style",
    description: "Classic retro 80s basketball style low-top sneakers in crisp white leather."
  },
  {
    id: 109,
    name: "Skechers Arch Fit Slip-On Loafers",
    category: "Footwear",
    subcategory: "Women's Sneakers",
    price: 2799,
    originalPrice: 4999,
    discount: "44% OFF",
    rating: 4.8,
    reviewsCount: 1340,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
    tag: "Orthopedic",
    description: "Podiatrist-certified arch support slip-on mesh shoes for women who stay on their feet."
  },
  {
    id: 110,
    name: "Reebok Club C 85 Vintage Sneakers",
    category: "Footwear",
    subcategory: "Women's Sneakers",
    price: 2499,
    originalPrice: 4499,
    discount: "44% OFF",
    rating: 4.6,
    reviewsCount: 1120,
    image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=80",
    tag: "Vintage Iconic",
    description: "Soft leather upper retro sneakers with comfortable EVA midsole and classic woven label."
  },

  // ==================== FOOTWEAR - KIDS FOOTWEAR ====================
  {
    id: 111,
    name: "Kids Light-Up Cartoon LED Sneakers",
    category: "Footwear",
    subcategory: "Kids Footwear",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.6,
    reviewsCount: 760,
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
    tag: "Kids Favorite",
    description: "Fun LED flashing heel shoes with easy velcro straps for active toddlers and kids."
  },
  {
    id: 112,
    name: "Nike Flex Runner Slip-On Kids Shoes",
    category: "Footwear",
    subcategory: "Kids Footwear",
    price: 1599,
    originalPrice: 2999,
    discount: "46% OFF",
    rating: 4.8,
    reviewsCount: 920,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80",
    tag: "Easy Slip-On",
    description: "Stretchy slip-on design with leather sides for stability and flexible foam soles."
  },
  {
    id: 113,
    name: "Crocs Classic Kids Waterproof Clogs",
    category: "Footwear",
    subcategory: "Kids Footwear",
    price: 1199,
    originalPrice: 1999,
    discount: "40% OFF",
    rating: 4.7,
    reviewsCount: 1450,
    image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80",
    tag: "Waterproof",
    description: "Incredibly light and fun to wear Croslite foam clogs with pivoting heel straps."
  },

  // ==================== FOOTWEAR - FORMAL LEATHER ====================
  {
    id: 114,
    name: "Red Chief Genuine Leather Oxfords",
    category: "Footwear",
    subcategory: "Formal Leather",
    price: 3899,
    originalPrice: 6999,
    discount: "44% OFF",
    rating: 4.9,
    reviewsCount: 980,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
    tag: "Pure Leather",
    description: "Full-grain Italian leather Oxford shoes with stitched leather soles for office & weddings."
  },
  {
    id: 115,
    name: "Bata Derby Tan Brown Leather Shoes",
    category: "Footwear",
    subcategory: "Formal Leather",
    price: 2199,
    originalPrice: 3999,
    discount: "45% OFF",
    rating: 4.6,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
    tag: "Classic Office",
    description: "Sleek tan brown genuine leather Derby lace-ups with padded footbed for working professionals."
  },
  {
    id: 116,
    name: "Clarks Bushacre Leather Chukka Boots",
    category: "Footwear",
    subcategory: "Formal Leather",
    price: 4499,
    originalPrice: 7999,
    discount: "43% OFF",
    rating: 4.8,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    tag: "Premium Chukka",
    description: "Distressed beeswax leather chukka boots with durable synthetic sole and padded insoles."
  },

  // ==================== FOOTWEAR - SPORTS & TREKKING ====================
  {
    id: 117,
    name: "Woodland Waterproof Trekking Boots",
    category: "Footwear",
    subcategory: "Sports & Trekking",
    price: 4299,
    originalPrice: 7999,
    discount: "46% OFF",
    rating: 4.8,
    reviewsCount: 1150,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    tag: "Rugged Outdoor",
    description: "High-ankle Nubuck leather hiking boots with deep anti-skid lug outsoles for mountain trails."
  },
  {
    id: 118,
    name: "Columbia Peakfreak Trail Shoes",
    category: "Footwear",
    subcategory: "Sports & Trekking",
    price: 4999,
    originalPrice: 8999,
    discount: "44% OFF",
    rating: 4.9,
    reviewsCount: 780,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80",
    tag: "Omni-Grip",
    description: "Seam-sealed waterproof breathable mesh boots engineered for wilderness hiking."
  },

  // ==================== MOBILES ====================
  {
    id: 201,
    name: "iPhone 15 Pro Max 256GB Titanium",
    category: "Mobiles",
    subcategory: "5G Flagships",
    price: 134999,
    originalPrice: 149900,
    discount: "10% OFF",
    rating: 4.9,
    reviewsCount: 5400,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    tag: "Top Flagship",
    description: "A17 Pro Bionic chip, 48MP main camera with 5x optical zoom, and lightweight Aerospace titanium body."
  },
  {
    id: 202,
    name: "Samsung Galaxy S24 Ultra 5G AI",
    category: "Mobiles",
    subcategory: "5G Flagships",
    price: 119999,
    originalPrice: 139999,
    discount: "14% OFF",
    rating: 4.8,
    reviewsCount: 4200,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
    tag: "Galaxy AI",
    description: "Snapdragon 8 Gen 3, S-Pen included, 200MP Quad camera, and live call translation AI."
  },
  {
    id: 203,
    name: "OnePlus 12 5G (16GB RAM, 512GB)",
    category: "Mobiles",
    subcategory: "5G Flagships",
    price: 64999,
    originalPrice: 69999,
    discount: "7% OFF",
    rating: 4.7,
    reviewsCount: 2800,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    tag: "100W Charge",
    description: "Hasselblad 4th Gen Camera, 100W SUPERVOOC fast charging, and 2K 120Hz ProXDR screen."
  },
  {
    id: 204,
    name: "Google Pixel 8 Pro 5G (Obsidian)",
    category: "Mobiles",
    subcategory: "5G Flagships",
    price: 79999,
    originalPrice: 93999,
    discount: "15% OFF",
    rating: 4.7,
    reviewsCount: 1950,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    tag: "Best Camera AI",
    description: "Tensor G3 chip, Magic Eraser, Best Take camera AI, and 7 years of Android OS updates."
  },
  {
    id: 205,
    name: "Redmi Note 13 Pro+ 5G (Purple)",
    category: "Mobiles",
    subcategory: "Budget Mobiles",
    price: 27999,
    originalPrice: 33999,
    discount: "17% OFF",
    rating: 4.5,
    reviewsCount: 3600,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80",
    tag: "Best Value",
    description: "200MP OIS camera, 3D Curved 120Hz AMOLED display, IP68 water resistance, and 120W HyperCharge."
  },
  {
    id: 206,
    name: "Nothing Phone (2) 5G Glyph Interface",
    category: "Mobiles",
    subcategory: "5G Flagships",
    price: 36999,
    originalPrice: 44999,
    discount: "17% OFF",
    rating: 4.6,
    reviewsCount: 2100,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
    tag: "Unique Design",
    description: "Iconic transparent back with LED Glyph Interface, Snapdragon 8+ Gen 1, and Sony IMX890 camera."
  },
  {
    id: 207,
    name: "Apple Watch Ultra 2 GPS + Cellular",
    category: "Mobiles",
    subcategory: "Smartwatches",
    price: 79900,
    originalPrice: 89900,
    discount: "11% OFF",
    rating: 4.9,
    reviewsCount: 1100,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    tag: "Pro Smartwatch",
    description: "49mm Titanium case, S9 SiP dual-tap gesture, precision dual-frequency GPS, and 36-hour battery."
  },
  {
    id: 208,
    name: "Samsung Galaxy Watch 6 Classic 47mm",
    category: "Mobiles",
    subcategory: "Smartwatches",
    price: 28999,
    originalPrice: 36999,
    discount: "21% OFF",
    rating: 4.6,
    reviewsCount: 1450,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    tag: "Rotating Bezel",
    description: "Rotating bezel control, BIA body composition sensor, advanced sleep tracking, and ECG monitor."
  },

  // ==================== ELECTRONICS ====================
  {
    id: 301,
    name: "Sony WH-1000XM5 ANC Headphones",
    category: "Electronics",
    subcategory: "Headphones & Earbuds",
    price: 26990,
    originalPrice: 34990,
    discount: "22% OFF",
    rating: 4.8,
    reviewsCount: 4500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    tag: "Best ANC",
    description: "Industry-leading noise cancellation with 8 microphones, Auto NC Optimizer, and 30hr battery."
  },
  {
    id: 302,
    name: "Bose QuietComfort Ultra Headphones",
    category: "Electronics",
    subcategory: "Headphones & Earbuds",
    price: 29900,
    originalPrice: 35900,
    discount: "16% OFF",
    rating: 4.9,
    reviewsCount: 2300,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    tag: "Spatial Audio",
    description: "Immersive spatial audio, custom acoustic tuning, CustomTune sound calibration, and ultra-soft pads."
  },
  {
    id: 303,
    name: "Apple AirPods Pro (2nd Gen) USB-C",
    category: "Electronics",
    subcategory: "Headphones & Earbuds",
    price: 21900,
    originalPrice: 24900,
    discount: "12% OFF",
    rating: 4.9,
    reviewsCount: 6100,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    tag: "H2 Chip",
    description: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Conversation Awareness, and MagSafe case."
  },
  {
    id: 304,
    name: "MacBook Pro 16\" M3 Max (36GB RAM)",
    category: "Electronics",
    subcategory: "Laptops & Monitors",
    price: 319900,
    originalPrice: 349900,
    discount: "8% OFF",
    rating: 5.0,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    tag: "Powerhouse",
    description: "Liquid Retina XDR display, M3 Max 16-Core CPU, 40-Core GPU for 8K video editing and 3D rendering."
  },
  {
    id: 305,
    name: "ASUS ROG Strix G16 Gaming Laptop",
    category: "Electronics",
    subcategory: "Laptops & Monitors",
    price: 189990,
    originalPrice: 219990,
    discount: "13% OFF",
    rating: 4.8,
    reviewsCount: 1200,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    tag: "RTX 4080",
    description: "Intel Core i9-13980HX, NVIDIA GeForce RTX 4080 GPU, 240Hz QHD+ ROG Nebula display, liquid metal."
  },
  {
    id: 306,
    name: "Keychron K2 Mechanical Keyboard",
    category: "Electronics",
    subcategory: "Gaming Gear",
    price: 6999,
    originalPrice: 9999,
    discount: "30% OFF",
    rating: 4.9,
    reviewsCount: 1450,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    tag: "Hot Swappable",
    description: "Compact 75% layout, Gateron Mechanical switches, Mac & Windows Bluetooth wireless connection."
  },
  {
    id: 307,
    name: "LG UltraGear 27\" 4K 144Hz Gaming Monitor",
    category: "Electronics",
    subcategory: "Laptops & Monitors",
    price: 45999,
    originalPrice: 59999,
    discount: "23% OFF",
    rating: 4.8,
    reviewsCount: 950,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    tag: "Nano IPS",
    description: "1ms GTG response time, VESA DisplayHDR 600, G-SYNC Compatible, and HDMI 2.1 support."
  },

  // ==================== FASHION ====================
  {
    id: 401,
    name: "Men's Slim Washed Denim Jacket",
    category: "Fashion",
    subcategory: "Men's Clothing",
    price: 1999,
    originalPrice: 3999,
    discount: "50% OFF",
    rating: 4.6,
    reviewsCount: 1120,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    tag: "Winter Fashion",
    description: "Durable washed blue cotton denim jacket with metal button closures and fleece lining."
  },
  {
    id: 402,
    name: "Men's Pure Linen Summer Shirt",
    category: "Fashion",
    subcategory: "Men's Clothing",
    price: 1299,
    originalPrice: 2499,
    discount: "48% OFF",
    rating: 4.7,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    tag: "100% Linen",
    description: "Breathable mandarin collar pure linen shirt perfect for summer vacations and beachwear."
  },
  {
    id: 403,
    name: "Women's Floral Chiffon Maxi Dress",
    category: "Fashion",
    subcategory: "Women's Wear",
    price: 1499,
    originalPrice: 2999,
    discount: "50% OFF",
    rating: 4.7,
    reviewsCount: 1650,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    tag: "Bestseller",
    description: "Lightweight breathable chiffon maxi dress with ruffled sleeves and elastic waistband."
  },
  {
    id: 404,
    name: "Women's Leather Tote Handbag",
    category: "Fashion",
    subcategory: "Backpacks & Luggage",
    price: 2499,
    originalPrice: 4999,
    discount: "50% OFF",
    rating: 4.8,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    tag: "Luxury Tote",
    description: "Elegant textured vegan leather tote bag with gold-tone hardware and zippered compartments."
  },
  {
    id: 405,
    name: "Ray-Ban Aviator Polarized Sunglasses",
    category: "Fashion",
    subcategory: "Sunglasses",
    price: 5490,
    originalPrice: 7990,
    discount: "31% OFF",
    rating: 4.8,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    tag: "Classic Icon",
    description: "Gold metal frame with G-15 green polarized lenses offering 100% UV protection."
  },
  {
    id: 406,
    name: "Men's Classic Biker Leather Jacket",
    category: "Fashion",
    subcategory: "Men's Clothing",
    price: 4999,
    originalPrice: 8999,
    discount: "44% OFF",
    rating: 4.9,
    reviewsCount: 1320,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
    tag: "Real Leather",
    description: "Heavyweight genuine lambskin leather jacket with asymmetrical zip closure."
  },

  // ==================== APPLIANCES ====================
  {
    id: 501,
    name: "Philips Digital Air Fryer XL 6.2L",
    category: "Appliances",
    subcategory: "Air Fryers",
    price: 8999,
    originalPrice: 14999,
    discount: "40% OFF",
    rating: 4.8,
    reviewsCount: 2300,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    tag: "Health Cooking",
    description: "Rapid Air technology with 14-in-1 cooking functions and touch window screen."
  },
  {
    id: 502,
    name: "De'Longhi Espresso Coffee Machine",
    category: "Appliances",
    subcategory: "Kitchen Appliances",
    price: 16999,
    originalPrice: 24999,
    discount: "32% OFF",
    rating: 4.9,
    reviewsCount: 1120,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    tag: "Barista Quality",
    description: "15-bar pump pressure, manual milk frother wand for lattes, cappuccinos & macchiatos."
  },
  {
    id: 503,
    name: "Dyson V15 Cordless Vacuum Cleaner",
    category: "Appliances",
    subcategory: "Home Essentials",
    price: 49900,
    originalPrice: 59900,
    discount: "16% OFF",
    rating: 4.9,
    reviewsCount: 1780,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    tag: "HEPA Filtration",
    description: "Laser reveals microscopic dust, intelligent suction adaptation, and HEPA multi-stage filtration."
  },
  {
    id: 504,
    name: "Instant Pot Duo 7-in-1 Multi Cooker",
    category: "Appliances",
    subcategory: "Kitchen Appliances",
    price: 7499,
    originalPrice: 11999,
    discount: "37% OFF",
    rating: 4.8,
    reviewsCount: 3400,
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80",
    tag: "Smart Pressure",
    description: "Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, and warmer."
  },

  // ==================== BEAUTY ====================
  {
    id: 601,
    name: "Minimalist 10% Niacinamide Serum",
    category: "Beauty",
    subcategory: "Facial Serums",
    price: 599,
    originalPrice: 999,
    discount: "40% OFF",
    rating: 4.7,
    reviewsCount: 3100,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    tag: "Dermatologist Approved",
    description: "Nourishing facial serum formulated with Zinc PCA to reduce acne spots and oiliness."
  },
  {
    id: 602,
    name: "CeraVe Hydrating Facial Cleanser",
    category: "Beauty",
    subcategory: "Skincare",
    price: 1199,
    originalPrice: 1699,
    discount: "29% OFF",
    rating: 4.9,
    reviewsCount: 4800,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    tag: "Gentle Skin",
    description: "Non-foaming face wash with 3 essential ceramides & hyaluronic acid for normal to dry skin."
  },
  {
    id: 603,
    name: "Estée Lauder Advanced Night Repair",
    category: "Beauty",
    subcategory: "Facial Serums",
    price: 5900,
    originalPrice: 7900,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 2100,
    image: "https://images.unsplash.com/photo-1608248597263-0057e57b4524?w=800&q=80",
    tag: "Anti-Aging",
    description: "Deep nighttime recovery serum reducing appearance of multiple signs of skin aging."
  },

  // ==================== SPORTS ====================
  {
    id: 701,
    name: "Pro Rubber Hex Dumbbell Set 20kg",
    category: "Sports",
    subcategory: "Fitness Equipment",
    price: 2499,
    originalPrice: 4999,
    discount: "50% OFF",
    rating: 4.8,
    reviewsCount: 1650,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    tag: "Home Workout",
    description: "Non-slip ergonomic chrome handle hex dumbbells ideal for home strength training."
  },
  {
    id: 702,
    name: "Eco Non-Slip Yoga Mat 6mm",
    category: "Sports",
    subcategory: "Fitness Equipment",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.7,
    reviewsCount: 2200,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    tag: "Extra Cushion",
    description: "High-density TPE eco-friendly non-slip yoga mat with carrying strap."
  },
  {
    id: 703,
    name: "Under Armour Men's Compression Shirt",
    category: "Sports",
    subcategory: "Sportswear",
    price: 1799,
    originalPrice: 3299,
    discount: "45% OFF",
    rating: 4.8,
    reviewsCount: 1450,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    tag: "HeatGear",
    description: "Ultra-tight compression fit shirt with moisture transport system to keep you dry."
  }
];

// Enrich products with Multi-Vendor metadata
const enrichedProducts = products.map((p) => {
  let sellerName = "ShopMate Direct";
  let sellerRating = 4.8;
  let vendorId = 1;

  const nameLower = p.name.toLowerCase();
  if (nameLower.includes("nike")) {
    sellerName = "Nike Official Store";
    sellerRating = 4.9;
    vendorId = 1;
  } else if (nameLower.includes("apple") || nameLower.includes("iphone") || nameLower.includes("macbook") || nameLower.includes("airpods")) {
    sellerName = "Apple Authorised Reseller";
    sellerRating = 4.95;
    vendorId = 2;
  } else if (nameLower.includes("samsung") || nameLower.includes("galaxy")) {
    sellerName = "Samsung Galaxy Experience";
    sellerRating = 4.8;
    vendorId = 3;
  } else if (nameLower.includes("puma")) {
    sellerName = "Puma India Direct";
    sellerRating = 4.75;
    vendorId = 4;
  } else if (nameLower.includes("sony") || nameLower.includes("bose") || nameLower.includes("lg")) {
    sellerName = "Sony Audio & Vision Flagship";
    sellerRating = 4.85;
    vendorId = 5;
  } else if (nameLower.includes("minimalist") || nameLower.includes("cerave") || nameLower.includes("estée")) {
    sellerName = "Minimalist Skincare Hub";
    sellerRating = 4.8;
    vendorId = 6;
  }

  return {
    ...p,
    sellerName,
    sellerRating,
    vendorId
  };
});

export default enrichedProducts;