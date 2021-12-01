const User = require("../models/user");

async function getFriendList(req, res) {
  const username = req.verifiedUser.username; //this is passed from the previous middleware (authenticateUser)
  const friendList = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: "users",
        localField: "friendList",
        foreignField: "username",
        as: "friendsInfo",
      },
    },
    {
      $project: {
        _id: 0,
        friendList: 1,
        friendsInfo: 1,
      },
    },
    {
      $unwind: "$friendsInfo",
    },
    {
      $addFields: {
        "friendsInfo.mutualFriends": {
          $setIntersection: ["$friendList", "$friendsInfo.friendList"],
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$friendsInfo" },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        username: 1,
        online: 1,
        profilePic: 1,
        mutualFriends: 1,
      },
    },
  ]);

  res.json(friendList);
}

module.exports = getFriendList;
