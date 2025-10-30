import urllib.parse
from flask import Flask, g, current_app
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy # Import SQLAlchemy
import pymysql 
from flask_cors import CORS
bcrypt = Bcrypt()
db = SQLAlchemy() 

def create_app():
        """The application factory function."""
        
        app = Flask(__name__, instance_relative_config=True)
        CORS(app)
        # Load configuration from instance/config.py
        app.config.from_pyfile('config.py')

       # --- Configure SQLAlchemy ---
        db_config = app.config['DB_CONFIG']

        encoded_password = urllib.parse.quote_plus(db_config['password'])

        app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+pymysql://{db_config['user']}:{encoded_password}"
        f"@{db_config['host']}/{db_config['database']}"
    )
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        bcrypt.init_app(app)
        db.init_app(app) 
        with app.app_context(): 
            from . import models 
            from .auth.routes import auth_bp
            app.register_blueprint(auth_bp)
            
            from .stocks.routes import stocks_bp
            app.register_blueprint(stocks_bp)
        print("Flask App Created, Config Loaded, SQLAlchemy Initialized!")
        return app
