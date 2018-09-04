const serialport = require("serialport");
const http = require("http");
const fs = require("fs");

console.log("starts");

const port = new serialport("/dev/ttyACM0", {
  baudRate: 9600
  //parser:serialport.parsers.readline('\n')
});

const Readline = serialport.parsers.Readline;
const parser = new Readline();
port.pipe(parser);

port.on("open", onPortOpen);
parser.on("data", onData);
port.on("close", onClose);
port.on("error", onError);
port.write("Hi there");

function onPortOpen() {
  console.log("port open");
}

const fetchData = () => {
  try {
    let string = fs.readFileSync("data.json");
    return JSON.parse(string);
  } catch (e) {
    return [];
  }
};

const addData = temperature => {
  let dataArray = fetchData();
  let singleData = { temperature };

  dataArray.push(singleData);
  fs.writeFileSync("data.json", JSON.stringify(dataArray));
};

function onData(data) {
  console.log("data received: " + data);
  addData(data);
}

const html = fs.readFile("./main.html", function(err, html) {
  if (err) {
    throw err;
  }
  http
    .createServer(function(req, res) {
      res.writeHeader(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    })
    .listen(8000);
});

function onClose() {
  console.log("port closed");
}

function onError() {
  console.log("error");
}
