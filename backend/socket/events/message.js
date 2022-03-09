const pushMessageToSenderAndReceiverConversation = require("../../controller/pushMessageToSenderAndReceiverConversation");
const Message = require("../../models/message");
const User = require("../../models/user");

async function handleMessage(msg) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser;

  //create a new message in message collection
  const message = await Message.create({
    from: connectedUser.username,
    text: msg.text,
    timestamp: new Date(),
  });

  try {
    await pushMessageToSenderAndReceiverConversation(
      connectedUser.username,
      msg.recipient,
      message._id
    );
    const recipientId = (
      await User.findOne({ username: msg.recipient })
    )._id;

    const roomId = recipientId + 1;

    //send message to receiver
    socket.to(roomId).emit("receive-message", message);
  } catch (err) {
    socket.send(err);
  }
}

module.exports = handleMessage;
