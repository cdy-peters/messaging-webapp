import React, { useState, useEffect } from "react";

import Messages from "../Messages/messages";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClick = (e) => {
    setSelectedConversation(e.target.value);
    setSelectedUser(null);
  };

  const handleClick2 = (e) => {
    setSelectedUser(e.target.value);
    setSelectedConversation(null);
  };

  useEffect(() => {
    async function getConversations() {
      const response = await fetch("http://localhost:5000/get_conversations", {
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

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("http://localhost:5000/get_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
        }),
      });
      const data = await response.json();

      setUsers(data);
    }
    getUsers();
  }, []);

  return (
    <div>
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
      </div>

      <div>
        <h1>New Conversation</h1>

        {users.map((user) => (
          <button
            key={user._id}
            value={user._id}
            onClick={handleClick2}
          >
            {user.username}
          </button>
        ))}

      </div>

      <Messages conversationId={selectedConversation} recipientId={selectedUser} />
    </div>
  );
};

export default Conversations;
