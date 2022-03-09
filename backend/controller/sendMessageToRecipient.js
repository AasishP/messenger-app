const Message = require("../models/message");

async function sendMediaMessageToRecipient(messageId, recipientId) {
  const socket = this;
  const message = await Message.findOne({ _id: messageId });
  const roomId = recipientId + 1;
  socket.to(roomId).emit("receive-message", message);
}

module.exports = sendMediaMessageToRecipient;
