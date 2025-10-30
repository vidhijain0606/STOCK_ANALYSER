from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from project import db
from project.models import User, UserStocklist
from . import api_service
import datetime

# Blueprint
stocks_bp = Blueprint('stocks', __name__)

#  ADD STOCK TO WATCHLIST 
@stocks_bp.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    user_id = data.get('user_id')
    stock_id = data.get('stock_id')

    if not user_id or not stock_id:
        return jsonify({"error": "user_id and stock_id are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    existing = UserStocklist.query.filter_by(user_id=user_id, stock_id=stock_id.upper()).first()
    if existing:
        return jsonify({"message": "Stock already in watchlist"}), 409

    new_item = UserStocklist(
        user_id=user_id,
        stock_id=stock_id.upper(),
        added_date=datetime.datetime.utcnow()
    )

    try:
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": f"{stock_id.upper()} added to watchlist"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Stock already in watchlist"}), 409
    except Exception as e:
        db.session.rollback()
        print(f"Error adding stock: {e}")
        return jsonify({"error": "Unexpected database error"}), 500


# REMOVE STOCK FROM WATCHLIST 
@stocks_bp.route('/watchlist/remove', methods=['DELETE'])
def remove_from_watchlist():
    data = request.get_json()
    user_id = data.get('user_id')
    stock_id = data.get('stock_id')

    if not user_id or not stock_id:
        return jsonify({"error": "user_id and stock_id are required"}), 400

    item = UserStocklist.query.filter_by(user_id=user_id, stock_id=stock_id.upper()).first()
    if not item:
        return jsonify({"error": "Item not found in watchlist"}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": f"{stock_id.upper()} removed from watchlist"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error removing stock: {e}")
        return jsonify({"error": "Unexpected database error"}), 500
# GET USER WATCHLIST 
@stocks_bp.route("/watchlist/<int:user_id>", methods=["GET"])
def get_watchlist(user_id):
    try:
        user_stocks = UserStocklist.query.filter_by(user_id=user_id).all()
        if not user_stocks:
            return jsonify({"watchlist": []}), 200

        stock_list = []
        for item in user_stocks:
            try:
                # Call Alpha Vantage for each stock
                stock_info = api_service.get_company_overview(item.stock_id)

                # Even if the API fails, include a minimal fallback
                if not stock_info:
                    stock_list.append({
                        "stock_id": item.stock_id,
                        "company_name": "Unavailable (API limit)",
                        "exchange": "N/A",
                        "added_date": item.added_date
                    })
                    continue

                stock_list.append({
                    "stock_id": stock_info.get("stock_id", item.stock_id),
                    "company_name": stock_info.get("company_name", "Unknown"),
                    "exchange": stock_info.get("exchange", "Unknown"),
                    "added_date": item.added_date
                })
            except Exception as api_err:
                print(f"⚠️ API error for {item.stock_id}: {api_err}")
                stock_list.append({
                    "stock_id": item.stock_id,
                    "company_name": "API Error",
                    "exchange": "N/A",
                    "added_date": item.added_date
                })

        return jsonify({"watchlist": stock_list}), 200

    except Exception as e:
        print("Error loading watchlist:", str(e))
        return jsonify({"error": str(e)}), 500
