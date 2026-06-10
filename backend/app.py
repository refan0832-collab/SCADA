from flask import Flask
from flask import send_from_directory
from flask import request

from flask_socketio import SocketIO

import os
import mqtt_client

# =========================================
# PATH
# =========================================
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "..",
    "frontend"
)

# =========================================
# FLASK
# =========================================
app = Flask(__name__)

# =========================================
# SOCKET IO
# =========================================
socketio = SocketIO(

    app,

    cors_allowed_origins="*",

    async_mode="threading"
)

# =========================================
# INIT SOCKETIO MQTT
# =========================================
mqtt_client.init_socketio(socketio)

# =========================================
# ROUTE INDEX
# =========================================
@app.route("/")
def index():

    return send_from_directory(

        FRONTEND_DIR,

        "index.html"
    )

# =========================================
# ROUTE CONTROLLER
# =========================================
@app.route("/controller.html")
def controller():

    return send_from_directory(

        FRONTEND_DIR,

        "controller.html"
    )

# =========================================
# STATIC FILES
# =========================================
@app.route("/<path:path>")
def static_files(path):

    return send_from_directory(

        FRONTEND_DIR,

        path
    )

# =========================================
# RELAY CONTROL
# =========================================
@app.route("/control", methods=["POST"])
def control():

    try:

        data = request.json

        relay = data.get("relay")
        state = data.get("state")

        print()
        print("========== CONTROL ==========")
        print("Relay :", relay)
        print("State :", state)

        mqtt_client.publish_control(

            relay,
            state
        )

        return {

            "success": True
        }

    except Exception as e:

        print("[CONTROL ERROR]", e)

        return {

            "success": False,
            "error": str(e)
        }

# =========================================
# MAIN
# =========================================
if __name__ == "__main__":

    print("========================================")
    print("SERVER RUNNING")
    print("http://localhost:5500")
    print("========================================")

    # =====================================
    # START MQTT
    # =====================================
    mqtt_client.start()

    # =====================================
    # RUN SERVER
    # =====================================
    socketio.run(

        app,

        host="0.0.0.0",

        port=5500,

        debug=False
    )