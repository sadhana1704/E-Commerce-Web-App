import re
from flask import Blueprint, request, jsonify
from app.database import db
from app.models import User
from app.utils.auth_middleware import generate_token, token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'user').strip().lower()
    
    # Validation
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'A valid email address is required'}), 400
    if not password or len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    if role not in ['user', 'admin']:
        role = 'user'
        
    # Prevent normal register from silently creating unauthorized admins unless specified
    if role == 'admin' and data.get('admin_secret') != 'ADMIN_SECURE_KEY_2026':
        # Default to user if admin secret not provided
        role = 'user'

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists'}), 409

    try:
        user = User(name=name, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user)
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = generate_token(user)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Client will remove stored token from localStorage / state
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if name:
        current_user.name = name

    if new_password:
        if not current_password:
            return jsonify({'error': 'Current password is required to set a new password'}), 400
        if not current_user.check_password(current_password):
            return jsonify({'error': 'Current password is incorrect'}), 400
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        current_user.set_password(new_password)

    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500
