import os
import sys
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

# Add current directory to path to ensure modules like 'routes' are found on Render
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from extensions import db
from routes.auth import auth_bp
from routes.guide import guide_bp
from routes.predictions import prediction_bp
from routes.user import user_bp
from routes.websocket import register_websocket_handlers

load_dotenv()


def create_app() -> Flask:
    """Application factory for local development and production deployment."""
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    # Initialize Socket.IO for WebSocket support
    socketio = SocketIO(
        app,
        cors_allowed_origins=app.config["CORS_ORIGINS"],
        async_mode='threading',
        ping_timeout=60,
        ping_interval=25
    )

    db.init_app(app)

    with app.app_context():
        from models.prediction import PredictionRecord  # noqa: F401
        from models.user import User  # noqa: F401

        db.create_all()

    app.register_blueprint(auth_bp, url_prefix="/user")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(prediction_bp)
    app.register_blueprint(guide_bp)

    # Register WebSocket handlers
    register_websocket_handlers(socketio)

    @app.get("/")
    def root():
        return jsonify(
            {
                "app": "EnzymePredict API",
                "status": "ready",
                "version": "1.0.0",
                "features": ["REST API", "WebSocket Streaming"],
                "docs": [
                    "/predict-enzyme",
                    "/predict-decomposition",
                    "/user/register",
                    "/user/login",
                    "/user/history",
                ],
            }
        )

    @app.get("/health")
    def health():
        return jsonify({"status": "healthy", "database": "connected", "websocket": "available"})

    return app, socketio


app, socketio = create_app()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=app.config["DEBUG"], allow_unsafe_werkzeug=True)
