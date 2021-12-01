const User = require("../models/user");

async function getPeopleYouMayKnow(req, res) {
  const username = req.verifiedUser.username;

  // const [result1, result2, result3] = await Promise.all([
  //   User.findOne({ username }).select({ friendList: 1 }),
  //   User.findOne({ username }).select({ friendRequestsPending: 1 }),
  //   User.findOne({ username }).select({ friendRequests: 1 }),
  // ]);
  // const friendList = result1.friendList;
  // const friendRequestsPending = result2.friendRequestsPending;
  // const friendRequests = result3.friendRequests;

  // const friendsOfFriend = await Promise.all(
  //   friendList.map((friend) => {
  //     return User.findOne({ username: friend })
  //       .select({ friendList: 1 })
  //       .then((result) => {
  //         return result.friendList;
  //       });
  //   })
  // );

  // //removing the duplicate people
  // const suggestedPeopleList = [...new Set(friendsOfFriend.flat())];

  // //removing self from the list of friendsOfFriend
  // suggestedPeopleList.splice(suggestedPeopleList.indexOf(username), 1);

  // //removing the users in your friend list
  // friendList.forEach((user) => {
  //   suggestedPeopleList.splice(suggestedPeopleList.indexOf(user), 1);
  // });

  // //removing users whom you have already sent friend request (i.e users in your friendRequestsPending list)
  // friendRequestsPending.forEach((user) => {
  //   suggestedPeopleList.splice(suggestedPeopleList.indexOf(user), 1);
  // });

  // //removing the users in your friendRequests list
  // friendRequests.forEach((user) => {
  //   suggestedPeopleList.splice(suggestedPeopleList.indexOf(user), 1);
  // });

  // //getting the info of the all suggested People
  // const suggestedPeopleInfo = await Promise.all(
  //   suggestedPeopleList.map((people) => {
  //     return User.findOne({ username: people }).select({
  //       firstName: 1,
  //       lastName: 1,
  //       username: 1,
  //       profilePic: 1,
  //       online: 1,
  //     });
  //   })
  // );

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
