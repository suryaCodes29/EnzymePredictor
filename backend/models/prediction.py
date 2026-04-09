import json
from datetime import datetime

from extensions import db


class PredictionRecord(db.Model):
    """Stores enzyme and decomposition analyses for authenticated users."""

    __tablename__ = "prediction_records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    module_type = db.Column(db.String(40), nullable=False)
    waste_type = db.Column(db.String(120), nullable=False)
    quantity_kg = db.Column(db.Float, nullable=False)
    result_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def set_result(self, payload: dict) -> None:
        self.result_json = json.dumps(payload)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "module_type": self.module_type,
            "waste_type": self.waste_type,
            "quantity_kg": self.quantity_kg,
            "result": json.loads(self.result_json),
            "created_at": self.created_at.isoformat(),
        }
