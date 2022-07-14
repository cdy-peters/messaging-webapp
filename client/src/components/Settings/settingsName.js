import React, { useState } from "react";

const URL = "RemovedIP";

const SettingsName = (props) => {
  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
    socket,
  } = props;
  const [newName, setNewName] = useState("");

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      newName !== selectedConversation.name &&
      selectedConversation.conversationId
    ) {
      const response = await fetch(URL + "update_conversation_name", {
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
      const newNotification = await response.json();

      setSelectedConversation({
        ...selectedConversation,
        name: newName,
      });

      const newConversations = [...conversations];
      newConversations.forEach((conversation) => {
        if (conversation._id === selectedConversation.conversationId) {
          socket.emit("update_conversation_name", {
            conversationId: selectedConversation.conversationId,
            name: newName,
            recipients: conversation.recipients,
            notification: newNotification,
          });

          conversation.name = newName;
        }
      });
      setConversations(newConversations);
    } else {
      setSelectedConversation({
        ...selectedConversation,
        name: newName,
      });
    }
    setNewName("");
  };

  return (
    <div className="settings-change-name">
      <h5>Change conversation name</h5>
      <form onSubmit={handleSubmit}>
        <input
          id="conversation-name-input"
          type="text"
          value={newName}
          onChange={handleChange}
          placeholder="Conversation name"
        />
        <button type="submit" id="change-conversation-button">
          Change
        </button>
      </form>
    </div>
  );
};

export default SettingsName;
