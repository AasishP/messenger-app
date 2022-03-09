const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    timestamp: { type: Date, default: new Date() },
    seen: { type: Boolean, default: false },
    text: { type: String },
    media: {
      images: [
        {
          original_name: { type: String, required: true },
          secure_url: { type: String, required: true },
        },
      ],
      videos: [
        {
          original_name: { type: String, required: true },
          secure_url: { type: String, required: true },
        },
      ],
      links: [{ type: String }],
      files: [
        {
          original_name: { type: String, required: true },
          secure_url: { type: String, required: true },
        },
      ],
    },
  },
  {
    collection: "messages",
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
