from flask import Flask, send_from_directory
from flask_socketio import SocketIO
import os
import mqtt_client

# =========================================
# PATH
# =========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

# =========================================
# FLASK
# =========================================
app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=''
)

app.config['SECRET_KEY'] = 'secret'

socketio = SocketIO(
    app,
    cors_allowed_origins='*',
    async_mode='threading'
)

mqtt_client.init_socketio(socketio)

# =========================================
# ROUTES
# =========================================
@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def static_file(path):
    return send_from_directory(FRONTEND_DIR, path)

# =========================================
# SOCKET
# =========================================
@socketio.on('connect')
def connect():
    print('[SOCKET] Browser Connected')
    socketio.emit('sensorData', mqtt_client.sensor_data)

# =========================================
# MAIN
# =========================================
if __name__ == '__main__':

    mqtt_client.start()

    print('=' * 40)
    print('SERVER RUNNING')
    print('http://localhost:5500')
    print('=' * 40)

    socketio.run(
        app,
        host='0.0.0.0',
        port=5500,
        debug=False,
        allow_unsafe_werkzeug=True
    )