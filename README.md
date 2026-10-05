# AuraStore — Full-Stack E-Commerce Web Application

A full-stack, responsive, and modern e-commerce web application built for an internship project. Featuring a React + Vite frontend, a modular Python Flask REST API backend, and an SQLite database with full authentication, catalog management, shopping cart, demo checkout, order tracking, and an admin dashboard.

---

## 🌟 Project Overview

**AuraStore** delivers a complete real-world e-commerce shopping experience with end-to-end functionality:
- **Real Working Application**: Backed by a live Flask REST API and SQLite database (no mock external APIs).
- **Role-Based Access Control**: Secure JWT authentication with separate permissions for Customers and Administrators.
- **Product Catalog & Details**: Dynamic search, multi-criteria filtering, price sorting, real-time stock badges, and detailed view with related recommendations.
- **Persistent Shopping Cart**: Live quantity adjustments, strict stock enforcement, tax calculation (8%), and free shipping progress tracker.
- **Safe Demo Checkout Flow**: Interactive shipping address form with simulated demo checkout that records orders and adjusts product inventory in SQLite.
- **Order Management & Live Tracker**: Step-by-step progress timeline (Pending → Processing → Shipped → Delivered) and user-specific order isolation.
- **Admin Management Portal**: Real-time statistics (Revenue, Orders, Products, Users), inventory CRUD operations with live image preview, and order status updates.
- **Modern UI & Theme System**: Dark/Light mode toggle, glassmorphism design, responsive layouts, and micro-interactions.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Component-based UI with fast HMR bundling |
| **Routing** | React Router v6 | Client-side routing with `ProtectedRoute` and `AdminRoute` guards |
| **Icons & FX** | Lucide React, Canvas-Confetti | Modern feather icons & festive order confirmation effects |
| **Styling** | Vanilla CSS Design System | Custom CSS variables, responsive design, Dark/Light modes |
| **Backend** | Python 3, Flask 3 | Modular REST API with Application Factory pattern and Blueprints |
| **Database** | SQLite, Flask-SQLAlchemy | Relational database with foreign key constraints & cascading deletes |
| **Security** | Werkzeug, PyJWT | Salted password hashing (`generate_password_hash`) & JWT token authentication |
| **CORS** | Flask-CORS | Cross-origin resource sharing configuration |

---

## 📁 Project Folder Structure

```
E-Commerce-Web-App/
├── .gitignore                      # Git ignore configuration
├── README.md                       # Comprehensive project documentation
├── backend/
│   ├── .env.example                # Example environment variables template
│   ├── .env                        # Local development environment configuration
│   ├── requirements.txt            # Python dependencies
│   ├── run.py                      # Flask development server entrypoint (Port 5000)
│   ├── seed.py                     # Database initialization and demo seed script
│   ├── test_api.py                 # Automated 22-step API test suite
│   ├── ecommerce.db                # SQLite database (generated on seed)
│   └── app/
│       ├── __init__.py             # App factory, CORS, blueprints & error handlers
│       ├── config.py               # Application configuration & JWT secrets
│       ├── database.py             # SQLAlchemy db instance
│       ├── models.py               # User, Product, Order, and OrderItem models
│       ├── utils/
│       │   ├── __init__.py
│       │   └── auth_middleware.py  # JWT token validation & admin decorators
│       └── routes/
│           ├── __init__.py
│           ├── auth.py             # /api/auth routes (login, register, me, profile)
│           ├── products.py         # /api/products routes (list, filter, CRUD)
│           ├── orders.py           # /api/orders routes (place order, history, details)
│           └── admin.py            # /api/admin routes (stats, all orders, status update)
└── frontend/
    ├── package.json                # Frontend package dependencies & scripts
    ├── vite.config.js              # Vite server & API proxy config (Port 3000)
    ├── index.html                  # HTML entry point with Plus Jakarta Sans & Outfit fonts
    └── src/
        ├── main.jsx                # React root renderer
        ├── App.jsx                 # Routes configuration & top-level layout
        ├── index.css               # Design system, CSS variables & theme styling
        ├── context/
        │   ├── AuthContext.jsx     # Authentication state & JWT storage
        │   ├── CartContext.jsx     # Persistent cart state & totals calculations
        │   ├── ThemeContext.jsx    # Light/Dark mode state management
        │   └── ToastContext.jsx    # Floating notification banner system
        ├── services/
        │   └── api.js              # Fetch client wrapper with Bearer token injection
        ├── components/
        │   ├── Navbar.jsx          # Sticky navbar with search, cart counter & auth dropdown
        │   ├── Footer.jsx          # Footer with trust badges, links & credentials
        │   ├── ProductCard.jsx     # Product card with hover zoom & quick add
        │   ├── SearchBar.jsx       # Reusable search bar with clear button
        │   ├── Filters.jsx         # Sidebar filters (categories, price, stock, sorting)
        │   ├── CartItem.jsx        # Line item with stepper quantity controls
        │   ├── RatingStars.jsx     # Star rating display component
        │   ├── ProtectedRoute.jsx  # Auth guard component
        │   ├── AdminRoute.jsx      # Admin role guard component
        │   └── SkeletonLoader.jsx  # Loading shimmer skeletons
        └── pages/
            ├── Home.jsx            # Hero, category grid, featured & trending products
            ├── ProductList.jsx     # Shop catalog with multi-filtering and search
            ├── ProductDetails.jsx  # Detailed product view, image & quantity selector
            ├── Cart.jsx            # Shopping cart overview & free shipping tracker
            ├── Checkout.jsx        # Shipping details form & demo order placement
            ├── OrderConfirmation.jsx # Confirmation page with celebration confetti
            ├── Orders.jsx          # User order history
            ├── OrderDetails.jsx    # Order tracking timeline & breakdown
            ├── Login.jsx           # User login with 1-click demo autofill buttons
            ├── Register.jsx        # Account registration
            ├── UserProfile.jsx     # Account settings & password change
            └── admin/
                ├── AdminDashboard.jsx  # Stats, product CRUD table & order manager
                └── ProductFormModal.jsx # Add/Edit product modal with live preview
```

---

## 🗄️ Database Structure

### 1. `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(120) | UNIQUE, NOT NULL | User email (used for login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Werkzeug-hashed password |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'user' | Role (`user` or `admin`) |
| `created_at` | DATETIME | DEFAULT UTC Now | Account registration timestamp |

### 2. `products` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique product identifier |
| `name` | VARCHAR(200) | NOT NULL | Product title |
| `description` | TEXT | NULLABLE | Detailed description |
| `category` | VARCHAR(100) | NOT NULL | Category (Electronics, Accessories, Clothing, Home) |
| `price` | FLOAT | NOT NULL | Unit price |
| `image_url` | VARCHAR(500) | NULLABLE | Public image URL |
| `stock` | INTEGER | NOT NULL, DEFAULT 0 | Available stock inventory |
| `rating` | FLOAT | NOT NULL, DEFAULT 4.5 | Rating score (1.0 - 5.0) |
| `created_at` | DATETIME | DEFAULT UTC Now | Creation date |
| `updated_at` | DATETIME | ON UPDATE UTC Now | Last modification date |

### 3. `orders` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique order identifier |
| `user_id` | INTEGER | FOREIGN KEY (`users.id`) | Reference to customer |
| `total_amount` | FLOAT | NOT NULL | Total amount charged |
| `status` | VARCHAR(50) | DEFAULT 'Pending' | Status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |
| `shipping_name` | VARCHAR(100) | NOT NULL | Shipping recipient name |
| `shipping_email`| VARCHAR(120) | NOT NULL | Shipping email |
| `shipping_phone`| VARCHAR(20) | NOT NULL | Shipping contact number |
| `shipping_address`| TEXT | NOT NULL | Street address |
| `shipping_city` | VARCHAR(100) | NOT NULL | City |
| `shipping_state`| VARCHAR(100) | NOT NULL | State / Province |
| `shipping_pincode`| VARCHAR(20) | NOT NULL | Postal code |
| `created_at` | DATETIME | DEFAULT UTC Now | Order placement timestamp |

### 4. `order_items` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique order item ID |
| `order_id` | INTEGER | FOREIGN KEY (`orders.id`) | Reference to order |
| `product_id` | INTEGER | FOREIGN KEY (`products.id`) | Reference to product |
| `quantity` | INTEGER | NOT NULL | Quantity ordered |
| `price` | FLOAT | NOT NULL | Price per unit at purchase |

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/logout` — Invalidate client session
- `GET  /api/auth/me` — Get authenticated user details *(Bearer Token Required)*
- `PUT  /api/auth/profile` — Update name / password *(Bearer Token Required)*

### 📦 Products (`/api/products`)
- `GET    /api/products` — Get products with filtering (`search`, `category`, `min_price`, `max_price`, `in_stock`, `sort_by`, `limit`)
- `GET    /api/products/categories` — Get distinct categories and item counts
- `GET    /api/products/<id>` — Get single product details and related items
- `POST   /api/products` — Create a new product *(Admin Only)*
- `PUT    /api/products/<id>` — Update product details *(Admin Only)*
- `DELETE /api/products/<id>` — Delete a product *(Admin Only)*

### 🛒 Orders (`/api/orders`)
- `POST /api/orders` — Place a new order with stock validation *(Bearer Token Required)*
- `GET  /api/orders` — Get order history for the logged-in customer *(Bearer Token Required)*
- `GET  /api/orders/<id>` — Get specific order details *(Order Owner or Admin Only)*

### 🛡️ Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Retrieve overall store metrics, revenue & low stock alerts *(Admin Only)*
- `GET /api/admin/orders` — Retrieve all customer orders with filters *(Admin Only)*
- `PUT /api/admin/orders/<id>/status` — Update order status and restock on cancel *(Admin Only)*

---

## 🔑 Demo Login Credentials

For local evaluation and testing, the seed script creates the following demo accounts:

### 👑 Administrator Account
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`
- **Permissions:** Full access to product catalog CRUD, order status updates, and store revenue analytics.

### 👤 Customer / User Account
- **Email:** `user@ecommerce.com`
- **Password:** `user123`
- **Permissions:** Browse catalog, add to cart, place orders, view personal order history & tracking timeline.

> 💡 *Tip: The Login page includes 1-click **⚡ Demo User** and **⚡ Demo Admin** buttons to autofill credentials instantly.*

---

## 🚀 Step-by-Step Setup & Running Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Step 1: Clone or Navigate to the Project
```bash
cd E-Commerce-Web-App
```

---

### Step 2: Backend Setup & Seed Database

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize and seed the SQLite database:
   ```bash
   python seed.py
   ```
   *This creates `ecommerce.db`, seeds 17 realistic products across 4 categories, and registers the demo Admin and User accounts.*

5. Start the Flask backend server:
   ```bash
   python run.py
   ```
   *Backend will run on **http://127.0.0.1:5000***

---

### Step 3: Frontend Setup

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on **http://localhost:3000***

---

### Step 4: Run Automated Verification Tests

To verify that all 22 backend endpoints and security rules work properly:
```bash
cd backend
python test_api.py
```
Expected output: `TEST SUITE SUMMARY: 22/22 TESTS PASSED — 100% SUCCESS!`

---

## 🌐 Local URLs Summary

| Service | URL |
|---|---|
| **Frontend Application** | [http://localhost:3000](http://localhost:3000) |
| **Backend API Root** | [http://127.0.0.1:5000](http://127.0.0.1:5000) |
| **API Health Endpoint** | [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health) |

---

## ⚙️ Configuration & Environment Variables

The backend uses environment variables managed by `python-dotenv`. An `.env.example` file is included in `backend/`:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-ecommerce-secret-key-2026-internship
JWT_SECRET_KEY=dev-ecommerce-jwt-key-2026-internship
DATABASE_URL=sqlite:///ecommerce.db
PORT=5000
```

To configure custom ports or database paths, simply edit `backend/.env`.

---

## 🔮 Future Improvements
- [ ] Integration with Stripe / PayPal Sandbox for real payment gateway processing
- [ ] Automated email notifications via SendGrid/SMTP for order confirmations
- [ ] Product image upload directly to cloud storage (AWS S3 / Cloudinary)
- [ ] Customer product reviews and comments submission
- [ ] Wishlist & saved items functionality

---

## 📄 License & Academic Integrity
This project is developed as an **Internship / Capstone Project**. All source code is modular, fully commented, and structured for production-grade maintainability.
#   E - C o m m e r c e - W e b - A p p  
 