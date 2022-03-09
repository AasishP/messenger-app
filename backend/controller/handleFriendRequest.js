const User = require("../models/user");
const { usernameSchema } = require("./inputValidationSchema");

async function handleFriendRequest(req, res) {
  const requestingUsername = req.verifiedUser.username;
  const requestedUsername = req.body.username;
  const type = req.body.type;

  //validating the username
  try {
    if (usernameSchema.test(requestedUsername)) {
      //checking if the username exists in the database and checking the requesting user and requested user is not same.
      //(i.e. you cannot send friendRequest to yourself)
      const [requestingUser, requestedUser] = await Promise.all([
        User.findOne({ username: requestingUsername }),
        User.findOne({ username: requestedUsername }),
      ]);

      if (requestedUser && requestedUser.username !== requestingUser.username) {
        switch (type) {
          case "send":
            //check if the requested user is already in FriendRequests And FrindList of requesting user
            const inFriendRequestAndFrindList = await User.exists({
              username: requestingUser.username,
              friendRequests: requestedUser._id,
              friendList: requestedUser._id,
            });

            //adding the id to friendRequestsPending of the requesting user.
            if (!inFriendRequestAndFrindList) {
              await User.updateOne(
                { username: requestingUser.username },
                { $addToSet: { friendRequestsPending: requestedUser._id } }
              );
              //adding the id of the requesting user to the friendRequests list of the requested user.
              await User.updateOne(
                { username: requestedUser.username },
                { $addToSet: { friendRequests: requestingUser._id } }
              );
            }
            break;
          // and friendRequestsPending list of both the requesting and the requested user.
          case "cancel":
            //cancel sent request
            //removing the id from the friendRequests list of requested user.
            await User.updateOne(
              { username: requestedUser.username },
              { $pull: { friendRequests: requestingUser._id } }
            );
            //removing the id from the friendRequestsPending list of requesting user.
            await User.updateOne(
              { username: requestingUser.username },
              { $pull: { friendRequestsPending: requestedUser._id } }
            );
            break;
          case "reject":
            //reject friend request
            //removing the username from the friendRequests list of this user (user that reject the request) .
            await User.updateOne(
              { username: requestingUsername },
              { $pull: { friendRequests: requestedUser._id } }
            );
            //removing the username from the friendRequestsPending list of requested user (user that sent the friend request).
            await User.updateOne(
              { username: requestedUsername },
              { $pull: { friendRequestsPending: requestingUser._id } }
            );
            break;
          case "accept":
            //accept friend Request
            //accept the request only if the request exists in the friendRequests list of the accepting user.

            await Promise.all([
              //add the otheruser to the friendList of the accepting user.
              //remove the otheruser from the friendRequests list of the accepting user.
              User.updateOne(
                {
                  username: requestingUsername,
                  friendRequests: requestedUser._id,
                },
                {
                  $addToSet: { friendList: requestedUser._id },
                  $pull: { friendRequests: requestedUser._id },
                }
              ),

              //adding the accepting user to the friendList of the requesting user
              //remove the accepting user from the friendRequestsPending list of the requesting user.
              User.updateOne(
                {
                  username: requestedUsername,
                  friendRequestsPending: requestingUser._id,
                },
                {
                  $addToSet: { friendList: requestingUser._id },
                  $pull: { friendRequestsPending: requestingUser._id },
                }
              ),
            ]);
            break;

          case "unfriend":
            //unfriending i.e removing the each other from the friend list.
            await Promise.all([
              User.updateOne(
                { username: requestingUsername },
                { $pull: { friendList: requestedUser._id } }
              ),
              User.updateOne(
                { username: requestedUsername },
                { $pull: { friendList: requestingUser._id } }
              ),
            ]);
            break;

          default:
            //if type is missing or invalid
            res
              .status(400)
              .send(
                "missing or invalid friend Request Type.\n In request body key 'type':'send' to send the friendRequest \n set key 'type':'cancle' to cancel the friendRequest"
              );
            break;
        }
        //if the request completes successfully
        res.status(202).send(`successfully handled your request!`);
      } else {
        //if username passed doesnot exist in the database.
        res.status(406).send("invalid username!");
      }
    } else {
      //if username is missing or invalid
      res
        .status(400)
        .send(
          "missing or invalid username passed.\n set key 'username':'username of the requested user' "
        );
    }
  } catch (err) {
    //if error occurs in handling the request
    console.log(err);
    res.status(500).send();
  }
}

module.exports = handleFriendRequest;
