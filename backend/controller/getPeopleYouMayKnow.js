const User = require("../models/user");

async function getPeopleYouMayKnow(req, res) {
  const username = req.verifiedUser.username;

  const suggestedPeopleInfo = await User.aggregate([
    { $match: { username: username } },
    {
      $project: {
        friendList: 1,
        knownPersons: {
          $setUnion: [
            "$friendList",
            "$friendRequests",
            "$friendRequestsPending",
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "knownPersons",
        foreignField: "username",
        as: "knownPersonsInfo",
      },
    },
    {
      $project: {
        _id: 0,
        friendList: 1,
        knownPersons: 1,
        peopleYouMayKnow: "$knownPersonsInfo.friendList",
      },
    },
    { $unwind: "$peopleYouMayKnow" },
    { $unwind: "$peopleYouMayKnow" },
    {
      $group: {
        _id: {
          friendList: "$friendList",
          knownPersons: "$knownPersons",
        },
        peopleYouMayKnow: { $addToSet: "$peopleYouMayKnow" },
      },
    },
    {
      $project: {
        peopleYouMayKnow: {
          $setDifference: ["$peopleYouMayKnow", "$_id.knownPersons"],
        },
      },
    },
    {
      $project: {
        peopleYouMayKnow: { $setDifference: ["$peopleYouMayKnow", [username]] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "peopleYouMayKnow",
        foreignField: "username",
        as: "peopleYouMayKnowInfo",
      },
    },
    { $unwind: "$peopleYouMayKnowInfo" },
    {
      $addFields: {
        "peopleYouMayKnowInfo.mutualFriends": {
          $setIntersection: [
            "$_id.friendList",
            "$peopleYouMayKnowInfo.friendList",
          ],
        },
      },
    },
    {
      $project: {
        _id: "$peopleYouMayKnowInfo._id",
        username: "$peopleYouMayKnowInfo.username",
        firstName: "$peopleYouMayKnowInfo.firstName",
        lastName: "$peopleYouMayKnowInfo.lastName",
        online: "$peopleYouMayKnowInfo.online",
        mutualFriends: "$peopleYouMayKnowInfo.mutualFriends",
        profilePic: "$peopleYouMayKnowInfo.profilePic",
      },
    },
  ]);

  res.json(suggestedPeopleInfo);
}

module.exports = getPeopleYouMayKnow;
