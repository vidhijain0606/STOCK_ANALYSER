from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError # Import specific SQLAlchemy error

    # Import db object, bcrypt, and the User model
from project import db, bcrypt
from project.models import User

    # Create the Blueprint
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        firstname = data.get('firstname')
        lastname = data.get('lastname') # Use lowercase to match model

        if not all([username, email, password]):
            return jsonify({"error": "Username, email, and password are required"}), 400

        # Hash the password
        pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a new User object using the model
        new_user = User(
            username=username,
            email=email,
            PasswordHash=pw_hash, # Match model attribute name
            firstname=firstname,
            lastname=lastname # Match model attribute name
        )

        try:
            # Use SQLAlchemy session to add and commit
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "User registered successfully"}), 201
        except IntegrityError:
            # SQLAlchemy raises IntegrityError for unique constraint violations
            db.session.rollback() # Rollback the session in case of error
            return jsonify({"error": "Username or email already exists"}), 409
        except Exception as e:
            db.session.rollback()
            print(f"ERROR during registration: {e}") # Log unexpected errors
            return jsonify({"error": f"An unexpected database error occurred"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        try:
            # Query the database using the User model
            user = User.query.filter_by(username=username).first()

            # Check if user exists and password is correct
            if user and bcrypt.check_password_hash(user.PasswordHash, password):
                 # Use user.PasswordHash (model attribute)
                return jsonify({
                    "message": "Login successful",
                    "user_id": user.user_id, # Use user.user_id (model attribute)
                    "username": user.username
                }), 200
            else:
                return jsonify({"error": "Invalid username or password"}), 401
        except Exception as e:
            print(f"ERROR during login: {e}") # Log unexpected errors
            return jsonify({"error": "An error occurred during login"}), 500
    

