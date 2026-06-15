// ======================================
// SOCKET IO
// ======================================
const socket = io();

// ======================================
// ELEMENT SENSOR
// ======================================
const solarEl         = document.getElementById("solar");
const batteryEl       = document.getElementById("battery");
const currentEl       = document.getElementById("current");
const powerEl         = document.getElementById("power");

const solarCircleEl   = document.getElementById("solarCircle");
const batteryCircleEl = document.getElementById("batteryCircle");
const currentCircleEl = document.getElementById("currentCircle");
const powerCircleEl   = document.getElementById("powerCircle");

// ======================================
// ELEMENT STATUS ESP
// ======================================
const espDot   = document.getElementById("espDot");
const espLabel = document.getElementById("espLabel");

// ======================================
// ELEMENT DATETIME
// ======================================
const datetimeEl = document.getElementById("datetime");

// ======================================
// RELAY ELEMENT
// ======================================
const relay1 = document.getElementById("relay1");
const relay2 = document.getElementById("relay2");

// ======================================
// LIVE CLOCK
// ======================================
function updateClock() {
  if (!datetimeEl) return;

  const now  = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday : "long",
    year    : "numeric",
    month   : "long",
    day     : "numeric"
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour   : "2-digit",
    minute : "2-digit",
    second : "2-digit"
  });

  datetimeEl.innerHTML =
    `<span class="clock-date">${date}</span>` +
    `<span class="clock-time">${time}</span>`;
}

updateClock();
setInterval(updateClock, 1000);

// ======================================
// SET ESP STATUS
// ======================================
function setEspStatus(status) {
  if (!espDot || !espLabel) return;

  espDot.className = "esp-dot";

  if (status === "online") {
    espDot.classList.add("online");
    espLabel.textContent = "ESP32 Online";

  } else if (status === "offline") {
    espDot.classList.add("offline");
    espLabel.textContent = "ESP32 Offline";

  } else {
    espDot.classList.add("waiting");
    espLabel.textContent = "Menunggu ESP32...";
  }
}

// ======================================
// RECEIVE SENSOR DATA
// ======================================
socket.on("sensorData", (data) => {

  console.log("[sensorData]", data);

  // STATUS ESP
  setEspStatus(data.status);

  // SENSOR VALUE — card h2
  if (solarEl)   solarEl.textContent   = data.solar   + " V";
  if (batteryEl) batteryEl.textContent = data.battery + " V";
  if (currentEl) currentEl.textContent = data.current + " A";
  if (powerEl)   powerEl.textContent   = data.power   + " W";

  // SENSOR VALUE — circle inner
  if (solarCircleEl)   solarCircleEl.textContent   = data.solar;
  if (batteryCircleEl) batteryCircleEl.textContent = data.battery;
  if (currentCircleEl) currentCircleEl.textContent = data.current;
  if (powerCircleEl)   powerCircleEl.textContent   = data.power;

  // UPDATE CHART
  if (typeof addChartData === "function") {
    addChartData(data.time, data.solar, data.battery);
  }
});

// ======================================
// SOCKET CONNECT / DISCONNECT
// ======================================
socket.on("connect", () => {
  console.log("[Socket] Connected");
});

socket.on("disconnect", () => {
  console.log("[Socket] Disconnected");
  setEspStatus("offline");
});

// ======================================
// RELAY 1 CONTROL
// ======================================
if (relay1) {

  // Restore state saat halaman dibuka
  if (localStorage.getItem("relay1") === "ON") {
    relay1.checked = true;
  }

  relay1.addEventListener("change", () => {
    const state = relay1.checked ? "ON" : "OFF";

    // Simpan state ke localStorage
    localStorage.setItem("relay1", state);

    fetch("/control", {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ relay: "relay1", state })
    })
    .then(res  => res.json())
    .then(data => console.log("Relay1 Response:", data))
    .catch(err => console.log("Relay1 Error:", err));
  });
}

// ======================================
// RELAY 2 CONTROL
// ======================================
if (relay2) {

  // Restore state saat halaman dibuka
  if (localStorage.getItem("relay2") === "ON") {
    relay2.checked = true;
  }

  relay2.addEventListener("change", () => {
    const state = relay2.checked ? "ON" : "OFF";

    // Simpan state ke localStorage
    localStorage.setItem("relay2", state);

    fetch("/control", {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ relay: "relay2", state })
    })
    .then(res  => res.json())
    .then(data => console.log("Relay2 Response:", data))
    .catch(err => console.log("Relay2 Error:", err));
  });
}