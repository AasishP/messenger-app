const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  firstNameSchema,
  lastNameSchema,
  usernameSchema,
  passwordSchema,
} = require("./inputValidationSchema");
const capitalize= require("../helpers/capitalize")

const saltRounds = 10; //for bcrypt salt

//createUser
async function createUser(req, res, next) {
  try {
    const { firstName, lastName, username, password } = req.body;
    if (
      firstNameSchema.test(firstName) &&
      lastNameSchema.test(lastName) &&
      usernameSchema.test(username) &&
      passwordSchema.test(password) &&
      firstName &&
      lastName &&
      username &&
      password
    ) {
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        username,
        password: hash,
      });
      user && res.status(201).send("user successfully registered!");
    } else {
      res.status(400).send("invalid or missing parameters!");
    }
  } catch (err) {
    //errcode 11000 is for data duplication in database
    if (err.code === 11000) {
      res.status(400).send("this username is already taken!");
    } else {
      console.log(err);
      res.status(500).send();
    }
  }
  next();
}

module.exports = createUser;
