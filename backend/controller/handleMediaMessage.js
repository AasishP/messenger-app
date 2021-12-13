const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

async function updateMediaMessage(sender, recipient, _id, mediaType, mediaUrl) {
  const mediaArrayString = {
    image: "images",
    video: "videos",
    file: "files",
  }[mediaType];

  //updating message with mediaUrl
  [
    { sender, recipient },
    { sender: recipient, recipient: sender },
  ].forEach(async ({ sender, recipient }) => {
    const response = await User.findOneAndUpdate(
      { username: sender },
      {
        $push: {
          "conversations.$[conversation].messages.$[message].media.images":
            mediaUrl,
        },
      },
      {
        arrayFilters: [
          { "conversation.with": recipient },
          { "message._id": _id },
        ],
      }
    );
  });
}

async function handleMediaMessage(msg, thisUser) {
  try {
    //checking if the message is valid
    const { _id, sender, recipient, mediaType, mediaCount } = jwt.verify(
      msg.token,
      process.env.JWT_SECRET_KEY
    );
    if (sender !== thisUser || recipient !== msg.recipient) {
      throw new Error("Bad request!");
    }

    //uploding to cloudinary
    const response = await cloudinary.uploader.upload(msg.media.image, {
      resource_type: "image",
      upload_preset: "messageMedia",
    });
    const imageThumbnailUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/w_200,h_200,c_thumb/${response.public_id}`;
    const fullImageUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/${response.public_id}`;

    //pushing the mediaUrl to both sender and receivers conversation
    updateMediaMessage(sender, recipient, _id, mediaType, fullImageUrl);
  } catch (err) {
    console.log(err);
    socket.send("something went wrong!");
  }
}

module.exports = handleMediaMessage;
