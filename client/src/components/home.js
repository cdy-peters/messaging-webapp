import React, { useState } from "react";
import io from "socket.io-client";
import { useContextProvider } from "../utils/context";

import Conversations from "./Conversations/conversations";
import Messages from "./Messages/messages";
import Settings from "./Settings/settings";

const URL = "RemovedIP";
const socket = io(URL);
socket.emit("user_connected", {
  userId: localStorage.getItem("token"),
});

const Home = () => {
  const { selectedConversation, showSettings } = useContextProvider();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="container">
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-4" id="conversations">
          <Conversations
            socket={socket}
            conversations={conversations}
            setConversations={setConversations}
            setMessages={setMessages}
            setNotifications={setNotifications}
          />
        </div>

        <div className="col-8" id="messages">
          {!selectedConversation && <div id="messages-placeholder"></div>}

          {selectedConversation && !showSettings && (
            <Messages
              socket={socket}
              conversations={conversations}
              setConversations={setConversations}
              messages={messages}
              setMessages={setMessages}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

          {showSettings && (
            <Settings
              conversations={conversations}
              setConversations={setConversations}
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
