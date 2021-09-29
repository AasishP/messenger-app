const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    members: [{ type: String }],
    admin: [{ type: String }],
    messages: [
      {
        from: { type: String, required: true },
        timestamp: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    collection: "rooms",
  }
);

const Room = mongoose.model("room", roomSchema);

module.exports = Room 
