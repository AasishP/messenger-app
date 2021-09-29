const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { usernameSchema, passwordSchema } = require("./inputValidationSchema");

//=========================== authentication with username and password ==================================
//if request doesnot contain the access token then verify with the username and password
async function verifyUsernameAndPassword(username, password) {
  if (
    usernameSchema.test(username) &&
    passwordSchema.test(password) &&
    username &&
    password
  ) {
    const user = await User.findOne({ username }); //quering the database for the user record
    if (user) {
      const matched = await bcrypt.compare(password, user.password); //comparing the password

      if (matched) {
        const accesstoken = jwt.sign(
          { _id: user._id, username: user.username },
          process.env.JWT_SECRET_KEY
        );
        user.validTokens.push(accesstoken);
        user.save();
        return { username, accesstoken };
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}
//========================== authentication with username and password ends =====================================

//========================== authentication with jwt token  =====================================
async function verifyToken(accesstoken) {
  /* This function returns username if token is verified and false otherwise. */
  try {
    const username = jwt.verify(
      accesstoken,
      process.env.JWT_SECRET_KEY
    ).username; //Taking the username from the token that we got.
    //only proceed if the token is valid. i.e if contains username
    if (username) {
      const result = await User.findOne({ username: username }).select({
        validTokens: 1,
      });
      //checking if the given token exist in the valid token list
      const index = result?.validTokens.findIndex((token) => {
        return token === accesstoken;
      });
      //index -1 means doesnot exist
      if (index !== -1 && index !== null && index !== undefined) {
        return { username };
      } else {
        return false;
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

//========================== authentication with jwt token ends =================================================

//==========================user authentication middleware=================================================

//This function authenticates the token in every request and if the token is not present then it checks for the username and password.
async function authenticateUser(req, res, next) {
  const accesstoken = req.header("Authorization")?.split(" ")[1]; //header in in form "Authorization":"Bearer token"  so taking the token part only.
  const username = req.body.username;
  const password = req.body.password;

  if (accesstoken) {
    //verify the token
    const verifiedUser = await verifyToken(accesstoken);
    verifiedUser && (req.verifiedUser = verifiedUser) && next();
    !verifiedUser && res.status(401).send("Invalid token!");
  } else {
    //verify username and password
    const verifiedUser = await verifyUsernameAndPassword(username, password); //This checks if the username and password is correct.
    verifiedUser && res.json({ accesstoken: verifiedUser.accesstoken });

    !verifiedUser && res.status(401).send("Username or Password is Incorrect!");
  }
}
//=============================user authentication middleware ends=================================================

module.exports = { authenticateUser, verifyToken };
