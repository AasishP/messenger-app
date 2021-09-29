const User = require("../models/user");

async function getUserInfo(req, res) {
  const username = req.params.username;
  const result = await User.findOne({ username: username }).select({
    username: 1,
    firstName: 1,
    lastName: 1,
    profilePic: 1,
    newUser: 1,
    online: 1,
  });
  res.json(result);
}

module.exports = getUserInfo;
