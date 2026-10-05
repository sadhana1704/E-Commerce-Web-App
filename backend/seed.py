from datetime import datetime, timezone, timedelta
from app import create_app
from app.database import db
from app.models import User, Product, Order, OrderItem

app = create_app()

def seed_database():
    with app.app_context():
        print("Dropping existing tables and creating fresh schema...")
        db.drop_all()
        db.create_all()

        print("Seeding demo users...")
        # 1. Admin User
        admin_user = User(
            name="Admin User",
            email="admin@ecommerce.com",
            role="admin"
        )
        admin_user.set_password("admin123")
        db.session.add(admin_user)

        # 2. Regular Demo User
        demo_user = User(
            name="Alex Morgan",
            email="user@ecommerce.com",
            role="user"
        )
        demo_user.set_password("user123")
        db.session.add(demo_user)

        db.session.commit()
        print(f"Created Admin ({admin_user.email}) and Demo User ({demo_user.email})")

        print("Seeding sample products...")
        sample_products = [
            # Electronics
            {
                "name": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
                "description": "Industry-leading noise cancellation with two processors and 8 microphones. Ultra-comfortable lightweight design, crystal clear hands-free calling, and up to 30-hour battery life.",
                "category": "Electronics",
                "price": 348.00,
                "stock": 24,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Apple Watch Ultra 2 Smartwatch",
                "description": "The most rugged and capable Apple Watch. Designed for outdoor adventure, endurance training, with a precision dual-frequency GPS and up to 72 hours of battery life.",
                "category": "Electronics",
                "price": 799.00,
                "stock": 15,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Keychron Q1 Pro Wireless Mechanical Keyboard",
                "description": "Full aluminum custom mechanical keyboard with hot-swappable switches, double-gasket design, RGB backlighting, and Bluetooth 5.1 multi-device connectivity.",
                "category": "Electronics",
                "price": 199.50,
                "stock": 18,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "GoPro HERO12 Black Action Camera",
                "description": "Incredible 5.3K video quality, HDR photos, HyperSmooth 6.0 video stabilization, rugged waterproof build up to 33ft, and Bluetooth audio support.",
                "category": "Electronics",
                "price": 399.99,
                "stock": 12,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Ergonomic Aluminum Laptop Riser Stand",
                "description": "Premium anodized aluminum stand with 360-degree rotation, heat dissipation vents, and adjustable height angles to improve posture and workspace aesthetics.",
                "category": "Electronics",
                "price": 45.00,
                "stock": 42,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
            },

            # Accessories
            {
                "name": "Bellroy Slim Leather Minimalist Sleeve Wallet",
                "description": "Crafted from environmentally certified top-grain leather. Holds 4-11 cards, folded banknotes, with RFID protection and a discreet pull-tab mechanism.",
                "category": "Accessories",
                "price": 79.00,
                "stock": 35,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Classic Wayfarer Polarized Sunglasses",
                "description": "Timeless unisex silhouette with UV400 polarized scratch-resistant lenses and durable acetate frame. Complete with protective microfiber case.",
                "category": "Accessories",
                "price": 129.00,
                "stock": 20,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Nordic Weatherproof Commuter Backpack",
                "description": "Minimalist Scandinavian design with 22L capacity, padded 16-inch laptop compartment, hidden security pockets, and waterproof matte polyurethane fabric.",
                "category": "Accessories",
                "price": 115.00,
                "stock": 16,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Hydro Flask Insulated Stainless Steel Bottle (32 oz)",
                "description": "TempShield double-wall vacuum insulation keeps beverages ice-cold for 24 hours or piping hot for 12 hours. Pure taste 18/8 pro-grade stainless steel.",
                "category": "Accessories",
                "price": 44.95,
                "stock": 50,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
            },

            # Clothing
            {
                "name": "Heavyweight French Terry Organic Cotton Hoodie",
                "description": "500 GSM luxury French Terry cotton with double-lined hood, ribbed side gussets, and pre-shrunk relaxed fit for exceptional everyday warmth and style.",
                "category": "Clothing",
                "price": 89.00,
                "stock": 30,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Vintage Wash Japanese Selvedge Denim Jacket",
                "description": "Authentic 13.5 oz Japanese denim woven on vintage shuttle looms. Classic type III cut with dual chest pockets and branded antique copper buttons.",
                "category": "Clothing",
                "price": 165.00,
                "stock": 14,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Ultra-Breathable Moisture-Wicking Performance Tee",
                "description": "Engineered lightweight microfiber blend with 4-way stretch, anti-odor silver ion treatment, and laser-perforated back ventilation zones.",
                "category": "Clothing",
                "price": 38.00,
                "stock": 60,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "100% Pure Merino Wool Crewneck Sweater",
                "description": "Extra-fine Australian merino wool with natural temperature regulation, luxuriously soft hand-feel, and timeless rib-knit collar and cuffs.",
                "category": "Clothing",
                "price": 120.00,
                "stock": 22,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"
            },

            # Home
            {
                "name": "Ultrasonic Ceramic Aroma & Essential Oil Diffuser",
                "description": "Hand-crafted matte ceramic stone cover with warm ambient LED glow, whisper-quiet ultrasonic atomization, and multiple automatic timer presets.",
                "category": "Home",
                "price": 58.00,
                "stock": 25,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Fellow Ode Gen 2 Conical Burr Coffee Grinder",
                "description": "Precision home brew grinder with 64mm professional-grade flat burrs, 31 grind settings, anti-static technology, and automatic shutoff.",
                "category": "Home",
                "price": 345.00,
                "stock": 8,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Minimalist Dimmable LED Reading Desk Lamp",
                "description": "Sleek magnetic levitation-inspired design with touch controls, 5 color temperature modes, built-in 10W wireless smartphone charger, and USB-C port.",
                "category": "Home",
                "price": 64.99,
                "stock": 3,  # Low stock test case
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
            },
            {
                "name": "Handcrafted Organic Stoneware Dining Set (12-Piece)",
                "description": "Artisan reactive glaze dinnerware set made from non-toxic durable clay. Microwave, dishwasher, and oven safe up to 450°F.",
                "category": "Home",
                "price": 149.00,
                "stock": 0,  # Out of stock test case
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80"
            }
        ]

        created_products = []
        for p_data in sample_products:
            prod = Product(**p_data)
            db.session.add(prod)
            created_products.append(prod)

        db.session.commit()
        print(f"Successfully seeded {len(created_products)} products.")

        # Seed sample order for demo user
        print("Seeding sample orders for demo user...")
        sample_order = Order(
            user_id=demo_user.id,
            total_amount=426.84,  # $395.22 + 8% tax
            status="Delivered",
            shipping_name="Alex Morgan",
            shipping_email="user@ecommerce.com",
            shipping_phone="+1 (555) 234-5678",
            shipping_address="742 Evergreen Terrace",
            shipping_city="Springfield",
            shipping_state="Oregon",
            shipping_pincode="97477",
            created_at=datetime.now(timezone.utc) - timedelta(days=5)
        )
        db.session.add(sample_order)
        db.session.flush()

        item1 = OrderItem(
            order_id=sample_order.id,
            product_id=created_products[0].id,  # Sony headphones
            quantity=1,
            price=created_products[0].price
        )
        item2 = OrderItem(
            order_id=sample_order.id,
            product_id=created_products[8].id,  # Hydro flask
            quantity=1,
            price=created_products[8].price
        )
        db.session.add_all([item1, item2])

        # Second sample order: In Transit
        sample_order_2 = Order(
            user_id=demo_user.id,
            total_amount=124.20,
            status="Shipped",
            shipping_name="Alex Morgan",
            shipping_email="user@ecommerce.com",
            shipping_phone="+1 (555) 234-5678",
            shipping_address="742 Evergreen Terrace",
            shipping_city="Springfield",
            shipping_state="Oregon",
            shipping_pincode="97477",
            created_at=datetime.now(timezone.utc) - timedelta(days=1)
        )
        db.session.add(sample_order_2)
        db.session.flush()

        item3 = OrderItem(
            order_id=sample_order_2.id,
            product_id=created_products[7].id,  # Nordic backpack
            quantity=1,
            price=created_products[7].price
        )
        db.session.add(item3)

        db.session.commit()
        print("Database seeded successfully with users, products, and sample orders!")

if __name__ == '__main__':
    seed_database()
