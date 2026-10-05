from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.database import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS for all origins in development
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)

    # Root and health check routes
    @app.route('/')
    def root():
        return jsonify({
            'name': 'E-Commerce REST API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'auth': '/api/auth',
                'products': '/api/products',
                'orders': '/api/orders',
                'admin': '/api/admin'
            }
        })

    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app
