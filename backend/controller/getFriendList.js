const User = require("../models/user");

async function getFriendList(req, res) {
  const username = req.verifiedUser.username; //this is passed from the previous middleware (authenticateUser)
  const friends = (await User.findOne({ username }).select({ friendList: 1 }))
    .friendList;
  const promises = friends.map((username) => {
    return User.findOne({ username }).sort({ online: 1 }).select({
      firstName: 1,
      lastName: 1,
      username: 1,
      profilePic: 1,
      online: 1,
    });
  });
  const friendList = await Promise.all(promises);

  //shorting the friend list based on online status.
  friendList.sort((a, b) => {
    if (a.online > b.online) {
      return -1;
    } else if (a.online < b.online) {
      return 1;
    }
    return 0;
  });

  res.json(friendList);
}

module.exports = getFriendList;
