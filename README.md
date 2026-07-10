# Nunya AI (Fato)

**Nunya AI** (also known as Fato) is a smart, AI-powered post-harvest management, logistics coordination, and agricultural marketplace platform tailored for the Volta Region of Ghana. It connects farmers, buyers, and transporters on a single platform, optimizing supply chains, enhancing trust through a verification system, and utilizing Mapbox routing to provide dynamic delivery calculations.

---

## 🚀 Key Features by User Role

### 1. 🌾 Farmer Portal
* **Produce Listing Management:** List, edit, and delete produce (e.g. cassava, tomatoes, maize) with required image uploads, quantity units, prices, and freshness indicators.
* **Cost & Route Estimator:** Interactive Mapbox integration to plan transport routes from community farms to regional hubs (Ho, Keta, Anloga, Sogakope, Accra) with real-time driving distance, ETA, and price quotes.
* **Post-Harvest Health Insights:** AI-driven storage temperature, humidity tracking, and crop risk recommendations to minimize spoilage.
* **Market Insights:** Dynamic price trends and demand forecasts to optimize harvesting schedules.

### 2. 🛒 Buyer & Trader Portal
* **Interactive Marketplace:** Browse and purchase listed produce, complete with ratings, freshness badges, and verification status.
* **Smart Ranking:** View local listings ranked by optimal freshness and shortest transport distance.
* **Order & Shipments Tracker:** Monitor pending, shipped, and completed orders with delivery ETAs.
* **Saved Suppliers:** Keep a custom list of trusted farmers with high reliability rates.

### 3. 🚛 Transporter Portal
* **Job Marketplace:** Claim available cargo haulage requests matching vehicle capacity.
* **Real-Time Deliveries:** Track in-transit routes, ETA, and progress on interactive Mapbox maps.
* **Earnings & Revenue:** Detailed breakdown of today's, weekly, and monthly cargo payout metrics.
* **Vehicle Auditing:** Monitor fuel, maintenance schedules, and license credentials.

### 4. 🛡️ Platform Admin Dashboard
* **Dynamic Analytics:** Platform statistics (Total Users, Active Listings, Jobs, Monthly Revenue) computed in real-time.
* **User Management:** Filter, browse, and audit all registered platform accounts.
* **Document Verification Queue:** Direct controls to review and toggle verification flags (Phone, Email, National ID Card, Location Audit, and Vehicle Safety audits) for Farmers, Buyers, and Transporters.
* **Region Performance & Alerts:** Monitor regional growth metrics (Ho, Keta, Anloga) and high-priority platform alerts.

---

## 💬 Shared Platform Features
* **Live In-App Chat:** Real-time chat system powered by Firestore, featuring automatic simulated AI responses if Firestore database calls fall back.
* **WhatsApp Calls Integration:** Quick-action buttons to redirect and contact other users via WhatsApp using registered country codes (`+233` for Ghana).
* **Robust Auth & Local Cache:** Secure Firebase Sign-in (Email, Password, Phone OTP, Google OAuth) with local device caching to ensure users retain their role-gated access during temporary offline periods.

---

## 🛠️ Technology Stack
* **Frontend:** React.js, Tailwind CSS, Lucide icons, Vite.
* **Backend:** Firebase (Auth & Firestore) for user data and real-time messaging.
* **Maps:** Mapbox GL JS for route calculation and cost estimation based on actual driving distances.
* **Capabilities:** Progressive Web App (PWA) configuration with service workers for caching and reliability.

---

## 📦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fato
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file in the root directory and add your Mapbox and Firebase credentials:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   VITE_FIREBASE_API_KEY=your_firebase_key
   # Add other Firebase config values as required
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at the port outputted in your console (e.g. `http://localhost:3000/`).

5. Build for production:
   ```bash
   npm run build
   ```
