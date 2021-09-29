const { Promise } = require("mongoose");
const User = require("../../models/user");

async function handleMessage(recipient, text) {
  const socket = this;
  const connectedUser = socket.request.verifiedUser.username;

  //check if recipient is in the friends list of the connected user.
  const isRecipientInFriendsList = await User.findOne({
    username: connectedUser,
    friendList: recipient,
  });

  if (!isRecipientInFriendsList) {
    socket.send("Error:recipient is not in your friends list.");
    return;
  }

  const message = {
    from: connectedUser,
    text,
    timestamp: new Date(),
  };

  socket.to(recipient).emit("receive-message", message); //sending message to recipient.

  const [conversationExistsInconnectedUser, conversationExistsInRecipient] =
    await Promise.all([
      //adding message to connectedUser's conversation list.
      User.findOneAndUpdate(
        {
          username: connectedUser,
          conversations: { $elemMatch: { with: recipient } },
        },
        { $push: { "conversations.$.messages": message } }
      ),
      //adding message to recipient's conversation list.
      User.findOneAndUpdate(
        {
          username: recipient,
          conversations: { $elemMatch: { with: connectedUser } },
        },
        { $push: { "conversations.$.messages": message } }
      ),
    ]);

  if (!conversationExistsInconnectedUser) {
    //starting conversation with the recipient.
    User.updateOne(
      { username: connectedUser },
      {
        $push: {
          conversations: {
            with: recipient,
            messages: [message],
          },
        },
      }
    ).then(() => {
      console.log("new conversation started with " + recipient);
    });
  }

  if (!conversationExistsInRecipient) {
    //starting conversation with the connected user and adding it to recipient conversations list.
    User.updateOne(
      { username: recipient },
      {
        $push: {
          conversations: {
            with: connectedUser,
            messages: [message],
          },
        },
      }
    ).then(() => {
      console.log("new conversation started with " + connectedUser);
    });
  }
}

module.exports = handleMessage;
