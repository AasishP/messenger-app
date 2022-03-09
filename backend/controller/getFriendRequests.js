const User = require("../models/user");

async function getFriendRequests(req, res) {
  const type = req.params.type;
  const username = req.verifiedUser.username; //this is passed from the previous middleware (authenticateUser)
  const friendRequests = await User.aggregate([
    { $match: { username } },

    {
      $lookup: {
        from: "users",
        localField:
          type === "pending" ? "friendRequestsPending" : "friendRequests",
        foreignField: "_id",
        as: "requestingPersonsInfo",
      },
    },
    {
      $project: {
        _id: 0,
        friendList: 1,
        requestingPersonsInfo: 1,
      },
    },
    {
      $unwind: "$requestingPersonsInfo",
    },
    {
      $addFields: {
        "requestingPersonsInfo.mutualFriendsId": {
          $setIntersection: [
            "$friendList",
            "$requestingPersonsInfo.friendList",
          ],
        },
      },
    },

    {
      $replaceRoot: { newRoot: "$requestingPersonsInfo" },
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

  console.log(friendRequests);
  res.json(friendRequests);
}

module.exports = getFriendRequests;
