from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Order, OrderItem, Product
from app.utils.auth_middleware import token_required

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

TAX_RATE = 0.08  # 8% standard tax

@orders_bp.route('', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json() or {}

    shipping_name = data.get('shipping_name', '').strip()
    shipping_email = data.get('shipping_email', '').strip()
    shipping_phone = data.get('shipping_phone', '').strip()
    shipping_address = data.get('shipping_address', '').strip()
    shipping_city = data.get('shipping_city', '').strip()
    shipping_state = data.get('shipping_state', '').strip()
    shipping_pincode = data.get('shipping_pincode', '').strip()
    items_data = data.get('items', [])

    # Validation
    if not shipping_name or not shipping_email or not shipping_phone:
        return jsonify({'error': 'Name, email, and phone number are required for shipping'}), 400
    if not shipping_address or not shipping_city or not shipping_state or not shipping_pincode:
        return jsonify({'error': 'Complete shipping address (address, city, state, pincode) is required'}), 400
    if not items_data or not isinstance(items_data, list) or len(items_data) == 0:
        return jsonify({'error': 'Order must contain at least one item'}), 400

    subtotal = 0.0
    order_items_to_create = []

    try:
        # Validate stock and prices
        for item in items_data:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            if not product_id or quantity <= 0:
                return jsonify({'error': 'Invalid item in cart'}), 400

            product = Product.query.get(product_id)
            if not product:
                return jsonify({'error': f'Product with ID {product_id} was not found'}), 404

            if product.stock < quantity:
                return jsonify({
                    'error': f'Insufficient stock for "{product.name}". Available: {product.stock}, requested: {quantity}'
                }), 400

            # Deduct stock
            product.stock -= quantity
            item_total = float(product.price) * quantity
            subtotal += item_total

            order_items_to_create.append({
                'product': product,
                'quantity': quantity,
                'price': float(product.price)
            })

        # Calculate totals
        tax = round(subtotal * TAX_RATE, 2)
        total_amount = round(subtotal + tax, 2)

        # Create Order
        new_order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            status='Pending',
            shipping_name=shipping_name,
            shipping_email=shipping_email,
            shipping_phone=shipping_phone,
            shipping_address=shipping_address,
            shipping_city=shipping_city,
            shipping_state=shipping_state,
            shipping_pincode=shipping_pincode
        )
        db.session.add(new_order)
        db.session.flush()  # To populate new_order.id

        for item_info in order_items_to_create:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_info['product'].id,
                quantity=item_info['quantity'],
                price=item_info['price']
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            'message': 'Order placed successfully!',
            'order': new_order.to_dict(include_items=True)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to process order: {str(e)}'}), 500


@orders_bp.route('', methods=['GET'])
@token_required
def get_user_orders(current_user):
    """Retrieve orders for the currently logged in user."""
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return jsonify({
        'count': len(orders),
        'orders': [o.to_dict(include_items=True) for o in orders]
    }), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order_detail(current_user, order_id):
    """Retrieve specific order details. Only accessible by order owner or admin."""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Authorization check
    if order.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Access denied: You are not authorized to view this order'}), 403

    return jsonify({'order': order.to_dict(include_items=True)}), 200
