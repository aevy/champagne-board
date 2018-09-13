const udp = require("dgram");
const socket = udp.createSocket("udp4");
const {
  logstash: { host, port }
} = require("../config.js");

const sendTo = obj => {
  const serialized = JSON.stringify(obj);
  console.log(serialized);
  const buffer = Buffer.from(serialized);
  socket.send(buffer, port, host);
};

module.exports = {
  sendTo
};
