const User = require("../../models/user");

async function handleCall(peerId, userInfo, callType) {
  const socket = this;
  const connectedUser = await User.findOne({
    username: socket.request.verifiedUser.username,
  }).select({
    username: 1,
    firstName: 1,
    lastName: 1,
    profilePic: 1,
    online: 1,
  });
  socket
    .to(userInfo.username)
    .emit("incomingCall", { peerId, caller: connectedUser, callType }); //informing the receiver that someone is calling.
}

function handleCallAcknowledgement(peerId, caller, receiver, callType) {
  const socket = this;
  socket
    .to(caller.username)
    .emit("acknowledgedCall", peerId, caller, receiver, callType);
}

function endCall(callingUser) {
  const socket = this;
  socket.to(callingUser).emit("callEnd");
}

module.exports = { handleCall, handleCallAcknowledgement, endCall };
