import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const MessageHistory = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getMessages() {
      const response = await fetch("http://localhost:5000/get_messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: props.conversationId,
        }),
      });
      const data = await response.json();
      console.log(data);

      setMessages(data);
    }
    getMessages();
  }, [props.conversationId]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");
    socket.on(
      "message",
      (data) => {
        setMessages([...messages, data]);
      },
      []
    );
  });

  return (
    <div>
      {messages.map((message) => (
        <p key={message._id}>
          {message.sender}: {message.message}
        </p>
      ))}
    </div>
  );
};

export default MessageHistory;
