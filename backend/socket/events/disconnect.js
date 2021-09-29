const updateUserOnlineState = require("../../controller/updateUserState");

function handleDisconnect(reason, socket) {
  const connectedUser = socket.request.verifiedUser.username;
  updateUserOnlineState(socket,connectedUser, false);
  console.log(`${socket.request.verifiedUser.username} disconnected!`);
}

module.exports = handleDisconnect;
