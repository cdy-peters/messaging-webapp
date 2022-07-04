const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const User = require("../models/UserModel");
const Conversations = require("../models/ConversationModel");

router.post("/get_conversations", (req, res) => {
  const { userId } = req.body;

  Conversations.find({
    recipients: {
      $elemMatch: {
        userId: mongoose.Types.ObjectId(userId),
      },
    },
    $nor: [{ messages: { $size: 0 } }],
  })
    .then((conversations) => {
      const filteredConversations = conversations.map((conversation) => {
        const filteredRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== userId
        );
        return { ...conversation._doc, recipients: filteredRecipients };
      }
      );

      res.json(filteredConversations);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/get_users", (req, res) => {
  const { userId, search } = req.body;

  User.find({
    _id: {
      $ne: mongoose.Types.ObjectId(userId),
    },
    username: search
  })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    }
    );
});

router.post("/get_messages", (req, res) => {
  const { conversationId } = req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    res.json(conversation.messages);
  });
});

router.post("/new_conversation", (req, res) => {
  const { userId, recipientId } = req.body;

  User.find({ _id: { $in: [userId, recipientId] } }, (err, users) => {
    if (err) throw err;

    const recipients = users.map((user) => {
      return { userId: user._id, username: user.username };
    });
    
    const newConversation = new Conversations({
      recipients: recipients,
      messages: [],
    });

    newConversation.save((err, conversation) => {
      if (err) throw err;

      res.json(conversation);
    });
  });
});

router.post("/send_message", (req, res) => {
  const { conversationId, senderId, message } = req.body;

  console.log(req.body);

  Conversations.findOneAndUpdate(
    { _id: conversationId },
    { $push: { messages: { sender: senderId, message: message } } },
    { new: true },
    (err, conversation) => {
      if (err) throw err;

      const lastMessageId =
        conversation.messages[conversation.messages.length - 1]._id;
      req.io.sockets.emit("message", {
        _id: lastMessageId,
        sender: senderId,
        message: message,
      });

      res.json(conversation);
    }
  );
});

module.exports = router;
