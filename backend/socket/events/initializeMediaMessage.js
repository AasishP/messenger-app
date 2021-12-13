const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const pushMessageToSenderAndReceiverConversation = require("../../controller/pushMessageToSenderAndReceiverConversation");

async function initializeMediaMessage(
  { recipient, text, mediaType, mediaCount },
  acknowledge
) {
  console.log("Initializing");
  const socket = this;
  const sender = socket.request.verifiedUser.username;
  const msgId = mongoose.Types.ObjectId();

  //create message object
  const message = {
    _id: msgId,
    timestamp: new Date(),
    text,
    media: {
      uploading: true,
    },
  };

  pushMessageToSenderAndReceiverConversation(sender, recipient, message);

  const accesstoken = jwt.sign(
    { _id: msgId, sender, recipient, mediaType, mediaCount },
    process.env.JWT_SECRET_KEY
  );
  acknowledge(accesstoken);
}

module.exports = initializeMediaMessage;
