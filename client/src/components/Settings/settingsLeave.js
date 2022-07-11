import React from "react";

const URL = "RemovedIP";

const SettingsLeave = (props) => {
  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
    setShowSettings,
  } = props;

  const handleClick = () => {
    const url = URL + "leave_conversation";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("token"),
        conversationId: selectedConversation.conversationId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newConversations = conversations.filter(
          (conversation) =>
            conversation._id.toString() !==
            selectedConversation.conversationId.toString()
        );
        setConversations(newConversations);

        setSelectedConversation(null);
        setShowSettings(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div id="settings-leave">
      <button id="settings-leave-button" onClick={handleClick}>
        Leave
      </button>
    </div>
  );
};

export default SettingsLeave;
