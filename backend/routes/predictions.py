from flask import Blueprint, jsonify, request

from extensions import db
from logic.enzyme_engine import list_supported_wastes, predict_decomposition, predict_enzyme
from models.prediction import PredictionRecord
from routes.helpers import optional_current_user

prediction_bp = Blueprint("predictions", __name__)


def _save_history(user, module_type: str, waste_type, quantity_kg: float, payload: dict) -> None:
    if not user:
        return

    waste_label = ", ".join(waste_type) if isinstance(waste_type, list) else str(waste_type)
    record = PredictionRecord(
        user_id=user.id,
        module_type=module_type,
        waste_type=waste_label,
        quantity_kg=quantity_kg,
    )
    record.set_result(payload)
    db.session.add(record)
    db.session.commit()


def _extract_waste_type(data):
    return data.get("waste_type") or data.get("waste_types") or []


def _extract_quantity(data):
    try:
        return float(data.get("quantity", 0))
    except (TypeError, ValueError):
        raise ValueError("Quantity must be a valid number.")


@prediction_bp.post("/predict-enzyme")
def predict_enzyme_route():
    data = request.get_json(silent=True) or {}
    waste_type = _extract_waste_type(data)

    try:
        quantity_kg = _extract_quantity(data)
        result = predict_enzyme(waste_type, quantity_kg)
        _save_history(optional_current_user(), "enzyme", result.get("input_waste_types", waste_type), quantity_kg, result)
        return jsonify(result)
    except ValueError as exc:
        return jsonify({"message": str(exc), "supported_wastes": list_supported_wastes()}), 400


@prediction_bp.post("/predict-decomposition")
def predict_decomposition_route():
    data = request.get_json(silent=True) or {}
    waste_type = _extract_waste_type(data)

    try:
        quantity_kg = _extract_quantity(data)
        result = predict_decomposition(waste_type, quantity_kg)
        _save_history(optional_current_user(), "decomposition", result.get("input_waste_types", waste_type), quantity_kg, result)
        return jsonify(result)
    except ValueError as exc:
        return jsonify({"message": str(exc), "supported_wastes": list_supported_wastes()}), 400


@prediction_bp.get("/supported-wastes")
def supported_wastes():
    return jsonify({"wastes": list_supported_wastes()})
