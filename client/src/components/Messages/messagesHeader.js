import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import MessageNotifications from "./messageNotifications";

const MessagesHeader = (props) => {
  const { selectedConversation, notifications } = props;
  var name;

  if (selectedConversation.conversationId || selectedConversation.name) {
    name = selectedConversation.name;
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

      <MessageNotifications notifications={notifications} />

      <button id="settings-button" onClick={handleSettings}>
        <FontAwesomeIcon icon={faCog} />
      </button>
    </div>
  );
};

export default MessagesHeader;
