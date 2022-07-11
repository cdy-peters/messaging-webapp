import React from "react";

import SettingsHeader from "./settingsHeader";
import SettingsUsers from "./settingsUsers";

const Settings = (props) => {
  const {
    setShowSettings,
    selectedConversation,
    conversations,
    setConversations,
  } = props;

  return (
    <div id="settings">
      <SettingsHeader
        setShowSettings={setShowSettings}
        selectedConversation={selectedConversation}
      />

      <SettingsUsers
        selectedConversation={selectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />
    </div>
  );
};

export default Settings;
