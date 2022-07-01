require("dotenv").config({ path: "./config/keys.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error(err);
  });


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(require("./routes/entry"));
app.use(require("./routes/conversations"));
