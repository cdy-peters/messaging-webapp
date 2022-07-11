import React from "react";

const SettingsHeader = (props) => {
  const { setShowSettings, selectedConversation } = props;

  const handleClick = (e) => {
    e.preventDefault();
    setShowSettings(false);
  };

  return (
    <div id="settings-header">
      <h3>{selectedConversation.username} Conversation Settings</h3>

      <button id="settings-button" onClick={handleClick}>
        Close
      </button>
    </div>
  );
};

export default SettingsHeader;
