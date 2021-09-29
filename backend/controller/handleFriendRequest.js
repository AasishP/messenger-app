const User = require("../models/user");
const { usernameSchema } = require("./inputValidationSchema");

async function handleFriendRequest(req, res) {
  const username = req.body.username;
  const type = req.body.type;

  //validating the username
  if (usernameSchema.test(username)) {
    try {
      //checking if the username exists in the database and checking the requesting user and requested user is not same.
      //(i.e. you cannot send friendRequest to yourself)
      const usernameExists = await User.findOne({ username: username });
      if (usernameExists && usernameExists !== req.verifiedUser.username) {
        switch (type) {
          case "send":
            //adding the username to friendRequestsPending of the requesting user.
            const infriendRequest = Boolean(
              await User.findOne({
                username: req.verifiedUser.username,
                friendRequests: username,
              })
            );
            if (!infriendRequest) {
              await User.updateOne(
                { username: req.verifiedUser.username },
                { $addToSet: { friendRequestsPending: username } }
              );
              //adding the username of the requesting user to the friendRequests list of the requested user.
              await User.updateOne(
                { username: username },
                { $addToSet: { friendRequests: req.verifiedUser.username } }
              );
            }
            break;
          // and friendRequestsPending list of both the requesting and the requested user.
          case "cancel":
            //cancel sent request
            //removing the username from the friendRequests list of requested user.
            await User.updateOne(
              { username: username },
              { $pull: { friendRequests: req.verifiedUser.username } }
            );
            //removing the username from the friendRequests list of requesting user.
            await User.updateOne(
              { username: req.verifiedUser.username },
              { $pull: { friendRequestsPending: username } }
            );
            break;
          case "reject":
            //reject friend request
            //removing the username from the friendRequests list of this user (user that reject the request) .
            await User.updateOne(
              { username: req.verifiedUser.username },
              { $pull: { friendRequests: username } }
            );
            //removing the username from the friendRequestsPending list of requested user (user that sent the friend request).
            await User.updateOne(
              { username: username },
              { $pull: { friendRequestsPending: req.verifiedUser.username } }
            );
            break;
          case "accept":
            //accept friend Request
            //accept the request only if the request exists in the friendRequests list of the accepting user.

            Promise.all([
              //add the username to the friendList of the accepting user.
              await User.updateOne(
                { username: req.verifiedUser.username, friendRequests: username },
                { $addToSet: { friendList: username } }
              ),
              //adding the accepting user to the friendList of the requesting user
              await User.updateOne(
                { username: username, friendRequestsPending: req.verifiedUser.username },
                { $addToSet: { friendList: req.verifiedUser.username } }
              ),
            ]).then(async () => {
              //after both users have each other in their friendList the request and the pending request are removed.

              //removing the requested user from the friendRequestsPending list of requesting user.
              await User.updateOne(
                { username: username },
                { $pull: { friendRequestsPending: req.verifiedUser.username } }
              );
              //removing the requesting user from the friendRequests list of requested user.
              await User.updateOne(
                { username: req.verifiedUser.username },
                { $pull: { friendRequests: username } }
              );
            });

            break;
          case "unfriend":
            //unfriending i.e removing the each other from the friend list.
            await User.updateOne(
              { username: req.verifiedUser.username },
              { $pull: { friendList: username } }
            );
            await User.updateOne(
              { username: username },
              { $pull: { friendRequests: req.verifiedUser.username } }
            );
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
    } catch (err) {
      //if error occurs in handling the request
      console.log(err);
      res.status(500).send();
    }
  } else {
    //if username is missing or invalid
    res
      .status(400)
      .send(
        "missing or invalid username passed.\n set key 'username':'username of the requested user' "
      );
  }
}

module.exports = handleFriendRequest;
