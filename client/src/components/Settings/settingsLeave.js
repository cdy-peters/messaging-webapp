import React from "react";
import { useContextProvider } from "../../utils/context";

const URL = "RemovedIP";

const SettingsLeave = (props) => {
  const { conversations, setConversations, socket } = props;

  const {
    selectedConversation,
    setSelectedConversation,
    setShowSettings,
  } = useContextProvider();

  const handleLeave = () => {
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

  const handleDelete = () => {
    fetch(URL + "delete_conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      .catch((err) => console.log(err));
  };

  const leaveButton = () => {
    const conversation = conversations.find(
      (conversation) => conversation._id === selectedConversation.conversationId
    );

    if (conversation.recipients.length === 0) {
      return (
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete conversation
        </button>
      );
    } else {
      if (conversation.role === "owner") {
        return (
          <button className="btn btn-danger" onClick={handleLeave} disabled>
            Leave conversation
          </button>
        );
      } else {
        return (
          <button className="btn btn-danger" onClick={handleLeave}>
            Leave conversation
          </button>
        );
      }
    }
  };

  return <div id="settings-leave">{leaveButton()}</div>;
};

export default SettingsLeave;
