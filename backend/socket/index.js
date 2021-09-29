const auth = require("./auth");
const handleConnection = require("./events/connection");

function initializeSocket(io) {
  //middlewares
  io.use(auth);

  //event handlers
  io.on("connection",handleConnection);

}

module.exports = initializeSocket;
