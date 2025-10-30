from . import db 
from datetime import datetime

    # Define the User model, mapping to the 'users' table
class User(db.Model):
        __tablename__ = 'users' 

        user_id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(100), unique=True, nullable=False)
        email = db.Column(db.String(100), unique=True, nullable=False)
        PasswordHash = db.Column(db.String(255), nullable=False) 
        firstname = db.Column(db.String(100), nullable=True)
        lastname = db.Column(db.String(100), nullable=True) 
        registration_date = db.Column(db.TIMESTAMP, nullable=False, default=datetime.utcnow)

        
        watchlist = db.relationship('UserStocklist', backref='user', lazy=True, cascade="all, delete-orphan")

        def __repr__(self):
            return f'<User {self.username}>'
class UserStocklist(db.Model):
        __tablename__ = 'user_stocklist' 

        userstocklistid = db.Column(db.Integer, primary_key=True) 
        user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False) 
        stock_id = db.Column(db.String(100), nullable=False) 
        added_date = db.Column(db.TIMESTAMP, nullable=False, default=datetime.utcnow)
        __table_args__ = (db.UniqueConstraint('user_id', 'stock_id', name='unique_user_stock'),)

        def __repr__(self):
            return f'<UserStocklist UserID:{self.user_id} Stock:{self.stock_id}>'
    
