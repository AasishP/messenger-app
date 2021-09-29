const User = require("../models/user");

async function updateUserOnlineState(socket, username, state) {
  await User.updateOne({ username }, { $set: { online: state } });
  const friendList = (
    await User.findOne({ username }).select({ friendList: 1 })
  ).friendList;
  friendList.forEach((user) => {
    socket.to(user).emit("onlineStateChange", username, state);
    console.log(user + " informed " + state);
  });
}
module.exports = updateUserOnlineState;
