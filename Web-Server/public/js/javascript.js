//Time
const dateTimeSpan = document.getElementById("date-time");

function updateDateTime() {
  const now = moment();
  const formattedDateTime = now.format("HH:mm:ss DD/MM/YYYY");
  dateTimeSpan.textContent = formattedDateTime;
}
setInterval(updateDateTime, 1000);

//Socket.io
const socket = io();
socket.on("temperature_io", function (data_received) {
  let giatri_temperature = data_received;
  document.getElementById("temperature_input").innerHTML =
    giatri_temperature + "°C";

  update_chart_temperature.data.datasets[0].data.push(giatri_temperature);
  const maxDataPoints = 20;
  if (update_chart_temperature.data.datasets[0].data.length > maxDataPoints) {
    update_chart_temperature.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format("HH:mm:ss, DD/MM/YYYY");
  update_chart_temperature.data.labels.push(formattedTime);
  if (update_chart_temperature.data.labels.length > maxDataPoints) {
    update_chart_temperature.data.labels.shift();
  }
  update_chart_temperature.update();
});

socket.on("humidity_io", function (data_received) {
  let giatri_humidity = data_received;
  document.getElementById("humidity_input").innerHTML = giatri_humidity + "%";

  update_chart_humidity.data.datasets[0].data.push(giatri_humidity);
  const maxDataPoints = 20;
  if (update_chart_humidity.data.datasets[0].data.length > maxDataPoints) {
    update_chart_humidity.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format("HH:mm:ss, DD/MM/YYYY");
  update_chart_humidity.data.labels.push(formattedTime);
  if (update_chart_humidity.data.labels.length > maxDataPoints) {
    update_chart_humidity.data.labels.shift();
  }
  update_chart_humidity.update();
});

socket.on("lux_io", function (data_received) {
  let giatri_lux = data_received;
  document.getElementById("lux_input").innerHTML = giatri_lux + " lx";

  update_chart_lux.data.datasets[0].data.push(giatri_lux);
  const maxDataPoints = 20;
  if (update_chart_lux.data.datasets[0].data.length > maxDataPoints) {
    update_chart_lux.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format("HH:mm:ss, DD/MM/YYYY");
  update_chart_lux.data.labels.push(formattedTime);
  if (update_chart_lux.data.labels.length > maxDataPoints) {
    update_chart_lux.data.labels.shift();
  }
  update_chart_lux.update();
});

socket.on("pressure_io", function (data_received) {
  let giatri_pressure = data_received;
  document.getElementById("pressure_input").innerHTML =
    giatri_pressure + " mmHg";

  update_chart_pressure.data.datasets[0].data.push(giatri_pressure);
  const maxDataPoints = 20;
  if (update_chart_pressure.data.datasets[0].data.length > maxDataPoints) {
    update_chart_pressure.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format("HH:mm:ss, DD/MM/YYYY");
  update_chart_pressure.data.labels.push(formattedTime);
  if (update_chart_pressure.data.labels.length > maxDataPoints) {
    update_chart_pressure.data.labels.shift();
  }
  update_chart_pressure.update();
});

//Chart
const update_chart_temperature = new Chart("temperature-chart", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Nhiệt độ",
        lineTension: 0,
        backgroundColor: "red",
        borderColor: "red",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: "Giá trị",
        },
      },
    },
  },
});

const update_chart_humidity = new Chart("humidity-chart", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Độ ẩm",
        lineTension: 0,
        backgroundColor: "blue",
        borderColor: "blue",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: "Giá trị",
        },
      },
    },
  },
});

const update_chart_lux = new Chart("lux-chart", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Cường độ ánh sáng",
        lineTension: 0,
        backgroundColor: "yellow",
        borderColor: "yellow",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: "Giá trị",
        },
      },
    },
  },
});

const update_chart_pressure = new Chart("pressure-chart", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Áp suất không khí",
        lineTension: 0,
        backgroundColor: "green",
        borderColor: "green",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: "Giá trị",
        },
      },
    },
  },
});

//API OpenWeatherMap
const api_key = "c06cbbb8c672c156e7cc7b854914e29a";
const city = "Hanoi";
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (data.cod === 200) {
      const temperature = (data.main.temp - 273.15).toFixed(2);
      const humidity = data.main.humidity.toFixed(2);
      const cloud = data.clouds.all;
      const airpressure_hPa = data.main.pressure;
      const airpressure_mmHg = (airpressure_hPa * 0.750061683).toFixed(2);

      document.getElementById("temperature_api").textContent =
        temperature + "°C";
      document.getElementById("humidity_api").textContent = humidity + "%";
      document.getElementById("cloud_api").textContent = cloud + "%";
      document.getElementById("pressure_api").textContent =
        airpressure_mmHg + " mmHg";
    } else {
      console.error("Khong the lay du lieu thoi tiet.");
    }
  })
  .catch((error) => {
    console.error("Loi khi ket noi den API:", error);
  });

//Cai dat che do
window.onload = function() {
  document.getElementById("switchactivated").checked = false;
}

document.getElementById("switchactivated").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("timeactivated").checked = false;
    document.getElementById("nguongactivated").checked = false;
  }
});
document.getElementById("timeactivated").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("switchtem").disabled = true;
    document.getElementById("switchlux").disabled = true;
    document.getElementById("switchactivated").checked = false;
    document.getElementById("nguongactivated").checked = false;
  }
});
document.getElementById("nguongactivated").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("switchtem").disabled = true;
    document.getElementById("switchlux").disabled = true;
    document.getElementById("switchactivated").checked = false;
    document.getElementById("timeactivated").checked = false;
  }
});

//Dieu khien thiet bi
document.getElementById("switchactivated").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("switchtem").disabled = false;
    document.getElementById("switchlux").disabled = false;
    document.getElementById("switchtem").addEventListener("change", function () {
      let switchValueTem;
      if (this.checked) {
        switchValueTem = 1;
      } else {
        switchValueTem = 0;
      }
      socket.emit("relayiotem", switchValueTem);
    });
    
    document.getElementById("switchlux").addEventListener("change", function () {
      let switchValueLux;
      if (this.checked) {
        switchValueLux = 1;
      } else {
        switchValueLux = 0;
      }
      socket.emit("relayiolux", switchValueLux);
    });
  }
  else {
    document.getElementById("switchtem").disabled = true;
    document.getElementById("switchlux").disabled = true;
  }
});

//Cai dat thoi gian
document.getElementById("timeactivated").addEventListener("change", function () {
  if (this.checked) {
    let isEventProcessedTem = false;
    function checkAndUpdateStatusTem() {
      const hour1data = parseInt(document.getElementById("hour1").value);
      const minute1data = parseInt(document.getElementById("minute1").value);
      const thoigian1data = parseInt(document.getElementById("thoigian1").value);

      const currentTime = moment();
      const currentHour = currentTime.format("HH");
      const currentMinute = currentTime.format("mm");

      if (
        hour1data === parseInt(currentHour) &&
        minute1data === parseInt(currentMinute) &&
        !isEventProcessedTem
      ) {
        document.getElementById("switchtem").checked = true;
        socket.emit("relayiotem", 1);
        isEventProcessedTem = true;

        setTimeout(() => {
          document.getElementById("switchtem").checked = false;
          socket.emit("relayiotem", 0);
          isEventProcessedTem = false;
        }, thoigian1data * 60 * 1000);
      }
    }

    const intervalIdTem = setInterval(checkAndUpdateStatusTem, 1000);


    let isEventProcessedLux = false;
    function checkAndUpdateStatusLux() {
      const hour2data = parseInt(document.getElementById("hour2").value);
      const minute2data = parseInt(document.getElementById("minute2").value);
      const thoigian2data = parseInt(document.getElementById("thoigian2").value);
    
      const currentTime = moment();
      const currentHour = currentTime.format("HH");
      const currentMinute = currentTime.format("mm");
    
      if (
        hour2data === parseInt(currentHour) &&
        minute2data === parseInt(currentMinute) &&
        !isEventProcessedLux
      ) {
        document.getElementById("switchlux").checked = true;
        socket.emit("relayiolux", 1);
        isEventProcessedLux = true;
    
        setTimeout(() => {
          document.getElementById("switchlux").checked = false;
          socket.emit("relayiolux", 0);
          isEventProcessedLux = false;
        }, thoigian2data * 60 * 1000);
      }
    }
    
    const intervalIdLux = setInterval(checkAndUpdateStatusLux, 1000);
    
  }
  else {
    document.getElementById("hour1").value = "";
    document.getElementById("minute1").value = "";
    document.getElementById("thoigian1").value = "";
    document.getElementById("hour2").value = "";
    document.getElementById("minute2").value = "";
    document.getElementById("thoigian2").value = "";
  }
});

//Cai dat nguong
let isEventProcessedTemControl = false;
let isEventProcessedLuxControl = false;

document.getElementById("nguongactivated").addEventListener("change", function () {
  if (this.checked) {
    socket.on("temperature_io", function (data_received) {
      let giatrithucte_temperature = data_received;
      const nguongnhietdo = parseInt(document.getElementById("nguongtem").value);
      if (nguongnhietdo < giatrithucte_temperature && !isEventProcessedTemControl) {
        document.getElementById("switchtem").checked = true;
        socket.emit("relayiotem", 1);
        isEventProcessedTemControl = true;
      } else if (nguongnhietdo >= giatrithucte_temperature && isEventProcessedTemControl) {
        document.getElementById("switchtem").checked = false;
        socket.emit("relayiotem", 0);
        isEventProcessedTemControl = false;
      }
    });

    socket.on("lux_io", function (data_received) {
      let giatrithucte_lux = data_received;
      const nguonganhsang = parseInt(document.getElementById("nguonglux").value);
      if (nguonganhsang > giatrithucte_lux && !isEventProcessedLuxControl) {
        document.getElementById("switchlux").checked = true;
        socket.emit("relayiolux", 1);
        isEventProcessedLuxControl = true;
      } else if (nguonganhsang <= giatrithucte_lux && isEventProcessedLuxControl) {
        document.getElementById("switchlux").checked = false;
        socket.emit("relayiolux", 0);
        isEventProcessedLuxControl = false;
      } 
    });
  } else {
    document.getElementById("nguongtem").value = "";
    document.getElementById("nguonglux").value = "";
  }
});





