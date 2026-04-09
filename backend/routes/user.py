from flask import Blueprint, jsonify, request

from extensions import db
from routes.helpers import login_required

user_bp = Blueprint("user", __name__)


@user_bp.get("/profile")
@login_required
def get_profile(current_user):
    return jsonify({"user": current_user.to_dict()})


@user_bp.put("/profile")
@login_required
def update_profile(current_user):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or current_user.name).strip()
    email = (data.get("email") or current_user.email).strip().lower()

    if not name or not email:
        return jsonify({"message": "Name and email are required."}), 400

    existing_user = current_user.__class__.query.filter_by(email=email).first()
    if existing_user and existing_user.id != current_user.id:
        return jsonify({"message": "Email is already in use."}), 409

    current_user.name = name
    current_user.email = email
    db.session.commit()
    return jsonify({"message": "Profile updated successfully.", "user": current_user.to_dict()})


@user_bp.post("/change-password")
@login_required
def change_password(current_user):
    data = request.get_json(silent=True) or {}
    current_password = (data.get("current_password") or "").strip()
    new_password = (data.get("new_password") or "").strip()

    if not current_password or not new_password:
        return jsonify({"message": "Current and new password are required."}), 400
    if len(new_password) < 6:
        return jsonify({"message": "New password must be at least 6 characters."}), 400
    if not current_user.check_password(current_password):
        return jsonify({"message": "Current password is incorrect."}), 401

    current_user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password changed successfully."})


@user_bp.get("/history")
@login_required
def get_history(current_user):
    records = [record.to_dict() for record in current_user.predictions[::-1]]
    return jsonify({"history": records})
