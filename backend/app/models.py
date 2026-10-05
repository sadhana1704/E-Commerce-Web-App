from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    stock = db.Column(db.Integer, nullable=False, default=0)
    rating = db.Column(db.Float, nullable=False, default=4.5)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': float(self.price),
            'image_url': self.image_url,
            'stock': int(self.stock),
            'rating': float(self.rating),
            'is_in_stock': int(self.stock) > 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')  # 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    
    # Shipping details
    shipping_name = db.Column(db.String(100), nullable=False)
    shipping_email = db.Column(db.String(120), nullable=False)
    shipping_phone = db.Column(db.String(20), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_city = db.Column(db.String(100), nullable=False)
    shipping_state = db.Column(db.String(100), nullable=False)
    shipping_pincode = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_items=True):
        order_dict = {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'total_amount': float(self.total_amount),
            'status': self.status,
            'shipping_name': self.shipping_name,
            'shipping_email': self.shipping_email,
            'shipping_phone': self.shipping_phone,
            'shipping_address': self.shipping_address,
            'shipping_city': self.shipping_city,
            'shipping_state': self.shipping_state,
            'shipping_pincode': self.shipping_pincode,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'item_count': len(self.items) if self.items else 0
        }
        if include_items:
            order_dict['items'] = [item.to_dict() for item in self.items]
        return order_dict


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='SET NULL'), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Product no longer available',
            'product_image': self.product.image_url if self.product else None,
            'product_category': self.product.category if self.product else None,
            'quantity': self.quantity,
            'price': float(self.price),
            'item_total': float(self.price * self.quantity)
        }
