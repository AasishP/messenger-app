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
  const roomId = userInfo._id + 1;
  socket
    .to(roomId)
    .emit("incomingCall", { peerId, caller: connectedUser, callType }); //informing the receiver that someone is calling.
}

function handleCallAcknowledgement(peerId, caller, receiver, callType) {
  const socket = this;
  const roomId = caller._id + 1;
  socket
    .to(roomId)
    .emit("acknowledgedCall", peerId, caller, receiver, callType);
}

function handleNoAnswer(callingUser) {
  const socket = this;
  const roomId = callingUser._id + 1;
  console.log(roomId, "this is from here..");
  socket.to(roomId).emit("noAnswer");
}

function handleCallEnd(callingUser) {
  const socket = this;
  const roomId = callingUser._id + 1;
  socket.to(roomId).emit("callEnd");
}
function handleCallReject(callingUser) {
  const socket = this;
  const roomId = callingUser._id + 1;
  socket.to(roomId).emit("callRejected");
}

module.exports = {
  handleCall,
  handleCallAcknowledgement,
  handleNoAnswer,
  handleCallEnd,
  handleCallReject,
};
