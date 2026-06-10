// ======================================
// SOCKET IO
// ======================================
const socket = io();

// ======================================
// ELEMENT SENSOR
// ======================================
const solarEl =
document.getElementById("solar");

const batteryEl =
document.getElementById("battery");

const currentEl =
document.getElementById("current");

const powerEl =
document.getElementById("power");

const statusEl =
document.getElementById("status");

const timeEl =
document.getElementById("time");

// ======================================
// RELAY ELEMENT
// ======================================
const relay1 =
document.getElementById("relay1");

const relay2 =
document.getElementById("relay2");

// ======================================
// RECEIVE SENSOR DATA
// ======================================
socket.on("sensorData", (data) => {

  console.log(data);

  // ====================================
  // SENSOR VALUE
  // ====================================
  if (solarEl) {

    solarEl.innerHTML =
      data.solar + " V";
  }

  if (batteryEl) {

    batteryEl.innerHTML =
      data.battery + " V";
  }

  if (currentEl) {

    currentEl.innerHTML =
      data.current + " A";
  }

  if (powerEl) {

    powerEl.innerHTML =
      data.power + " W";
  }

  // ====================================
  // STATUS
  // ====================================
  if (statusEl) {

    statusEl.innerHTML =
      data.status;

    if (data.status === "online") {

      statusEl.style.color =
        "#00ff88";

    } else {

      statusEl.style.color =
        "red";
    }
  }

  // ====================================
  // TIME
  // ====================================
  if (timeEl) {

    timeEl.innerHTML =
      data.time;
  }
});

// ======================================
// RELAY 1 CONTROL
// ======================================
if (relay1) {

  relay1.addEventListener(
    "change",
    () => {

      const state =
        relay1.checked
        ? "ON"
        : "OFF";

      console.log(
        "Relay 1:",
        state
      );

      fetch("/control", {

        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({

          relay: "relay1",
          state: state

        })

      })

      .then(res => res.json())

      .then(data => {

        console.log(
          "Relay1 Response:",
          data
        );

      })

      .catch(err => {

        console.log(
          "Relay1 Error:",
          err
        );

      });
    }
  );
}

// ======================================
// RELAY 2 CONTROL
// ======================================
if (relay2) {

  relay2.addEventListener(
    "change",
    () => {

      const state =
        relay2.checked
        ? "ON"
        : "OFF";

      console.log(
        "Relay 2:",
        state
      );

      fetch("/control", {

        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({

          relay: "relay2",
          state: state

        })

      })

      .then(res => res.json())

      .then(data => {

        console.log(
          "Relay2 Response:",
          data
        );

      })

      .catch(err => {

        console.log(
          "Relay2 Error:",
          err
        );

      });
    }
  );
}