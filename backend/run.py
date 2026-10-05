import os
from app import create_app
from app.database import db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Ensure tables are created
        db.create_all()
    
    port = int(os.getenv('PORT', 5000))
    print(f" * Backend server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
