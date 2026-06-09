const socket = io();

// DATE TIME
function updateDateTime(){

  const now = new Date();

  document.getElementById('datetime').innerHTML =
    now.toLocaleDateString() + ' • ' +
    now.toLocaleTimeString();
}

setInterval(updateDateTime,1000);

updateDateTime();

// ======================================
// CHART
// ======================================
const ctx = document.getElementById('trendChart');

const labels = [];
const solarData = [];
const batteryData = [];

const trendChart = new Chart(ctx, {

  type:'line',

  data:{
    labels,

    datasets:[

      {
        label:'Solar',
        data:solarData,
        borderColor:'#2563eb',
        backgroundColor:'rgba(37,99,235,0.15)',
        fill:true,
        tension:0.4
      },

      {
        label:'Battery',
        data:batteryData,
        borderColor:'#22c55e',
        backgroundColor:'rgba(34,197,94,0.15)',
        fill:true,
        tension:0.4
      }

    ]
  },

  options:{

    responsive:true,

    plugins:{
      legend:{
        display:false
      }
    },

    scales:{

      x:{
        ticks:{
          color:'#94a3b8'
        },

        grid:{
          color:'rgba(255,255,255,0.05)'
        }
      },

      y:{
        ticks:{
          color:'#94a3b8'
        },

        grid:{
          color:'rgba(255,255,255,0.05)'
        }
      }
    }
  }
});

// ======================================
// STATUS
// ======================================
function setEspStatus(status){

  const dot = document.getElementById('espDot');
  const label = document.getElementById('espLabel');

  dot.className = `esp-dot ${status}`;

  if(status === 'online'){
    label.textContent = 'ESP32 Online';
  }
  else if(status === 'offline'){
    label.textContent = 'ESP32 Offline';
  }
  else{
    label.textContent = 'Waiting ESP32';
  }
}

// ======================================
// REALTIME DATA
// ======================================
socket.on('sensorData',(data)=>{

  setEspStatus(data.status);

  document.getElementById('solar').innerHTML =
    `${data.solar} V`;

  document.getElementById('battery').innerHTML =
    `${data.battery} V`;

  document.getElementById('current').innerHTML =
    `${data.current} A`;

  document.getElementById('power').innerHTML =
    `${data.power} W`;

  document.getElementById('solarCircle').textContent =
    data.solar;

  document.getElementById('batteryCircle').textContent =
    data.battery;

  document.getElementById('currentCircle').textContent =
    data.current;

  document.getElementById('powerCircle').textContent =
    data.power;

  labels.push(data.time);

  solarData.push(data.solar);
  batteryData.push(data.battery);

  if(labels.length > 15){

    labels.shift();
    solarData.shift();
    batteryData.shift();
  }

  trendChart.update();
});