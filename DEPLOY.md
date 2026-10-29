# Deploy ShopMate (free): MongoDB Atlas + Render + Vercel

## 1. Database: MongoDB Atlas
1. Create a free **M0** cluster at mongodb.com/atlas.
2. Database Access -> add a user (username + password).
3. Network Access -> Add IP -> **Allow access from anywhere** (0.0.0.0/0).
4. Connect -> Drivers -> copy the connection string and put your password in it. Add the DB name before `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/shopmate?retryWrites=true&w=majority`

## 2. Fill the database with products (run once on your computer)
```
cd server
# put the Atlas string in server/.env as MONGO_URI=...
npm run seed
```

## 3. Backend: Render
1. render.com -> New -> **Web Service** -> connect your GitHub repo.
2. Root Directory: `server`   Build: `npm install`   Start: `npm start`
3. Environment variables:

| Name | Value |
|---|---|
| MONGO_URI | the Atlas string |
| JWT_SECRET | a long random text (NOT the old one) |
| ADMIN_EMAIL | admin@shopmate.com |
| ADMIN_PASSWORD | your demo admin password |
| SHOP_WHATSAPP | 91XXXXXXXXXX (no + or spaces) |
| CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET | from your Cloudinary dashboard |
| CLIENT_URL | your Vercel URL (add after step 4) |

4. Deploy. Open `https://YOUR-API.onrender.com/api/health` -> should show `{"ok":true}`.
   (Free Render sleeps after 15 min; the first request after that takes ~30 sec.)

## 4. Frontend: Vercel
1. vercel.com -> Add New Project -> same repo.
2. Root Directory: `client`   Framework: Vite
3. Environment variable: `VITE_API_URL` = `https://YOUR-API.onrender.com` (no slash at the end)
4. Deploy, then copy the Vercel URL into Render's `CLIENT_URL` and redeploy the backend.

## 5. Check
Open the Vercel link -> products load -> sign up -> add to cart -> checkout -> WhatsApp button appears.
