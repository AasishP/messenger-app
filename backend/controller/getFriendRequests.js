const User = require("../models/user");

async function getFriendRequests(req, res) {
  const type = req.params.type;
  const username = req.verifiedUser.username; //this is passed from the previous middleware (authenticateUser)
  const requests = (
    await User.findOne({ username }).select(
      type==="pending" ? { friendRequestsPending: 1 } : { friendRequests: 1 }
    )
  )[type==="pending"?'friendRequestsPending':'friendRequests'];
  
  const promises = requests.map((username) => {
    return User.findOne({ username }).select({
      firstName: 1,
      lastName: 1,
      username: 1,
      profilePic: 1,
      online: 1,
    });
    
  });
  const friendRequests = await Promise.all(promises);
  res.json(friendRequests);
}

module.exports = getFriendRequests;
