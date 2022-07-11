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
        const read = conversation.recipients.find(
          (recipient) => recipient.userId.toString() === userId
        ).read;

        const filteredRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== userId
        );

        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        return {
          _id: conversation._id,
          recipients: filteredRecipients,
          lastMessage,
          updatedAt: conversation.updatedAt,
          read,
        };
      });

      res.json(filteredConversations);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/read_conversation", (req, res) => {
  const { conversationId, userId } = req.body;

  Conversations.findOne({ _id: conversationId })
    .then((conversation) => {
      const recipient = conversation.recipients.find(
        (recipient) => recipient.userId.toString() === userId
      );
      recipient.read = true;

      conversation
        .save()
        .then((conversation) => {
          res.json(conversation);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/get_users", (req, res) => {
  const { userId, search, conversations } = req.body;

  User.find({
    _id: {
      $ne: mongoose.Types.ObjectId(userId),
    },
    username: search,
  })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/get_messages", (req, res) => {
  const { conversationId } = req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const messages = conversation.messages;

    res.json(messages);
  });
});

router.post("/new_conversation", (req, res) => {
  const { userId, recipientId } = req.body;

  User.find({ _id: { $in: [userId, recipientId] } }, (err, users) => {
    if (err) throw err;

    const recipients = users.map((user) => {
      if (user._id.toString() === userId) {
        return {
          userId: user._id,
          username: user.username,
          read: true,
        };
      } else {
        return {
          userId: user._id,
          username: user.username,
        };
      }
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
  const { conversationId, senderId, senderUser, message } = req.body;

  User.findById(senderId, (err, user) => {
    if (err) throw err;

    Conversations.findOne({ _id: conversationId }, (err, conversation) => {
      if (err) throw err;

      const recipients = conversation.recipients;
      const newMessage = {
        sender: user.username,
        message: message,
      };

      conversation.messages.push(newMessage);

      recipients.forEach((recipient) => {
        if (recipient.userId.toString() === senderId) {
          recipient.read = true;
        } else {
          recipient.read = false;
        }
      });

      conversation
        .save()
        .then((conversation) => {
          const lastMessageId =
            conversation.messages[conversation.messages.length - 1]._id;

          res.json({
            ...conversation._doc,
            recipients: recipients,
            message: {
              conversationId: conversation._id,
              _id: lastMessageId,
              senderId: user._id,
              sender: user.username,
              message: message,
              updatedAt: conversation.updatedAt,
            },
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });
  });
});

router.post("/add_user", (req, res) => {
  const { userId, conversationId, recipientId, recipientUsername } = req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const recipients = conversation.recipients;
    const newRecipient = {
      userId: recipientId,
      username: recipientUsername,
      read: false,
    };

    recipients.push(newRecipient);

    conversation
      .save()
      .then((conversation) => {
        const newRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== userId
        );

        res.json(newRecipients);
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

module.exports = router;
