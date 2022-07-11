import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

const MessagesHeader = (props) => {
  const { username } = props;

  const handleClick = (e) => {
    e.preventDefault();
    props.setShowSettings(true);
  };

  return (
    <div id="messages-header">
      <h3>{username}</h3>

      <button id="settings-button" onClick={handleClick}>
        <FontAwesomeIcon icon={faCog} />
      </button>
    </div>
  );
};

export default MessagesHeader;
