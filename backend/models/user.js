const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  with: { type: String, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
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
    roomsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestsPending: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ], // friendRequest sent but not accepted yet.
    conversations: [conversationSchema],
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
