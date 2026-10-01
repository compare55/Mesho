# Meesho Reselling Platform - Render Ready Codebase

Yeh ek full-fledged **Meesho Reselling Web Application** ka complete ready-to-deploy codebase hai.

## 🚀 Key Features Included
1. **Catalog & Wholesale Products Storefront:** High margin products at wholesale pricing.
2. **Reseller Margin Calculator & WhatsApp Sharing:** Reseller can customize price, auto-calculate profit margin, and generate direct shareable WhatsApp catalog links.
3. **Customer Order Placement:** COD / Online order placement with reseller margin credit.
4. **Reseller Dashboard (`/reseller.html`):** Real-time margin tracking, payout status, and customer order history.
5. **Supplier Portal (`/supplier.html`):** Add new wholesale products to the platform catalog.
6. **Admin Panel (`/admin.html`):** Complete system analytics, total GMV, and commission payouts tracking.

---

## 🛠️ Render Par Deploy Kaise Karein (Step-by-Step Guide)

### Step 1: ZIP File Unzip karein & GitHub Par Push Karein
1. Is ZIP file ko apne computer par **Extract/Unzip** karein.
2. Apne **GitHub** account par ek naya repository banayein (Jaise: `meesho-clone-app`).
3. Yeh saare files GitHub repository me upload/push kar dein.

### Step 2: Render.com Par Web Service Banayein
1. [Render.com](https://render.com) par free account login karein.
2. Dashboard me **New +** button par click karke **Web Service** select karein.
3. Apne GitHub repository (`meesho-clone-app`) ko connect karein.
4. Niche diye gaye configuration settings set karein:
   - **Name:** `meesho-clone`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. **Create Web Service** button par click kar dein!

Render automatically aapka app build aur deploy kar dega aur aapko ek live `.onrender.com` URL mil jayegi!

---

## 💻 Local PC Par Run Karne Ka Tarika
1. Project folder me terminal kholein.
2. Command chalayein: `npm install`
3. Node server start karein: `npm start`
4. Browser me kholein: `http://localhost:3000`
