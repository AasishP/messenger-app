const express = require("express");
const createUser = require("../controller/createUser");
const createRoom = require("../controller/createRoom");
const { authenticateUser } = require("../controller/userAuth");
const getFriendList = require("../controller/getFriendList");
const getFriendRequests = require("../controller/getFriendRequests");
const getPeopleYouMayKnow = require("../controller/getPeopleYouMayKnow");
const logout = require("../controller/logout");
const handleFriendRequest = require("../controller/handleFriendRequest");
const getUserInfo = require("../controller/getUserInfo");
const uploadProfilePic = require("../controller/uploadProfilePic");
const User = require("../models/user");
const getMessages = require("../controller/getMessages");
const getConversations = require("../controller/getConversations");
const getSearchResults = require("../controller/getSearchResults");
const route = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("../helpers/cloudinaryStorage");
const updateMediaMessage = require("../controller/updateMediaMessage");

const storage = new CloudinaryStorage({
  cloudinary,
  cloudinaryOptions: {
    resource_type: "auto",
    upload_preset: "messageMedia",
  },
});

const upload = multer({ storage });

//registration endpoint
route.post("/api/register", createUser);

//login endpoint
route.post("/api/login", authenticateUser, async (req, res) => {
  const result = await User.findOne({
    username: req.verifiedUser.username,
  }).select({
    username: 1,
    firstName: 1,
    lastName: 1,
    profilePic: 1,
    newUser: 1,
  });
  res.send(result);
});

// logout endpoint
route.delete("/api/logout", authenticateUser, logout);

//getUserInfo
route.get("/api/userinfo/:username", getUserInfo);

//get friendlist
route.get("/api/friendlist", authenticateUser, getFriendList);

//send friendRequest
route.post("/api/friendrequest", authenticateUser, handleFriendRequest);

//get friend Requests
route.get("/api/friendrequest/:type?", authenticateUser, getFriendRequests);

//get people you may know
route.get("/api/peopleyoumayknow", authenticateUser, getPeopleYouMayKnow);

//update profilePic
route.post("/api/uploadprofilepic", authenticateUser, uploadProfilePic);

//get conversations
route.get("/api/conversations", authenticateUser, getConversations);

//get messages
route.get("/api/messages/:with", authenticateUser, getMessages);

//upload message medias
const cpUpload = upload.fields([
  { name: "images", maxCount: 50 },
  { name: "videos", maxCount: 50 },
  { name: "files", maxCount: 50 },
]);

//send media message using multipart/formdata
route.post(
  "/api/sendMediaMessage",
  authenticateUser,
  cpUpload,
  updateMediaMessage
);


//search people
route.get("/api/:search?", authenticateUser, getSearchResults);

module.exports = route;
