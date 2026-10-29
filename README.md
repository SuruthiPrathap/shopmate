# ShopMate - Multi-vendor E-commerce (MERN)

A Flipkart-style marketplace with customers, sellers and an admin.

**Live demo:** _add your Vercel link_  
**Demo admin:** `admin@shopmate.com` / `admin123` (demo only)

## Features
- Customer sign up / login (JWT), cart, wishlist, smart search ("shoes under 3k", "best rated")
- Checkout with address form, Cash on Delivery, order history
- **WhatsApp order confirmation** - after ordering, one tap opens WhatsApp with the full order details
- **Seller onboarding**: apply -> admin approves/rejects -> approved sellers list products with photo upload
- Admin panel: approve sellers, manage products and orders
- Image upload to Cloudinary
- Prices are always recalculated on the server (the browser cannot change them)

## Tech
React 19 + Vite - Node.js + Express 5 - MongoDB + Mongoose - JWT + bcrypt - Cloudinary - Multer

## Run locally
```
cd server && cp .env.example .env   # fill values
npm install && npm run seed && npm run dev

cd client && npm install && npm run dev
```
Open http://localhost:5173

## Screenshots
_add 3-4 screenshots here (home, product, cart/checkout, admin)_
