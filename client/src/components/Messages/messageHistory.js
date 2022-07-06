import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const URL = "RemovedIP";

const MessageHistory = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getMessages() {
      const response = await fetch(URL + "get_messages", {
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
    const socket = socketIOClient(URL);
    socket.on(
      "message",
      (data) => {
        setMessages([...messages, data]);
      },
      []
    );
  });

  const renderMessage = (message) => {
    if (message.sender === localStorage.getItem('username')) {
      return (
        <div key={message._id} className='message-sent'>
          <p className="messages-time">Time</p>
          <p className="messages-message">{message.message}</p>
        </div>
      )
    } else {
      return (
        <div key={message._id} className='message-received'>
          <p className="messages-time">Time</p>
          <p className="messages-message">{message.message}</p>
        </div>
      )
    }
  }


  return (
    <div>
      {messages.map((message) => (
        renderMessage(message)
      ))}
    </div>
  );
};

export default MessageHistory;
