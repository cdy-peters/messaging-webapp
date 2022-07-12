import React, { useState, useEffect } from "react";

import ConversationsHeader from "./conversationsHeader";
import Search from "./search";
import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";
import Messages from "../Messages/messages";
import Settings from "../Settings/settings";

const URL = "RemovedIP";
var selectChat;

const Conversations = (props) => {
  const { socket } = props;

  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);

  try {
    selectChat = selectedConversation.conversationId;
  } catch (error) {
    selectChat = null;
  }

  useEffect(() => {
    socket.on("message", (data) => {
      var read = false;

      if (data.conversationId === selectChat) {
        setMessages((messages) => [...messages, data]);
        read = true;

        fetch(URL + "read_conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: data.conversationId,
            userId: localStorage.getItem("token"),
          }),
        });
      }
      // TODO: Redo the returned json from /send_message to be alike /get_messages
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].lastMessage = {
          message: data.message,
          sender: data.sender,
          _id: data._id,
        };
        newConversations[index].updatedAt = data.updatedAt;
        newConversations[index].read = read;
        return newConversations;
      });
    });
  }, [socket]);

  return (
    <div className="container">
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-4" id="conversations">
          <ConversationsHeader />

          <Search search={search} setSearch={setSearch} />

          <NewConversation
            conversations={conversations}
            setSelectedConversation={setSelectedConversation}
            search={search}
            setShowSettings={setShowSettings}
          />

          <ExistingConversation
            socket={socket}
            conversations={conversations}
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            search={search}
            setShowSettings={setShowSettings}
          />
        </div>

        <div className="col-8" id="messages">
          {selectedConversation && !showSettings && (
            <Messages
              socket={socket}
              conversations={conversations}
              setConversations={setConversations}
              selectedConversation={selectedConversation}
              messages={messages}
              setMessages={setMessages}
              setShowSettings={setShowSettings}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

          {showSettings && (
            <Settings
              setShowSettings={setShowSettings}
              selectedConversation={selectedConversation}
              conversations={conversations}
              setConversations={setConversations}
              setSelectedConversation={setSelectedConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
