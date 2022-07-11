import React from "react";

import SettingsHeader from "./settingsHeader";
import SettingsName from "./settingsName";
import SettingsUsers from "./settingsUsers";
import SettingsLeave from "./settingsLeave";

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
      <SettingsHeader setShowSettings={setShowSettings} />

      <SettingsName
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />

      <SettingsUsers
        selectedConversation={selectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />

      <SettingsLeave
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        conversations={conversations}
        setConversations={setConversations}
        setShowSettings={setShowSettings}
      />
    </div>
  );
};

export default Settings;
