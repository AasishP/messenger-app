const User = require("../models/user");

async function getSearchResults(req, res) {
  const thisUsername = req.verifiedUser.username;
  const emptyString = /^\s+$|^$/gi;
  if (!req.query.search_term.match(emptyString)) {
    thisUser = await User.findOne(
      { username: thisUsername },
      { friendList: 1 }
    );
    const thisUserFriendList = thisUser.friendList;
    const searchTerm = req.query.search_term.split(" ");
    const firstWordRegExp = new RegExp(searchTerm[0], "ig");
    const secondWordRegExp = new RegExp(searchTerm[1], "ig");
    //if searchTerm contains two word then match firstWord with firstName and lastWord with lastName.
    //if searchTerm contains only one word then match it with both firstName and lastName and return if match any.
    const results = searchTerm[1]
      ? await User.aggregate([
          {
            $match: {
              firstName: firstWordRegExp,
              lastName: secondWordRegExp,
              username: { $ne: thisUsername },
            },
          },
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              online: 1,
              isFriend: { $in: [thisUser._id, "$friendList"] },
              hasSentFriendRequest: {
                $in: [thisUser._id, "$friendRequestsPending"],
              },
              isRequestPending: { $in: [thisUser._id, "$friendRequests"] },
              mutualFriendsId: {
                $setIntersection: ["$friendList", thisUserFriendList],
              },
            },
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
              isFriend: 1,
              hasSentFriendRequest: 1,
              isRequestPending: 1,
              mutualFriends: "$mutualFriends.firstName",
            },
          },
        ])
      : await User.aggregate([
          {
            $match: {
              $or: [
                { firstName: firstWordRegExp },
                { lastName: firstWordRegExp },
              ],
              username: { $ne: thisUsername },
            },
          },
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              online: 1,
              isFriend: { $in: [thisUser._id, "$friendList"] },
              hasSentFriendRequest: {
                $in: [thisUser._id, "$friendRequestsPending"],
              },
              isRequestPending: { $in: [thisUser._id, "$friendRequests"] },
              mutualFriendsId: {
                $setIntersection: ["$friendList", thisUserFriendList],
              },
            },
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
              isFriend: 1,
              hasSentFriendRequest: 1,
              isRequestPending: 1,
              mutualFriends: "$mutualFriends.firstName",
            },
          },
        ]);

    console.log(results);

    res.json(results);
  }
}

module.exports = getSearchResults;
