# ShopIt - Product Listing & Cart Web App

Welcome to ShopIt, a responsive and clean e-commerce frontend built using React, Vite, Tailwind CSS, and the DummyJSON Products API.

---

## Setup Instructions

Getting this project running locally takes less than a minute:

1. Clone or navigate into the project folder:
   ```bash
   cd shopping-app
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start the local dev server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`. That's it!

4. Other helpful commands:
   - `npm run lint` — Checks for any lint or code formatting issues
   - `npm run build` — Compiles TypeScript and creates a production-ready build in `/dist`
   - `npm run preview` — Previews the production build locally

---

## Assumptions Made

When putting this project together, here are the main things I kept in mind:
- ## Simple, Easy to Use & Interactive:  
The shopping experience should feel familiar, snappy, and intuitive like popular sites (Amazon-style clean buttons and instant visual feedback).

- ## Interactive Cart Controls on Cards:
 When someone adds a product, the button instantly turns into "Added to Cart" with + and - buttons right next to it so people can adjust quantities right from the catalog without jumping around.
- ## Combined Client-Side Filtering:
 Since DummyJSON's public API endpoints don't support combined multi-brand and price filtering on the server in a single call, products are fetched upfront to allow instant multi-category, brand counts, price range, and search filtering without lag.

---

## Architectural Decisions

Here's how the frontend is structured in just 4 key points:
- ## Amazon-Inspired UI & Pacifico Font:
 Clean layout styled with Tailwind CSS, warm Amazon gold/orange buttons, and Google's Pacifico font for a friendly brand identity.
- ## React Router DOM with URL Sync: 
Manages routing between Listing, Product Details, and Cart, while syncing all selected filters and pagination directly into URL search params so the state stays intact on page refresh or browser back navigation.
- ## Local Storage State Persistence: 
Lightweight Cart Context that syncs cart items and quantities to localStorage , ensuring your cart isn't lost when you close or reload the tab.
- ## Minimal Ant Design & Skeleton Loaders: 
Ant Design integration kept minimal and simple, combined with custom shimmer skeleton placeholders across all cards and images to prevent layout shift while products load.

---

## Improvements If Given More Time

If I had extra time to build on this, here are the top things I would tackle next:
- # Full Login & Auth Flow:  
 Replace the static mock profile with actual login/signup , session management, and saved user profiles.

- ## Wishlist & Save for Later: 
Allow users to bookmark items to save them for future purchases.
- ## Email Notification Flow: 
Send automated email notifications for order confirmations, shipping/dispatch updates, and abandoned cart reminders.

