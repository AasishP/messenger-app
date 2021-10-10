function handleCall(peerId, userInfo, callType) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser.username;
  socket
    .to(userInfo.username)
    .emit("incomingCall", { peerId, caller: connectedUser, callType }); //informing the receiver that someone is calling.
}

function handleCallAcknowledgement(peerId, caller, receiver, callType) {
  const socket = this;
  socket
    .to(caller)
    .emit("acknowledgedCall", peerId, caller, receiver, callType);
}

module.exports = { handleCall, handleCallAcknowledgement };
