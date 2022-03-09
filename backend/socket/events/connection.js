const updateUserOnlineState = require("../../controller/updateUserState");
const handleDisconnect = require("./disconnect");
const handleMessage = require("./message");
const handleTyping = require("./typing");
const {
  handleCall,
  handleCallAcknowledgement,
  handleCallEnd,
  handleNoAnswer,
  handleCallReject,
} = require("./call");
const sendMediaMessageToRecipient = require("../../controller/sendMessageToRecipient");

async function handleConnection(socket) {
  const connectedUser = socket.request.verifiedUser;

  //ObjectId as room id is not working so changing it by adding 1
  const roomId = connectedUser._id + 1;
  socket.join(roomId); //creating a personal room with which other can communicate with me directly

  updateUserOnlineState(socket, true); //setting user online
  console.log(connectedUser.username + " is online!");

  socket.on("send-message", handleMessage); //client sent a message.

  socket.on("gotMediaMessaageResponse", sendMediaMessageToRecipient);

  socket.on("typing", handleTyping); //client sent a message.

  socket.on("outgoingCall", handleCall);

  socket.on("callAcknowledged", handleCallAcknowledgement);

  socket.on("callEnd", handleCallEnd);

  socket.on("noAnswer", handleNoAnswer);

  socket.on("callRejected", handleCallReject);

  //disconnect
  socket.on("disconnect", (reason) => {
    handleDisconnect(reason, socket);
  });
}

module.exports = handleConnection;
