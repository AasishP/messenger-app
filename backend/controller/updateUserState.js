const User = require("../models/user");

async function updateUserOnlineState(socket, state) {
  const connectedUser = socket.request.verifiedUser;

  const friendList = (
    await User.findOneAndUpdate(
      { username: connectedUser.username },
      { $set: { online: state } }
    ).select({ friendList: 1 })
  ).friendList;

  friendList.forEach((user) => {
    socket.to(user+1).emit("onlineStateChange", connectedUser.username, state);
  });
}
module.exports = updateUserOnlineState;
