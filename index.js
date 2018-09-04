const serialport = require("serialport");
const axios = require("axios");

const url = "http://192.168.2.65:5000/temperatures";
console.log("starts");

const port = new serialport("/dev/ttyACM0", {
  baudRate: 9600
});

const Readline = serialport.parsers.Readline;
const parser = new Readline();
port.pipe(parser);

function onPortOpen() {
  console.log("port open");
}

const addData = async temperature => {
  console.log("data received: " + temperature);
  axios.post(url, {
    temp: temperature
  });
};

const onClose = () => {
  console.log("port closed");
};

const onError = error => {
  console.log("error:", error);
};

port.on("open", onPortOpen);
parser.on("data", addData);
port.on("close", onClose);
port.on("error", onError);
