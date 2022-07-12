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
        const currentUser = conversation.recipients.find(
          (recipient) => recipient.userId.toString() === userId
        );

        const filteredRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== userId
        );

        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        return {
          _id: conversation._id,
          name: conversation.name,
          recipients: filteredRecipients,
          lastMessage,
          updatedAt: conversation.updatedAt,
          read: currentUser.read,
          role: currentUser.role,
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

router.post("/update_conversation_name", (req, res) => {
  const { conversationId, name, username } = req.body;

  Conversations.findOne({ _id: conversationId })
    .then((conversation) => {
      conversation.name = name;

      const notifications = conversation.notifications;
      const newNotification = {
        message: `${username} changed the conversation name to ${name}`,
      };
      notifications.push(newNotification);

      conversation
        .save()
        .then((conversation) => {
          res.json(
            conversation.notifications[conversation.notifications.length - 1]
          );
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/leave_conversation", (req, res) => {
  const { conversationId, userId, username } = req.body;

  Conversations.findOne({ _id: conversationId })
    .then((conversation) => {
      const recipient = conversation.recipients.find(
        (recipient) => recipient.userId.toString() === userId
      );
      conversation.recipients.pull(recipient);

      const notifications = conversation.notifications;
      const newNotification = {
        message: `${username} left`,
      };
      notifications.push(newNotification);

      conversation
        .save()
        .then((conversation) => {
          const notification =
            conversation.notifications[conversation.notifications.length - 1];

          res.json({ leftUser: userId, notification });
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
    const notifications = conversation.notifications;

    res.json({ messages, notifications });
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
          role: "owner",
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
      notifications: [
        {
          message: `${users[0].username} started a conversation with ${users[1].username}`,
        },
      ],
    });

    newConversation.save((err, conversation) => {
      if (err) throw err;

      const currentUser = conversation.recipients.find(
        (recipient) => recipient.userId.toString() === userId
      );
      const filteredRecipients = conversation.recipients.filter(
        (recipient) => recipient.userId.toString() !== userId
      );

      res.json({
        _id: conversation._id,
        name: conversation.name,
        recipients: filteredRecipients,
        lastMessage: {
          message: "",
          sender: "",
          createdAt: "",
        },
        updatedAt: conversation.updatedAt,
        read: currentUser.read,
        role: currentUser.role,
      });
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

router.post("/update_owner", (req, res) => {
  const { userId, username, conversationId, recipientId, recipientUsername } =
    req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const recipients = conversation.recipients.map((recipient) => {
      if (recipient.userId.toString() === userId) {
        return {
          userId: recipient.userId,
          username: recipient.username,
          role: "user",
          read: recipient.read,
        };
      } else if (recipient.userId.toString() === recipientId) {
        return {
          userId: recipient.userId,
          username: recipient.username,
          role: "owner",
          read: recipient.read,
        };
      } else {
        return recipient;
      }
    });
    conversation.recipients = recipients;

    const notifications = conversation.notifications;
    const newNotification = {
      message: `${username} made ${recipientUsername} owner`,
    };
    notifications.push(newNotification);

    conversation
      .save()
      .then((conversation) => {
        const notification =
          conversation.notifications[conversation.notifications.length - 1];
        res.json({ notification });
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

router.post("/add_user", (req, res) => {
  const { userId, username, conversationId, recipientId, recipientUsername } =
    req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const recipients = conversation.recipients;
    const newRecipient = {
      userId: recipientId,
      username: recipientUsername,
      read: false,
    };
    recipients.push(newRecipient);

    const notifications = conversation.notifications;
    const newNotification = {
      message: `${username} added ${recipientUsername}`,
    };
    notifications.push(newNotification);

    conversation
      .save()
      .then((conversation) => {
        const newRecipient = conversation.recipients.find(
          (recipient) => recipient.userId.toString() === recipientId
        );
        const notification =
          conversation.notifications[conversation.notifications.length - 1];

        res.json({ newRecipient, notification });
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

router.post("/remove_user", (req, res) => {
  const { userId, username, conversationId, recipientId, recipientUsername } =
    req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const recipients = conversation.recipients;
    const newRecipients = recipients.filter(
      (recipient) => recipient.userId.toString() !== recipientId
    );
    conversation.recipients = newRecipients;

    const notifications = conversation.notifications;
    const newNotification = {
      message: `${username} removed ${recipientUsername}`,
    };
    notifications.push(newNotification);

    conversation
      .save()
      .then((conversation) => {
        const newRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== userId
        );
        const notification =
          conversation.notifications[conversation.notifications.length - 1];

        res.json({
          newRecipients,
          removedRecipient: recipientId,
          notification,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

module.exports = router;
