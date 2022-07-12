import React from "react";

const URL = "RemovedIP";

const SettingsLeave = (props) => {
  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
    setShowSettings,
    socket,
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
        username: localStorage.getItem("username"),
        conversationId: selectedConversation.conversationId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const leftUser = data.leftUser;
        const notification = data.notification;

        const recipients = conversations.find(
          (conversation) =>
            conversation._id === selectedConversation.conversationId
        ).recipients;

        const newConversations = conversations.filter(
          (conversation) =>
            conversation._id.toString() !==
            selectedConversation.conversationId.toString()
        );
        setConversations(newConversations);

        socket.emit("user_left", {
          conversationId: selectedConversation.conversationId,
          leftUser: leftUser,
          notification: notification,
          recipients: recipients,
        });

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
