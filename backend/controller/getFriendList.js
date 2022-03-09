const User = require("../models/user");

async function getFriendList(req, res) {
  const username = req.verifiedUser.username; //this is passed from the previous middleware (authenticateUser)
  const friendList = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: "users",
        localField: "friendList",
        foreignField: "_id",
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
        "friendsInfo.mutualFriendsId": {
          $setIntersection: ["$friendList", "$friendsInfo.friendList"],
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$friendsInfo" },
    },
    {
      $lookup: {
        from: "users",
        localField: "mutualFriendsId",
        foreignField: "_id",
        as: "mutualFriends",
      },
    },
    {
      $project: {
        username: 1,
        firstName: 1,
        lastName: 1,
        online: 1,
        profilePic: 1,
        mutualFriends: "$mutualFriends.firstName",
      },
    },
  ]);

  res.json(friendList);
}

module.exports = getFriendList;
