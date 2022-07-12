import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import MessageNotifications from "./messageNotifications";

const MessagesHeader = (props) => {
  const { name, notifications } = props;

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
