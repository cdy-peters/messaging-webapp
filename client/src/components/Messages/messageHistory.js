import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");
    socket.on("message", (data) => {
        setMessages([...messages, data]);
    }, []);
  });

  return <div>
    <ul>
        {messages.map((message, index) => {
            return <li key={index}>{message}</li>
        }
        )}
    </ul>
  </div>;
};

export default MessageHistory;
