import React from "react";
import io from "socket.io-client";

import Conversations from "./Conversations/conversations";

const URL = "RemovedIP";
const socket = io(URL);
socket.emit("user_connected", {
  userId: localStorage.getItem("token"),
});

const Home = () => {
  return (
    <div>
      <Conversations socket={socket} />
    </div>
  );
};

export default Home;
