# Lumora — Home Appliances, Electrical & Building Materials Hub

A modern, fullstack e-commerce and service booking platform for **Lumora**, a premier Nigerian supplier of home appliances, electrical materials, building materials, and smart home solutions with certified professional installation services.

> *"Illuminate Your Space. Build Your World."*

---

## 🌟 Key Features

### 🛒 E-Commerce & Product Catalog

- **4 Core Categories**: Home Appliances, Electrical Materials, Building Materials, and Home Solutions (Smart Home, CCTV, Solar & Inverters).
- **Product Filtering & Sorting**: Instant client-side filtering by category, brand, price range, and sorting.
- **Product Details & Ratings**: High-resolution image galleries, detailed specifications, warranty coverage, star ratings, and reviews.
- **Dynamic Installation Add-On**: Toggle certified professional installation fees directly on product pages and at checkout.

### 🔧 Professional Installation & Booking

- **Dedicated Services**: Air conditioner installation, TV wall mounting, inverter & solar systems, smart security & CCTV, water pump setups, generator setup, ceiling fan installation, and structural electrical wiring.
- **Interactive Booking System**: Schedule certified technicians with preferred dates, time slots, and service location details.

### 💳 Checkout & Nationwide Delivery

- **Flexible Cart**: Manage product orders alongside scheduled installation services.
- **Secure Payment & Delivery**: Multi-step checkout configured for nationwide delivery across Nigeria with instant WhatsApp customer support.

### 👤 Customer & Admin Portals

- **Customer Account**: Track active orders, view past installation service history, and update delivery addresses.
- **Admin Dashboard**: Comprehensive operations suite with business KPI metrics, revenue/booking charts (Recharts), full CRUD product management with modal editors, services management, customer directory, and booking calendar.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start/latest) (Fullstack SSR with React 19)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest) (Type-safe file-based routing)
- **Data Fetching & State**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Package Manager**: [Bun](https://bun.sh/) (or Node.js / npm / pnpm)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+) installed.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ifeblessing726-prog/bn-pro-install.git
   cd bn-pro-install
   ```

2. **Install dependencies**:

   ```bash
   bun install
   # or: npm install
   ```

3. **Run the development server**:

   ```bash
   bun run dev
   # or: npm run dev
   ```

4. Open your browser and navigate to [http://localhost:8080](http://localhost:8080).

---

## 📜 Available Scripts

| Command           | Description                                                            |
| :---------------- | :--------------------------------------------------------------------- |
| `bun run dev`     | Starts the Vite development server with SSR at `http://localhost:8080` |
| `bun run build`   | Builds client and server bundles for production                        |
| `bun run preview` | Previews the production build locally                                  |
| `bun run lint`    | Runs ESLint across the codebase                                        |
| `bun run format`  | Formats all code with Prettier                                         |

---

## 📁 Project Structure

```text
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Images and local media
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Radix & Tailwind design system primitives
│   │   ├── site-header.tsx # Global navigation header
│   │   ├── site-footer.tsx # Global footer
│   │   └── whatsapp.tsx    # Floating WhatsApp contact button
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Cart state, formatting, catalog data & helpers
│   ├── routes/             # File-based routes (TanStack Router)
│   │   ├── __root.tsx      # Root application layout & providers
│   │   ├── index.tsx       # Landing page
│   │   ├── shop.tsx        # Product catalog
│   │   ├── product.$slug.tsx # Dynamic product page
│   │   ├── services.tsx    # Installation services overview
│   │   ├── booking.tsx     # Technician booking flow
│   │   ├── cart.tsx        # Shopping cart
│   │   ├── checkout.tsx    # Multi-step checkout
│   │   ├── account.tsx     # User account portal
│   │   ├── admin.tsx       # Admin management dashboard
│   │   └── contact.tsx     # Contact & branch information
│   ├── router.tsx          # Router configuration
│   ├── server.ts           # SSR server entry
│   └── styles.css          # Global styling & Tailwind directives
├── package.json
├── tsconfig.json
└── vite.config.ts          # Vite build & TanStack Start configuration
```

---

## 📄 License

This project is proprietary and built for BN Electricals and Home Appliances.
