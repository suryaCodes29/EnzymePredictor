"""WebSocket routes for real-time prediction streaming."""
import json
import asyncio
from flask import Blueprint, request
from flask_socketio import emit, join_room, leave_room

ws_bp = Blueprint('websocket', __name__)


def register_websocket_handlers(socketio):
    """Register WebSocket event handlers."""

    @socketio.on('connect')
    def handle_connect():
        """Handle client connection."""
        print(f'Client connected: {request.sid}')
        emit('connection_response', {
            'status': 'connected',
            'message': 'Connected to prediction stream'
        })

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection."""
        print(f'Client disconnected: {request.sid}')

    @socketio.on('start_prediction')
    def handle_start_prediction(data):
        """Start a new prediction stream."""
        prediction_id = data.get('prediction_id', 'default')
        join_room(prediction_id)

        # Simulate streaming prediction data
        def stream_prediction():
            for progress in range(0, 101, 5):
                asyncio.sleep(0.5)
                emit('prediction_progress', {
                    'progress': progress,
                    'status': f'Analyzing... {progress}%',
                    'energy_level': 30 + (progress * 0.7),
                }, room=prediction_id)

                if progress >= 100:
                    emit('prediction_complete', {
                        'status': 'completed',
                        'result': {
                            'enzymeType': 'Hydrolase Complex',
                            'confidence': f'{85 + (progress / 100) * 10:.1f}%',
                            'summary': 'Real-time analysis completed successfully'
                        }
                    }, room=prediction_id)

        # Stream in background
        stream_prediction()

    @socketio.on('stop_prediction')
    def handle_stop_prediction(data):
        """Stop active prediction stream."""
        prediction_id = data.get('prediction_id', 'default')
        leave_room(prediction_id)
        emit('prediction_stopped', {'message': 'Prediction stream stopped'})

    @socketio.on('request_3d_update')
    def handle_3d_update(data):
        """Send 3D model update data."""
        emit('3d_update', {
            'atoms': 24,
            'bonds': 23,
            'energy_level': 95,
            'timestamp': data.get('timestamp', 0)
        })

    @socketio.on_error_default
    def default_error_handler(e):
        """Handle WebSocket errors."""
        print(f'WebSocket error: {e}')
        emit('error', {'message': 'An error occurred', 'error': str(e)})
