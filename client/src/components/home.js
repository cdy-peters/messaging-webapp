import React, { useState, useEffect } from "react";
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
var selectChat;

const Home = (props) => {
  const { isMobile } = props;

  const {
    activeComponent,
    selectedConversation,
    setSelectedConversation,
    showSettings,
  } = useContextProvider();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
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

      if (data.conversationId === selectChat) {
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
      }
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

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
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

        if (data.conversationId === selectChat) {
          setSelectedConversation(null);
        }
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

        if (data.conversationId === selectChat) {
          setNotifications((notifications) => [
            ...notifications,
            data.notification,
          ]);
        }
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

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
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

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  if (!isMobile) {
    return (
      <div className="container">
        <div className="row">
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
  } else {
    if (activeComponent === "conversations") {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12" id="conversations">
              <Conversations
                socket={socket}
                conversations={conversations}
                setConversations={setConversations}
                setMessages={setMessages}
                setNotifications={setNotifications}
              />
            </div>
          </div>
        </div>
      );
    } else if (activeComponent === "messages") {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12" id="messages">
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
                  isMobile={isMobile}
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
    } else if (activeComponent === "settings") {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12" id="settings">
              <Settings
                conversations={conversations}
                setConversations={setConversations}
                socket={socket}
              />
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Home;
