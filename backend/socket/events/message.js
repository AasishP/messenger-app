const pushMessageToSenderAndReceiverConversation = require("../../controller/pushMessageToSenderAndReceiverConversation");
const handleMediaMessage = require("../../controller/handleMediaMessage");

async function handleMessage(msg) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser.username;

  //check if message contains any images in media
  if (msg.media?.image) {
    handleMediaMessage(msg, connectedUser);
    return;
  }

  const message = {
    from: connectedUser,
    text:msg.text,
    timestamp: new Date(),
  };

  try {
    pushMessageToSenderAndReceiverConversation(
      connectedUser,
      msg.recipient,
      msg
    );
  } catch (err) {
    socket.send(err);
  }

  //send message to receiver
  socket.to(msg.recipient).emit("receive-message", message);
}

module.exports = handleMessage;
