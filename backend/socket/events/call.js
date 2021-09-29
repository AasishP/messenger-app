function handleCall(peerId,userInfo, callType, ack) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser.username;
  socket.to(userInfo._id).emit("incoming",peerId,connectedUser);
  ack({ name: "hello", user: connectedUser });
}

module.exports = handleCall;
