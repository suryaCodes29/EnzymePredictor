from flask import Blueprint, jsonify

from logic.enzyme_engine import get_enzyme_guide

guide_bp = Blueprint("guide", __name__)


@guide_bp.get("/guide")
def guide():
    return jsonify({"guide": get_enzyme_guide()})
