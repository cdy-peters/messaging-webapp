import React, { useState } from "react";
import { useContextProvider } from "../../utils/context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const URL = "RemovedIP";

const MessageField = (props) => {
  const {
    socket,
    messages,
    setMessages,
    setConversations,
    conversations,
  } = props;

  const {
    selectedConversation,
    setSelectedConversation,
  } = useContextProvider();

  const conversationId = selectedConversation.conversationId;

  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (conversationId) {
      fetch(URL + "send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          senderId: localStorage.getItem("token"),
          senderUsername: localStorage.getItem("username"),
          message: newMessage,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const newConversations = conversations.map((conversation) => {
            if (conversation._id === conversationId) {
              conversation.lastMessage = data.lastMessage;
              conversation.updatedAt = data.updatedAt;

              socket.emit("new_message", {
                conversationId: conversationId,
                recipients: conversation.recipients,
                message: data.lastMessage,
                updatedAt: data.updatedAt,
              });
            }
            return conversation;
          });

          setConversations(newConversations);
          setMessages([...messages, data.lastMessage]);
          setNewMessage("");
        })
        .catch((err) => console.log(err));
    } else {
      fetch(URL + "new_conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
          username: localStorage.getItem("username"),
          name: selectedConversation.name,
          recipients: selectedConversation.recipients,
          message: newMessage,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const socket_data = data.socket_data;
          const user_data = data.user_data;

          socket.emit("new_conversation", socket_data);

          setConversations([...conversations, user_data]);
          setSelectedConversation({
            conversationId: user_data._id,
            name: selectedConversation.name,
          });
          setMessages([...messages, user_data.lastMessage]);
          setNewMessage("");
        });
    }
  };

  return (
    <form id="messages-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Send message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button type="submit" id="message-send-button">
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default MessageField;
