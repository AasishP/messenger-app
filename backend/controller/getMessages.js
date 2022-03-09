const User = require("../models/user");

async function getMessages(req, res) {
  const username = req.verifiedUser.username; //first person
  const otherSide = req.params.with; //second person
  const result = await User.findOne(
    { username, conversations: { $elemMatch: { with: otherSide } } },
    { "conversations.$": 1 }
  )
    .populate("conversations.messages")
    .exec();

  const conversation = result?.conversations[0];
  conversation ? res.json(conversation) : res.send("No conversation found!");
}

module.exports = getMessages;
