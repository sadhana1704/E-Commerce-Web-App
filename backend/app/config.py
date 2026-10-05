import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key-change-me')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-dev-jwt-secret-key')
    JWT_EXPIRATION_DELTA = timedelta(days=7)
    
    # SQLite Database URI
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(BASE_DIR, "ecommerce.db")}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS config
    CORS_HEADERS = 'Content-Type'
