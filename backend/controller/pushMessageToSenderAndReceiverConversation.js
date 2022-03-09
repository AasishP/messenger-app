const User = require("../models/user");

/**
 * @param {string} sender username of sender
 * @param {string} recipient username of recipient
 * @param {object} messageId message _id
 */

async function pushMessageToSenderAndReceiverConversation(
  sender,
  recipient,
  messageId
) {
  //check if recipient is in the friends list of the connected user.
  const recipientId=(await User.findOne({ username:recipient},{_id:1}))._id;
  const isRecipientInFriendsList = await User.findOne({
    username: sender,
    friendList: recipientId,
  }).exec();

  if (!isRecipientInFriendsList) {
    throw new Error("recipient not in friendList");
  }

  const [conversationExistsInSender, conversationExistsInRecipient] =
    await Promise.all([
      //adding message to sender's conversation list.
      await User.findOneAndUpdate(
        {
          username: sender,
          conversations: { $elemMatch: { with: recipient } },
        },
        { $push: { "conversations.$.messages": messageId } }
      ),
      //adding message to recipient's conversation list.
      await User.findOneAndUpdate(
        {
          username: recipient,
          conversations: { $elemMatch: { with: sender } },
        },
        { $push: { "conversations.$.messages": messageId } }
      ),
    ]);

  if (!conversationExistsInSender) {
    //starting conversation with the recipient.
    await User.updateOne(
      { username: sender },
      {
        $push: {
          conversations: {
            with: recipient,
            messages: [messageId],
          },
        },
      }
    ).exec((err) => {
      err && console.log(err);
      !err && console.log("conversation started with " + recipient);
    });
  }

  if (!conversationExistsInRecipient) {
    //starting conversation with the connected user and adding it to recipient conversations list.
    await User.updateOne(
      { username: recipient },
      {
        $push: {
          conversations: {
            with: sender,
            messages: [messageId],
          },
        },
      }
    ).exec((err) => {
      err && console.log(err);
      !err && console.log("conversation started with " + sender);
    });
  }
}

module.exports = pushMessageToSenderAndReceiverConversation;
