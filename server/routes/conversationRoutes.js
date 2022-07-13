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
  const { userId, username, recipientId, recipientUsername, message } =
    req.body;

  const newConversation = new Conversations({
    recipients: [
      {
        userId: mongoose.Types.ObjectId(userId),
        username: username,
        read: true,
        role: "owner",
      },
      {
        userId: mongoose.Types.ObjectId(recipientId),
        username: recipientUsername,
      },
    ],
    messages: [
      {
        sender: username,
        senderId: mongoose.Types.ObjectId(userId),
        message,
      },
    ],
    notifications: [
      {
        message: `${username} started a conversation with ${recipientUsername}`,
      },
    ],
  });

  newConversation
    .save()
    .then((conversation) => {
      const currentUser = conversation.recipients.find(
        (recipient) => recipient.userId.toString() === userId
      );
      const filteredRecipients = conversation.recipients.filter(
        (recipient) => recipient.userId.toString() !== userId
      );
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];

      const socket_data = {
        _id: conversation._id,
        name: conversation.name,
        recipients: conversation.recipients,
        lastMessage,
        updatedAt: conversation.updatedAt,
      };

      const user_data = {
        _id: conversation._id,
        name: conversation.name,
        recipients: filteredRecipients,
        lastMessage: lastMessage,
        updatedAt: conversation.updatedAt,
        read: currentUser.read,
        role: currentUser.role,
      };

      res.json({ socket_data: socket_data, user_data: user_data });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/send_message", (req, res) => {
  const { conversationId, senderId, senderUsername, message } = req.body;

  Conversations.findOne({ _id: conversationId }, (err, conversation) => {
    if (err) throw err;

    const newMessage = {
      sender: senderUsername,
      senderId: mongoose.Types.ObjectId(senderId),
      message,
    };

    conversation.messages.push(newMessage);

    conversation
      .save()
      .then((conversation) => {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        res.json({
          lastMessage,
          conversationId,
          updatedAt: conversation.updatedAt,
        });
      })
      .catch((err) => {
        res.json(err);
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

        const filteredRecipients = conversation.recipients.filter(
          (recipient) => recipient.userId.toString() !== recipientId
        );

        const new_user_data = {
          name: conversation.name,
          recipients: filteredRecipients,
          lastMessage: conversation.messages[conversation.messages.length - 1],
          updatedAt: conversation.updatedAt,
        };

        res.json({ newRecipient, notification, new_user_data });
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
