from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, jsonify, request

from models.user import User


def generate_token(user: User) -> str:
    """Create a signed JWT token for the supplied user."""
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def optional_current_user():
    """Return the user linked to a valid bearer token, if present."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
        )
        return User.query.get(int(payload["sub"]))
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError, KeyError):
        return None


def login_required(view_func):
    """Decorator used on endpoints that require authentication."""

    @wraps(view_func)
    def wrapper(*args, **kwargs):
        user = optional_current_user()
        if not user:
            return jsonify({"message": "Authentication required."}), 401
        return view_func(user, *args, **kwargs)

    return wrapper
