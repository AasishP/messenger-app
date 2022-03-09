const updateUserOnlineState = require("../../controller/updateUserState");

function handleDisconnect(reason, socket) {
  updateUserOnlineState(socket, false);
  console.log(`${socket.request.verifiedUser.username} disconnected!`);
}

module.exports = handleDisconnect;
