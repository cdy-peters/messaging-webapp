const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    recipients: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        role: { type: String, default: "user" },
        read: { type: Boolean, default: false },
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
