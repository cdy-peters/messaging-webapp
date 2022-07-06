import React, { useState } from "react";

const URL = "RemovedIP";

const MessageField = (props) => {
  const { socket, messages, setMessages } = props;
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(URL + "send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: props.conversationId,
        senderId: localStorage.getItem("token"),
        message: newMessage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit("new_message", data);
        setMessages([...messages, data.message]);
      });

    setNewMessage("");
  };

  return (
    <form id="messages-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Send message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageField;
