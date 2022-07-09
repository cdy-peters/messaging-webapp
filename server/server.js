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
      socket.in(recipient.userId).emit("new_conversation", conversation);
    });
  });

  socket.on("new_message", (data) => {
    const recipients = data.recipients;
    const message = data.message;

    recipients.forEach((recipient) => {
      if (recipient.userId === message.senderId) return;

      socket.in(recipient.userId).emit("message", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
