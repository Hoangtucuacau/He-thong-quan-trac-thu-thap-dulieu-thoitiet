const express = require("express");
const app = express();
const ejs = require("ejs");
const mqtt = require("mqtt");
const mongoose = require("mongoose");

var port = 8500;

const mongoURI =
  "mongodb+srv://admin123:1@cluster0.wzznk.mongodb.net/Datab";
mongoose.connect(mongoURI);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Loi khi ket noi MongoDB:"));
db.once("open", function () {
  console.log("Da ket noi MongoDB");
});

const dataSchema = new mongoose.Schema(
  {
    temperature: Number,
    humidity: Number,
    lux: Number,
    pressure: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "sensor-data" }
);

const Data = mongoose.model("Data", dataSchema);

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("index");
});
app.use("/public", express.static("public"));

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(port);

const options = {
  username: "abc",
  password: "jp4jfwJHNXaql5gJ9xZzF8PNJm7oZ2ND",
};

const client = mqtt.connect('mqtt://mqttvcloud.innoway.vn', options);

client.on('connect', () => {
    console.log('Đã kết nối đến MQTT broker');
  
    mqttClient.subscribe('sensor', (err) => {
      if (err) {
        console.error('Lỗi khi đăng ký topic sensor', err);
      } else {
        console.log('Đã đăng ký topic sensor');
      }
    });
});

client.on("message", async function (topic, message) {
  const data = JSON.parse(message);
  var temperature_data = data.temperature.toFixed(2);
  var humidity_data = data.humidity.toFixed(2);
  var lux_data = data.lux.toFixed(2);
  var pressure_data = data.pressure.toFixed(2);

  io.emit("temperature_io", temperature_data);
  io.emit("humidity_io", humidity_data);
  io.emit("lux_io", lux_data);
  io.emit("pressure_io", pressure_data);

  const currentUTCDate = new Date();
  currentUTCDate.setHours(currentUTCDate.getHours() + 7);

  const newData = new Data({
    temperature: parseFloat(temperature_data),
    humidity: parseFloat(humidity_data),
    lux: parseFloat(lux_data),
    pressure: parseFloat(pressure_data),
    timestamp: currentUTCDate.toISOString(),
  });

  try {
    await newData.save();
    console.log(
      "Da luu du lieu vao MongoDB - Temperature: " +
        newData.temperature +
        ", Humidity: " +
        newData.humidity +
        ", Lux: " +
        newData.lux +
        ", Pressure: " +
        newData.pressure +
        ", Thoi gian: " +
        newData.timestamp
    );
  } catch (error) {
    console.error("Loi khi luu du lieu vao MongoDB:", error);
  }
});

console.log("Website co dia chi:");
console.log(`http://localhost:${port}`);

io.on("connection", function (socket) {
  socket.on("relayiotem", function (relayValue) {
    let mqttMessage;
    if (relayValue === 1) {
      mqttMessage = "1";
    } else {
      mqttMessage = "0";
    }
    client.publish("relaytem", mqttMessage);
  });

  socket.on("relayiolux", function (relayValue) {
    let mqttMessage;
    if (relayValue === 1) {
      mqttMessage = "1";
    } else {
      mqttMessage = "0";
    }
    client.publish("relaylux", mqttMessage);
  });
});
