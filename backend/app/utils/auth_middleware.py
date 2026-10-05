import jwt
from functools import wraps
from datetime import datetime, timezone, timedelta
from flask import request, jsonify, current_app
from app.models import User

def generate_token(user):
    """Generate JWT auth token for user."""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'name': user.name,
        'exp': datetime.now(timezone.utc) + current_app.config['JWT_EXPIRATION_DELTA'],
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')


def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authentication token is missing'}), 401
            
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization header format. Use: Bearer <token>'}), 401
            
        token = parts[1]
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found or account deactivated'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Authentication token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid authentication token'}), 401
        except Exception as e:
            return jsonify({'error': f'Authentication error: {str(e)}'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


def admin_required(f):
    """Decorator to require admin role."""
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'error': 'Access forbidden: Admin privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated
