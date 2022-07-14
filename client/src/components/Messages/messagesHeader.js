import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import MessageNotifications from "./messageNotifications";

const MessagesHeader = (props) => {
  const { conversations, selectedConversation, notifications } = props;
  var name;

  if (selectedConversation.conversationId) {
    const conversation = conversations.find(
      (conversation) => conversation._id === selectedConversation.conversationId
    );

    if (conversation.name) {
      name = conversation.name;
    } else {
      if (conversation.recipients.length === 1) {
        name = conversation.recipients[0].name;
      } else if (conversation.recipients.length > 1) {
        name = conversation.recipients
          .map((recipient) => {
            return recipient.username;
          })
          .join(", ");
      } else {
        name = "All users left";
      }
    }
  } else {
    name = selectedConversation.recipients
      .map((recipient) => recipient.username)
      .join(", ");
  }

  const handleSettings = (e) => {
    e.preventDefault();
    props.setShowSettings(true);
  };

  return (
    <div id="messages-header">
      <h3>{name}</h3>

      <div id="messages-header-buttons">
        <MessageNotifications notifications={notifications} />

        <button id="settings-button" onClick={handleSettings}>
          <FontAwesomeIcon icon={faCog} />
        </button>
      </div>
    </div>
  );
};

export default MessagesHeader;
