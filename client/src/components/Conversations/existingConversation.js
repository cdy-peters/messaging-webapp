import React, { useEffect } from "react";

const ExistingConversations = (props) => {
  const {
    conversations,
    setConversations,
    setSelectedConversation,
    setSelectedUser,
  } = props;

  const handleClick = (e) => {
    setSelectedConversation(e.target.value);
    setSelectedUser(null);
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

  return (
    <div>
      <h1>Conversations</h1>

      {conversations.map((conversation) => (
        <button
          key={conversation._id}
          value={conversation._id}
          onClick={handleClick}
        >
          {conversation._id}
        </button>
      ))}
    </div>
  );
};

export default ExistingConversations;
