import traceback

from flask import Blueprint, jsonify, request, current_app
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from extensions import db
from models.user import User
from routes.helpers import generate_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register_user():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not all([name, email, password]):
        return jsonify({"message": "Name, email, and password are required."}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "An account with this email already exists."}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user)
    return jsonify({"message": "Registration successful.", "token": token, "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login_user():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password."}), 401

    token = generate_token(user)
    return jsonify({"message": "Login successful.", "token": token, "user": user.to_dict()})


@auth_bp.post("/google-login")
def google_login():
    data = request.get_json(silent=True) or {}
    token = data.get("token")
    if not token:
        return jsonify({"message": "Token is required."}), 400

    try:
        client_id = current_app.config.get("GOOGLE_CLIENT_ID")
        if not client_id:
            return jsonify({"message": "Google Client ID not configured on server."}), 500
            
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
        email = id_info.get("email")
        name = id_info.get("name")
        
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(name=name, email=email)
            user.set_password("GOOGLE_SSO")
            db.session.add(user)
            db.session.commit()
            
        auth_token = generate_token(user)
        return jsonify({"message": "Login successful.", "token": auth_token, "user": user.to_dict()})
    except ValueError:
        return jsonify({"message": "Invalid Google token."}), 401
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Authentication failed: {str(e)}"}), 500
