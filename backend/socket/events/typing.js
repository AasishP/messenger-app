const User = require("../../models/user");

async function handleTyping(recipient, state) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser;

  const rec = await User.findOne({ username: recipient });

  const roomId = rec._id + 1;
  socket.to(roomId).emit("typing", state, connectedUser.username);
}

module.exports = handleTyping;
