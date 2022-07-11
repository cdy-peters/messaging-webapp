import React from "react";

import SettingsHeader from "./settingsHeader";
import SettingsUsers from "./settingsUsers";
import SettingsName from "./settingsName";

const Settings = (props) => {
  const {
    setShowSettings,
    selectedConversation,
    conversations,
    setConversations,
    setSelectedConversation,
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

      <SettingsName
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />
    </div>
  );
};

export default Settings;
