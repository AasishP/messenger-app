const User = require("../models/user")

async function logout(req, res) {
  const accesstoken = req.header("Authorization")?.split(" ")[1]; //header in in form "Authorization":"Bearer token"  so taking the token part only.
  const logoutType = req.header("LogoutType");
  const username = req.verifiedUser.username; //if the token is verified by the authenticateUser function then the verifiedUser is passed through the req object.
  const result = await User.findOne({ username: username }).select({
    validTokens: 1,
  }); //get the user from the database.
  //checking if the given token exist in the valid token list
  const index = result.validTokens.findIndex((token) => {
    if (token === accesstoken) {
      return true;
    }
    return false;
  });
  //index -1 means doesnot exist
  if (index !== -1) {
    //for logoutType all (logout from all devices)
    if (logoutType === "all") {
      result.validTokens = []; //removing all valid tokens
      result.save();
      res.send("logged out succesfully!");
    } else {
      result.validTokens.splice(index, 1); //removing the token from the list of valid tokens.
      result.save(); //saving the changes to the database.
      res.send("logged out succesfully!");
    }
  } else {
    res.status(401).send("logout failed! \n Invalid Token submission.");
  }
}

module.exports=logout;