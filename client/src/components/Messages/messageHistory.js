import React, { useEffect } from "react";

const URL = "RemovedIP";
var selectChat;

const MessageHistory = (props) => {
  const { socket, messages, setMessages, conversationId } = props;
  selectChat = conversationId;
  
  useEffect(() => {
    async function getMessages() {
      const response = await fetch(URL + "get_messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
        }),
      });
      const data = await response.json();

      setMessages(data);
    }
    getMessages();
  }, [conversationId]);

  useEffect(() => {
    socket.on("message", (data) => {
      if (data.conversationId === selectChat) {
        setMessages((messages) => [...messages, data]);
      }
    });
  }, [socket]);

  const renderMessage = (message) => {
    if (message.sender === localStorage.getItem("username")) {
      return (
        <div key={message._id} className="message-sent">
          <p className="messages-time">Time</p>
          <p className="messages-message">{message.message}</p>
        </div>
      );
    } else {
      return (
        <div key={message._id} className="message-received">
          <p className="messages-time">Time</p>
          <p className="messages-message">{message.message}</p>
        </div>
      );
    }
  };

  return <div>{messages.map((message) => renderMessage(message))}</div>;
};

export default MessageHistory;
