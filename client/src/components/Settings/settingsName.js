import React, { useState } from "react";

const URL = "RemovedIP";

const SettingsName = (props) => {
  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
  } = props;
  const [newName, setNewName] = useState("");

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newName !== selectedConversation.name) {
      fetch(URL + "update_conversation_name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation.conversationId,
          name: newName,
          username: localStorage.getItem("username"),
        }),
      });

      setSelectedConversation({
        ...selectedConversation,
        name: newName,
      });

      const newConversations = [...conversations];
      newConversations.forEach((conversation) => {
        if (conversation._id === selectedConversation.conversationId) {
          conversation.name = newName;
        }
      });
      setConversations(newConversations);

      setNewName("");
    }
  };

  return (
    <div className="settings-name">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newName}
          onChange={handleChange}
          placeholder="Conversation name"
        />
        <button type="submit">Change</button>
      </form>
    </div>
  );
};

export default SettingsName;
