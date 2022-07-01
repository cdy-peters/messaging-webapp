import React, { useState, useEffect } from "react";

import Messages from "../Messages/messages";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleClick = (e) => {
    setSelectedConversation(e.target.value);
  };

  useEffect(() => {
    async function getConversations() {
      const response = await fetch("http://localhost:5000/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
        }),
      });
      const data = await response.json();

      setConversations(data);
    }
    getConversations();
  }, []);

  return (
    <div>
      <h1>Conversations</h1>

      {conversations.map((conversation) => (
        <button
          key={conversation._id}
          value={conversation._id}
          onClick={handleClick}
        >
          {conversation.recipients[0]}
        </button>
      ))}

      <Messages conversationId={selectedConversation} />
    </div>
  );
};

export default Conversations;
