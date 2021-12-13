const User = require("../models/user");
const colors=require("colors")

async function getMessages(req, res) {
  const username = req.verifiedUser.username; //first person
  const otherSide = req.params.with; //second person
  console.log(otherSide.blue)
  const result = await User.find(
    { username, conversations: { $elemMatch: { with: otherSide } } },
    { "conversations.$": 1 }
  );
  const conversation=result[0]?.conversations[0];
  
  conversation?res.json(conversation):res.send("No conversation found!");
}

module.exports = getMessages;
