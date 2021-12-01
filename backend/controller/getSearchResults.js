const User = require("../models/user");

async function getSearchResults(req, res) {
  const thisUser = req.verifiedUser.username;
  const emptyString = /^\s+$|^$/gi;
  //   if (!req.query.search_term.match(emptyString)) {
  if (true) {
    thisUserFriendList = (
      await User.findOne({ username: thisUser }, { _id: 0, friendList: 1 })
    ).friendList;
    console.log(thisUserFriendList);
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
            },
          },
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              online: 1,
              friend: { $in: [thisUser, "$friendList"] },
              mutualFriends: {
                $setIntersection: ["$friendList", thisUserFriendList],
              },
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
              username: { $ne: thisUser },
            },
          },
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              online: 1,
              friend: { $in: [thisUser, "$friendList"] },
              mutualFriends: {
                $setIntersection: ["$friendList", thisUserFriendList],
              },
            },
          },
        ]);
    res.json(results);
  }
}

//this is not used yet but can be used to get the mutual friend information

// async function getMutualFriendInformation(thisUser, otherPerson) {
//   //match friendList of thisUser and otherPerson
//   const mutualFriends = await User.aggregate([
//     {
//       $match: {
//         username: { $in: [thisUser, otherPerson] },
//       },
//     },

//     {
//       $group: {
//         _id: null,
//         set: { $addToSet: "$friendList" },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         mutualFriends: {
//           $setIntersection: [
//             { $arrayElemAt: ["$set", 0] },
//             { $arrayElemAt: ["$set", 1] },
//           ],
//         },
//       },
//     },
//   ]);
// }

module.exports = getSearchResults;
