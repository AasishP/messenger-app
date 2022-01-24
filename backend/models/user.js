const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
  seen: { type: Boolean, default: false },
  text: { type: String },
  media: {
    uploading: { type: Boolean },
    images: [{ type: String }],
    videos: [{ type: String }],
    links: [{ type: String }],
    files: [{ type: String }],
  },
});

const conversationSchema = new mongoose.Schema({
  with: { type: String, required: true },
  messages: [messageSchema],
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    validTokens: [{ type: String }],
    signupDate: { type: Date, default: Date.now() },
    profilePic: { type: String },
    newUser: { type: Boolean, default: true, required: true }, //user just registerd.
    online: { type: Boolean, default: false, required: true },
    roomsJoined: [{ type: String }],
    friendList: [{ type: String }],
    friendRequests: [{ type: String }],
    friendRequestsPending: [{ type: String }], // friendRequest sent but not accepted yet.
    conversations: [conversationSchema],
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
