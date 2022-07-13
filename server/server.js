require("dotenv").config({ path: "./config/keys.env" });
const express = require("express");
const cors = require("cors");
const connDb = require("./config/db");

connDb();
const app = express();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(require("./routes/entryRoutes"));
app.use(require("./routes/conversationRoutes"));

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("user_connected", (user) => {
    if (user.userId) {
      socket.join(user.userId);
      console.log(user.userId, "connected to room");
    }
  });

  socket.on("new_conversation", (conversation) => {
    const recipients = conversation.recipients;

    recipients.forEach((recipient) => {
      const currentUser = recipients.find(
        (user) => user.userId === recipient.userId
      );
      const filteredRecipients = recipients.filter(
        (user) => user.userId !== recipient.userId
      );

      const user_data = {
        _id: conversation._id,
        name: conversation.name,
        recipients: filteredRecipients,
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
        read: currentUser.read,
        role: currentUser.role,
      };

      socket.in(recipient.userId).emit("new_conversation", user_data);
    });
  });

  socket.on("new_message", (data) => {
    const recipients = data.recipients;
    const message = data.message;

    recipients.forEach((recipient) => {
      if (recipient.userId === message.senderId) return;

      socket.in(recipient.userId).emit("new_message", {
        conversationId: data.conversationId,
        message,
        updatedAt: data.updatedAt,
      });
    });
  });

  socket.on("update_conversation_name", (data) => {
    const recipients = data.recipients;

    recipients.forEach((recipient) => {
      socket.in(recipient.userId).emit("update_conversation_name", {
        conversationId: data.conversationId,
        name: data.name,
        notification: data.notification,
      });
    });
  });

  socket.on("add_user", (data) => {
    const recipients = data.recipients;
    const new_user_data = data.new_user_data;

    new_user_data._id = data.conversationId;
    new_user_data.read = data.newRecipient.read;
    new_user_data.role = data.newRecipient.role;

    recipients.forEach((recipient) => {
      if (recipient.userId === data.newRecipient.userId) {
        socket
          .in(recipient.userId)
          .emit("added_to_conversation", new_user_data);
      } else {
        socket.in(recipient.userId).emit("add_user", {
          conversationId: data.conversationId,
          newRecipient: data.newRecipient,
          notification: data.notification,
        });
      }
    });
  });

  socket.on("remove_user", (data) => {
    const recipients = data.recipients;

    recipients.forEach((recipient) => {
      socket.in(recipient.userId).emit("remove_user", {
        conversationId: data.conversationId,
        removedRecipient: data.removedRecipient,
        notification: data.notification,
      });
    });

    socket.in(data.removedRecipient).emit("remove_user", {
      conversationId: data.conversationId,
      removedRecipient: data.removedRecipient,
    });
  });

  socket.on("user_left", (data) => {
    const recipients = data.recipients;

    recipients.forEach((recipient) => {
      socket.in(recipient.userId).emit("user_left", {
        conversationId: data.conversationId,
        leftUser: data.leftUser,
        notification: data.notification,
      });
    });
  });

  socket.on("owner_updated", (data) => {
    const recipients = data.recipients;

    recipients.forEach((recipient) => {
      socket.in(recipient.userId).emit("owner_updated", {
        conversationId: data.conversationId,
        oldOwner: data.oldOwner,
        newOwner: data.newOwner,
        notification: data.notification,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
