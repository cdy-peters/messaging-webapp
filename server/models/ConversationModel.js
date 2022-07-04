const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    recipients: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],
    messages: [
      {
        sender: { type: String, ref: "User" },
        message: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
