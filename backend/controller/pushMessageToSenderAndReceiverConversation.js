const User = require("../models/user")

/**
 * @param {string} sender The message sender
 * @param {string} recipient The message recipient
 * @param {object} message The message
 */

async function pushMessageToSenderAndReceiverConversation(
  sender,
  recipient,
  message
) {
  //check if recipient is in the friends list of the connected user.
  const isRecipientInFriendsList = await User.findOne({
    username: sender,
    friendList: recipient,
  });

  if (!isRecipientInFriendsList) {
    throw new Error("recipient not in friendList");
  }

  const [conversationExistsInSender, conversationExistsInRecipient] =
    await Promise.all([
      //adding message to sender's conversation list.
      User.findOneAndUpdate(
        {
          username: sender,
          conversations: { $elemMatch: { with: recipient } },
        },
        { $push: { "conversations.$.messages": message } }
      ),
      //adding message to recipient's conversation list.
      User.findOneAndUpdate(
        {
          username: recipient,
          conversations: { $elemMatch: { with: sender } },
        },
        { $push: { "conversations.$.messages": message } }
      ),
    ]);

  if (!conversationExistsInSender) {
    //starting conversation with the recipient.
    User.updateOne(
      { username: sender },
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
            with: sender,
            messages: [message],
          },
        },
      }
    ).then(() => {
      console.log("new conversation started with " + sender);
    });
  }
}

module.exports = pushMessageToSenderAndReceiverConversation;
