import json
import time
from datetime import datetime
import threading
import paho.mqtt.client as mqtt

# =========================================
# MQTT
# =========================================
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "monitoring/listrik/data"

# =========================================
# GLOBAL
# =========================================
socketio = None

sensor_data = {
    "solar": 0,
    "battery": 0,
    "current": 0,
    "power": 0,
    "status": "offline",
    "time": "--:--:--"
}

last_message_time = time.time()

# =========================================
# INIT SOCKETIO
# =========================================
def init_socketio(sio):
    global socketio
    socketio = sio

# =========================================
# MQTT CONNECT
# =========================================
def on_connect(client, userdata, flags, rc):

    if rc == 0:
        print("[MQTT] Connected")
        client.subscribe(MQTT_TOPIC)
    else:
        print("[MQTT] Failed:", rc)

# =========================================
# MQTT MESSAGE
# =========================================
def on_message(client, userdata, msg):

    global last_message_time

    try:

        payload = msg.payload.decode()
        data = json.loads(payload)

        sensor_data["solar"] = round(data.get("solar", 0), 2)
        sensor_data["battery"] = round(data.get("battery", 0), 2)
        sensor_data["current"] = round(data.get("current", 0), 2)
        sensor_data["power"] = round(data.get("power", 0), 2)

        sensor_data["status"] = "online"

        sensor_data["time"] = datetime.now().strftime("%H:%M:%S")

        last_message_time = time.time()

        if socketio:
            socketio.emit('sensorData', sensor_data)

        print(sensor_data)

    except Exception as e:
        print("[ERROR]", e)

# =========================================
# OFFLINE MONITOR
# =========================================
def monitor_esp_status():

    global last_message_time

    while True:

        elapsed = time.time() - last_message_time

        if elapsed > 10:
            sensor_data["status"] = "offline"

            if socketio:
                socketio.emit('sensorData', sensor_data)

        time.sleep(2)

# =========================================
# START MQTT
# =========================================
def start():

    client = mqtt.Client()

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)

    thread = threading.Thread(target=monitor_esp_status)
    thread.daemon = True
    thread.start()

    client.loop_start()