from flask import Blueprint, request, jsonify
from sqlalchemy import func
from app.database import db
from app.models import Product
from app.utils.auth_middleware import admin_required

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
def get_products():
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    in_stock = request.args.get('in_stock', '').strip().lower()
    sort_by = request.args.get('sort_by', 'newest').strip()
    featured = request.args.get('featured', '').strip().lower()
    limit = request.args.get('limit', type=int)

    query = Product.query

    # Search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term)) |
            (Product.category.ilike(search_term))
        )

    # Category filter
    if category and category.lower() != 'all':
        query = query.filter(Product.category.ilike(category))

    # Price range filter
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Stock availability filter
    if in_stock == 'true':
        query = query.filter(Product.stock > 0)
    elif in_stock == 'false':
        query = query.filter(Product.stock == 0)

    # Featured filter (e.g. high rating)
    if featured == 'true':
        query = query.filter(Product.rating >= 4.5)

    # Sorting
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'rating_desc':
        query = query.order_by(Product.rating.desc(), Product.id.desc())
    elif sort_by == 'name_asc':
        query = query.order_by(Product.name.asc())
    else:  # newest by default
        query = query.order_by(Product.created_at.desc(), Product.id.desc())

    if limit:
        query = query.limit(limit)

    products = query.all()
    return jsonify({
        'count': len(products),
        'products': [p.to_dict() for p in products]
    }), 200


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories_query = db.session.query(
        Product.category,
        func.count(Product.id).label('count')
    ).group_by(Product.category).all()

    categories = [{'name': cat, 'count': count} for cat, count in categories_query]
    return jsonify({'categories': categories}), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Fetch 4 related products in same category
    related = Product.query.filter(
        Product.category == product.category,
        Product.id != product.id
    ).limit(4).all()

    return jsonify({
        'product': product.to_dict(),
        'related_products': [p.to_dict() for p in related]
    }), 200


@products_bp.route('', methods=['POST'])
@admin_required
def create_product(current_user):
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    category = data.get('category', '').strip()
    price = data.get('price')
    stock = data.get('stock', 0)
    description = data.get('description', '').strip()
    image_url = data.get('image_url', '').strip()
    rating = data.get('rating', 4.5)

    if not name:
        return jsonify({'error': 'Product name is required'}), 400
    if not category:
        return jsonify({'error': 'Category is required'}), 400
    if price is None:
        return jsonify({'error': 'Price is required'}), 400

    try:
        price = float(price)
        stock = int(stock)
        rating = float(rating)
        if price < 0 or stock < 0 or rating < 0 or rating > 5:
            return jsonify({'error': 'Invalid numerical values for price, stock, or rating'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Price, stock, and rating must be valid numbers'}), 400

    try:
        new_product = Product(
            name=name,
            description=description,
            category=category,
            price=price,
            image_url=image_url or 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            stock=stock,
            rating=rating
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'message': 'Product created successfully',
            'product': new_product.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create product: {str(e)}'}), 500


@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json() or {}

    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Product name cannot be empty'}), 400
        product.name = name

    if 'description' in data:
        product.description = data['description'].strip()

    if 'category' in data:
        cat = data['category'].strip()
        if not cat:
            return jsonify({'error': 'Category cannot be empty'}), 400
        product.category = cat

    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                return jsonify({'error': 'Price cannot be negative'}), 400
            product.price = price
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price value'}), 400

    if 'stock' in data:
        try:
            stock = int(data['stock'])
            if stock < 0:
                return jsonify({'error': 'Stock cannot be negative'}), 400
            product.stock = stock
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid stock value'}), 400

    if 'rating' in data:
        try:
            rating = float(data['rating'])
            if rating < 0 or rating > 5:
                return jsonify({'error': 'Rating must be between 0 and 5'}), 400
            product.rating = rating
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid rating value'}), 400

    if 'image_url' in data:
        product.image_url = data['image_url'].strip()

    try:
        db.session.commit()
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update product: {str(e)}'}), 500


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': f'Product "{product.name}" deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete product: {str(e)}'}), 500
