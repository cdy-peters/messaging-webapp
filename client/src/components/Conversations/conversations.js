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
    socket.on("new_message", (data) => {
      var read = false;

      if (data.conversationId === selectChat) {
        setMessages((messages) => [...messages, data.message]);
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

      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].lastMessage = {
          message: data.message.message,
          sender: data.message.sender,
          _id: data.message._id,
        };
        newConversations[index].updatedAt = data.updatedAt;
        newConversations[index].read = read;
        return newConversations;
      });
    });
  }, [socket]);

  useEffect(() => {
    socket.on("update_conversation_name", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].name = data.name;
        return newConversations;
      });

      setSelectedConversation((selectedConversation) => {
        const newSelectedConversation = { ...selectedConversation };
        if (newSelectedConversation.conversationId === data.conversationId) {
          newSelectedConversation.name = data.name;
        }
        return newSelectedConversation;
      });

      setNotifications((notifications) => [
        ...notifications,
        data.notification,
      ]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("add_user", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].recipients.push(data.newRecipient);
        return newConversations;
      });

      setNotifications((notifications) => [
        ...notifications,
        data.notification,
      ]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("remove_user", (data) => {
      if (data.removedRecipient === localStorage.getItem("token")) {
        setConversations((conversations) => {
          const newConversations = [...conversations];
          const index = newConversations.findIndex(
            (conversation) => conversation._id === data.conversationId
          );
          newConversations.splice(index, 1);
          return newConversations;
        });

        setSelectedConversation(null);
      } else {
        setConversations((conversations) => {
          const newConversations = [...conversations];
          const index = newConversations.findIndex(
            (conversation) => conversation._id === data.conversationId
          );
          newConversations[index].recipients = newConversations[
            index
          ].recipients.filter(
            (recipient) => recipient.userId !== data.removedRecipient
          );
          return newConversations;
        });

        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("user_left", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].recipients = newConversations[
          index
        ].recipients.filter((recipient) => recipient.userId !== data.leftUser);
        return newConversations;
      });

      setNotifications((notifications) => [
        ...notifications,
        data.notification,
      ]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("owner_updated", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );

        const newRecipients = newConversations[index].recipients.map(
          (recipient) => {
            if (recipient.userId === data.newOwner) {
              recipient.role = "owner";
            } else {
              recipient.role = "user";
            }
            return recipient;
          }
        );

        newConversations[index].recipients = newRecipients;
        if (data.newOwner === localStorage.getItem("token")) {
          newConversations[index].role = "owner";
        }

        return newConversations;
      });

      setNotifications((notifications) => [
        ...notifications,
        data.notification,
      ]);
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
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            search={search}
            setShowSettings={setShowSettings}
            setMessages={setMessages}
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
              setSelectedConversation={setSelectedConversation}
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
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
