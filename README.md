# ShopMate – Multi-vendor Marketplace

A full-stack MERN marketplace where customers shop, sellers list products and admins approve sellers.

**Live Demo:** https://shopmate-rc15.vercel.app/

## Features
- Registration and login with JWT authentication
- Three roles: Customer, Seller and Admin, each with its own workflow
- Seller approval process by the admin
- Sellers can upload product images and PDF certificate documents
- Cart and checkout
- Server-side price recalculation, so prices can't be changed from the browser
- Checkout validation for 2 payment methods: Cash on Delivery and UPI ID
- WhatsApp order confirmation
- Natural-language product search across 200 demo products

## Tech Stack
| Area | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Deployment | Vercel |

## Screenshots
<Add 3–4 images: home page, product page, seller dashboard, admin dashboard>

## How to Run Locally
1. Clone the repo
   ```
   git clone https://github.com/SuruthiPrathap/shopmate.git
   cd shopmate
   ```
2. Install and start the backend
   ```
   cd <backend-folder>
   npm install
   npm start
   ```
3. Install and start the frontend
   ```
   cd <frontend-folder>
   npm install
   npm run dev
   ```
4. Create a `.env` file in the backend, for example:
   ```
   MONGO_URI=<your-mongodb-url>
   JWT_SECRET=<your-secret-key>
   ```

## Author
Suruthi Prathap S


cd client && npm install && npm run dev
```
Open http://localhost:5173

## Screenshots
_add 3-4 screenshots here (home, product, cart/checkout, admin)_
