const Message = require("../models/message");
const User = require("../models/user");
const pushMessageToSenderAndReceiverConversation = require("./pushMessageToSenderAndReceiverConversation");

async function updateMediaMessage(req, res) {
  const sender = req.verifiedUser;
  const recipientUsername = req.body.recipient;

  let message = await Message.create({
    from: sender.username,
    timestamp: new Date(),
    text: req.body.text,
    media: {
      images: req.files.images?.map((image) => {
        return {
          original_name: image.originalname,
          secure_url: image.secure_url,
        };
      }),
      videos: req.files.videos?.map((video) => {
        return {
          original_name: video.originalname,
          secure_url: video.secure_url,
        };
      }),
      files: req.files.files?.map((file) => {
        return {
          original_name: file.originalname,
          secure_url: file.secure_url,
        };
      }),
    },
  });

  const recipient = await User.findOne({
    username: recipientUsername,
    friendList: sender._id,
  });
  message = message.toJSON();
  message.recipientId = recipient._id;
  console.log(message);
  try {
    await pushMessageToSenderAndReceiverConversation(
      sender.username,
      recipient.username,
      message._id
    );
    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }

  res.send();
}

module.exports = updateMediaMessage;
