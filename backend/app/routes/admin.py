from flask import Blueprint, request, jsonify
from sqlalchemy import func
from app.database import db
from app.models import User, Product, Order, OrderItem
from app.utils.auth_middleware import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats(current_user):
    try:
        total_products = Product.query.count()
        total_orders = Order.query.count()
        total_users = User.query.filter_by(role='user').count()
        
        # Calculate revenue from non-cancelled orders
        revenue_query = db.session.query(func.sum(Order.total_amount)).filter(Order.status != 'Cancelled').scalar()
        total_revenue = round(float(revenue_query or 0.0), 2)

        # Low stock products (less than or equal to 5 units)
        low_stock = Product.query.filter(Product.stock <= 5).order_by(Product.stock.asc()).limit(5).all()

        # Recent 5 orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()

        # Orders by status breakdown
        status_breakdown_query = db.session.query(
            Order.status,
            func.count(Order.id)
        ).group_by(Order.status).all()
        status_breakdown = {status: count for status, count in status_breakdown_query}

        return jsonify({
            'total_products': total_products,
            'total_orders': total_orders,
            'total_users': total_users,
            'total_revenue': total_revenue,
            'low_stock_count': Product.query.filter(Product.stock <= 5).count(),
            'low_stock_products': [p.to_dict() for p in low_stock],
            'recent_orders': [o.to_dict(include_items=False) for o in recent_orders],
            'status_breakdown': status_breakdown
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to fetch admin stats: {str(e)}'}), 500


@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders(current_user):
    status = request.args.get('status', '').strip()
    search = request.args.get('search', '').strip()

    query = Order.query

    if status and status.lower() != 'all':
        query = query.filter(Order.status.ilike(status))

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Order.shipping_name.ilike(search_term)) |
            (Order.shipping_email.ilike(search_term)) |
            (Order.id.ilike(search_term))
        )

    orders = query.order_by(Order.created_at.desc()).all()
    return jsonify({
        'count': len(orders),
        'orders': [o.to_dict(include_items=True) for o in orders]
    }), 200


@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json() or {}
    new_status = data.get('status', '').strip()

    if new_status not in VALID_STATUSES:
        return jsonify({
            'error': f'Invalid status. Allowed values: {", ".join(VALID_STATUSES)}'
        }), 400

    previous_status = order.status
    order.status = new_status

    # If cancelling an order, restore stock
    if new_status == 'Cancelled' and previous_status != 'Cancelled':
        for item in order.items:
            if item.product:
                item.product.stock += item.quantity
    # If un-cancelling, re-deduct if stock available
    elif previous_status == 'Cancelled' and new_status != 'Cancelled':
        for item in order.items:
            if item.product:
                item.product.stock = max(0, item.product.stock - item.quantity)

    try:
        db.session.commit()
        return jsonify({
            'message': f'Order #{order.id} status updated to {new_status}',
            'order': order.to_dict(include_items=True)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update order status: {str(e)}'}), 500
