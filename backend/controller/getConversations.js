const User = require("../models/user");

async function getConversations(req, res) {
  const username = req.verifiedUser.username;
  const result = await User.findOne({ username }).select({
    conversations: 1,
  });
  const conversations = result.conversations;

  //sorting conversations besed on the latest message of the conversation.
  //(conversation with latest message comes first.)
  
  const sortedConversations = conversations.sort((a, b) => {
    return (
      Date.parse(b.messages[b.messages.length - 1].timestamp) -
      Date.parse(a.messages[a.messages.length - 1].timestamp)
    );
  });
  res.json(sortedConversations);
}

module.exports = getConversations;
